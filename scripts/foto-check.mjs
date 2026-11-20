// Foto-Check: finds photos that would leak private data or display wrongly.
//
//   npm run fotos:pruefen      → lists problems (also runs before every build)
//   npm run fotos:bereinigen   → fixes JPEG photos in place, losslessly
//
// Checks every image in src/ and public/ for:
//  1. GPS location in the EXIF data. Phones store where a photo was taken;
//     the original files are published with the site, so this would reveal
//     e.g. a customer's address.
//  2. An invalid EXIF orientation (valid: 1–8). Some phones write e.g. 256;
//     Astro then swaps width and height and crops the photo wrongly.
//
// The fix only edits the EXIF block (GPS data zeroed and emptied,
// orientation set to 1). The image itself is not re-compressed.
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SCAN_DIRS = ["src", "public"];
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".avif", ".heic"]);
const JPEG_EXT = new Set([".jpg", ".jpeg"]);

// GPS tags that hold an actual position (latitude / longitude)
const GPS_POSITION_TAGS = new Set([0x0002, 0x0004]);
// Byte size per EXIF value type
const TYPE_SIZE = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 6: 1, 7: 1, 8: 2, 9: 4, 10: 8, 11: 4, 12: 8 };

/** All image files below the scanned folders. */
function findImages(dir, found = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) findImages(path, found);
    else if (IMAGE_EXT.has(extname(name).toLowerCase())) found.push(path);
  }
  return found;
}

/** Offsets of the TIFF header of every EXIF block in a JPEG file. */
function jpegExifBlocks(buf) {
  const blocks = [];
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return blocks;
  let pos = 2;
  while (pos + 4 <= buf.length && buf[pos] === 0xff) {
    const marker = buf[pos + 1];
    if (marker === 0xda || marker === 0xd9) break; // image data starts / end
    const length = buf.readUInt16BE(pos + 2);
    if (marker === 0xe1 && buf.toString("latin1", pos + 4, pos + 10) === "Exif\0\0") {
      blocks.push(pos + 10);
    }
    pos += 2 + length;
  }
  return blocks;
}

/** Offset of the TIFF header in any file (fallback for PNG, WebP …). */
function genericExifBlocks(buf) {
  const blocks = [];
  for (const sig of ["Exif\0\0II*\0", "Exif\0\0MM\0*"]) {
    let at = buf.indexOf(sig, 0, "latin1");
    while (at !== -1) {
      blocks.push(at + 6);
      at = buf.indexOf(sig, at + 1, "latin1");
    }
  }
  return blocks;
}

/** Reads the parts of an EXIF (TIFF) block that matter here. */
function readExif(buf, base) {
  const le = buf.toString("latin1", base, base + 2) === "II";
  const u16 = (o) => (le ? buf.readUInt16LE(base + o) : buf.readUInt16BE(base + o));
  const u32 = (o) => (le ? buf.readUInt32LE(base + o) : buf.readUInt32BE(base + o));
  const result = { gps: null, orientation: null, u16, u32, le };

  const ifd0 = u32(4);
  const count = u16(ifd0);
  for (let i = 0; i < count; i++) {
    const entry = ifd0 + 2 + i * 12;
    const tag = u16(entry);
    if (tag === 0x0112) result.orientation = { value: u16(entry + 8), offset: entry + 8 };
    if (tag === 0x8825) result.gps = { ifd: u32(entry + 8), entries: [] };
  }

  if (result.gps) {
    const { ifd } = result.gps;
    const gpsCount = u16(ifd);
    for (let i = 0; i < gpsCount; i++) {
      const entry = ifd + 2 + i * 12;
      const type = u16(entry + 2);
      const bytes = (TYPE_SIZE[type] ?? 1) * u32(entry + 4);
      result.gps.entries.push({
        tag: u16(entry),
        entry,
        bytes,
        // values longer than 4 bytes live elsewhere; the entry holds an offset
        dataOffset: bytes > 4 ? u32(entry + 8) : null,
      });
    }
  }
  return result;
}

/** Problems of one file: [{ file, problem, fixable }] */
function inspect(file) {
  const buf = readFileSync(file);
  const isJpeg = JPEG_EXT.has(extname(file).toLowerCase());
  const problems = [];
  const blocks = isJpeg ? jpegExifBlocks(buf) : genericExifBlocks(buf);

  for (const base of blocks) {
    let exif;
    try {
      exif = readExif(buf, base);
    } catch {
      continue; // unreadable EXIF block: nothing we can judge
    }
    if (exif.gps?.entries.some((e) => GPS_POSITION_TAGS.has(e.tag))) {
      problems.push({ problem: "enthält einen GPS-Standort", fixable: isJpeg });
    }
    const o = exif.orientation?.value;
    if (o !== undefined && (o < 1 || o > 8)) {
      problems.push({ problem: `hat eine ungültige Ausrichtung (${o})`, fixable: isJpeg });
    }
  }

  // GPS can also sit in XMP (e.g. after editing in Lightroom)
  if (/<[^>]*GPSLatitude/.test(buf.toString("latin1"))) {
    problems.push({ problem: "enthält einen GPS-Standort (XMP)", fixable: false });
  }
  return problems;
}

/** Removes GPS data and fixes the orientation of a JPEG, in place. */
function fixJpeg(file) {
  const buf = readFileSync(file);
  for (const base of jpegExifBlocks(buf)) {
    const exif = readExif(buf, base);
    const write16 = (o, v) => (exif.le ? buf.writeUInt16LE(v, base + o) : buf.writeUInt16BE(v, base + o));
    const write32 = (o, v) => (exif.le ? buf.writeUInt32LE(v, base + o) : buf.writeUInt32BE(v, base + o));

    const o = exif.orientation;
    if (o && (o.value < 1 || o.value > 8)) write16(o.offset, 1);

    if (exif.gps) {
      // 1. zero every GPS value and entry, mark the GPS directory as empty
      for (const e of exif.gps.entries) {
        if (e.dataOffset !== null) buf.fill(0, base + e.dataOffset, base + e.dataOffset + e.bytes);
        buf.fill(0, base + e.entry, base + e.entry + 12);
      }
      write16(exif.gps.ifd, 0);
      write32(exif.gps.ifd + 2, 0);

      // 2. remove the pointer to the GPS directory from the main directory:
      //    shift the following entries (and the next-directory offset) up
      //    by one entry and lower the entry count
      const ifd0 = exif.u32(4);
      const count = exif.u16(ifd0);
      for (let i = 0; i < count; i++) {
        const entry = ifd0 + 2 + i * 12;
        if (exif.u16(entry) !== 0x8825) continue;
        const end = ifd0 + 2 + count * 12 + 4; // entries + next-IFD offset
        buf.copy(buf, base + entry, base + entry + 12, base + end);
        buf.fill(0, base + end - 12, base + end);
        write16(ifd0, count - 1);
        break;
      }
    }
  }
  writeFileSync(file, buf);
}

/** All problems in src/ and public/: [{ file, problem, fixable }] */
export function checkPhotos() {
  const files = SCAN_DIRS.flatMap((dir) => findImages(join(ROOT, dir)));
  return files.flatMap((file) =>
    inspect(file).map((p) => ({ file: relative(ROOT, file), ...p })),
  );
}

/** Human-readable report for the console / build error. */
export function formatProblems(problems) {
  const lines = problems.map((p) => `  • ${p.file} ${p.problem}`);
  const fixable = problems.every((p) => p.fixable);
  return [
    "Foto-Check: Diese Fotos dürfen so nicht veröffentlicht werden:",
    ...lines,
    "",
    fixable
      ? "Beheben mit:  npm run fotos:bereinigen"
      : "JPEG-Fotos behebt  npm run fotos:bereinigen. Andere Formate: Standort z. B. mit  exiftool -gps:all= -xmp:all= DATEI  entfernen oder als JPEG neu exportieren.",
  ].join("\n");
}

// --- Command line ----------------------------------------------------------------
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const fix = process.argv.includes("--fix");
  let problems = checkPhotos();

  if (fix && problems.length) {
    const files = [...new Set(problems.filter((p) => p.fixable).map((p) => p.file))];
    for (const file of files) {
      fixJpeg(join(ROOT, file));
      console.log(`Bereinigt: ${file}`);
    }
    problems = checkPhotos();
  }

  if (problems.length) {
    console.error(formatProblems(problems));
    process.exit(1);
  }
  console.log("Foto-Check: alle Fotos in Ordnung (kein GPS-Standort, gültige Ausrichtung).");
}
