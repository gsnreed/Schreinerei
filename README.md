# Schreinerei Alexander Siegfried — Website

Website of the joinery Schreinerei Alexander Siegfried in Pocking:
**https://schreinerei-siegfried.de**

Built with [Astro](https://astro.build) as a static site: plain HTML pages,
no database, no tracking. Almost all content lives in text files you can
edit directly. This guide covers the everyday tasks.

---

## Contents

1. [Getting started](#1-getting-started)
2. [Where everything lives](#2-where-everything-lives)
3. [Add a project](#3-add-a-project)
4. [Photos: preparing, cropping, several per project](#4-photos)
5. [Edit a service](#5-edit-a-service)
6. [Edit the "Werkstatt & Team" page or add a page](#6-pages-werkstatt--team-and-more)
7. [Change texts, contact details, FAQ](#7-texts-contact-details-faq)
8. [Google / SEO](#8-google--seo)
9. [Contact form](#9-contact-form)
10. [Publishing](#10-publishing)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Getting started

Requires [Node.js](https://nodejs.org) 22.12 or newer.

```bash
npm install          # once, after downloading the project
npm run dev          # preview while editing: http://localhost:4321
npm run build        # build the finished site into the folder dist/
npm run preview      # look at the finished build locally
```

`npm run dev` updates the page in the browser as soon as you save a file.

---

## 2. Where everything lives

| What | Where |
|---|---|
| Texts, contact details, opening hours, FAQ, navigation | `src/config/site.ts` |
| Projects: texts **and** photos | `src/content/projects/` |
| Services (one file per service) | `src/content/services/` |
| Free pages, e.g. "Werkstatt & Team" | `src/content/seiten/` |
| Other photos (hero, workshop …) | `src/images/` |
| Impressum / Datenschutz | `src/pages/impressum.astro`, `src/pages/datenschutz.astro` |
| Colours and fonts | `src/styles/tokens.css` |
| Contact form (server side) | `public/server/contact.php` |
| Server settings (https, redirects, caching) | `public/.htaccess` |

Files ending in `.mdx` are text files: a block of settings between two
`---` lines at the top (the *frontmatter*), followed by normal text.
`##` starts a heading, `-` a list item, `1.` a numbered list.

---

## 3. Add a project

Texts and photos of all projects are in the same folder,
`src/content/projects/`.

1. Put the photo in `src/content/projects/`, e.g. `eckbank-eiche.jpg`.
   Use lowercase letters, no spaces or umlauts (`ae`, `oe`, `ue`, `ss`).
   Tip: start the photo names with the project name, so a project's text
   and photos stay next to each other in the folder.
2. Copy an existing project file in the same folder and rename it,
   e.g. `eckbank-eiche.mdx`. **The file name becomes the address:**
   `https://schreinerei-siegfried.de/projekte/eckbank-eiche/`
3. Adjust the settings:

```yaml
---
title: "Eckbank aus Eiche"
description: "Eckbank mit Stauraum für eine Wohnküche, Eiche massiv, geölt."
service: "moebel-nach-mass"          # file name of the service, see below
image: "./eckbank-eiche.jpg"
imageAlt: "Eckbank aus Eiche mit Sitzkissen in einer Wohnküche"
order: 6                             # position in the lists (lowest first)
---

A few sentences about the project: what the customer wanted, what was
special, which wood and surface. This text appears on the project page
and is what Google reads.
```

| Setting | Required | Meaning |
|---|---|---|
| `title` | yes | Name of the project |
| `description` | yes | One or two sentences: card text, intro on the project page, Google description |
| `service` | yes | Which service it belongs to: `moebel-nach-mass`, `innenausbau`, `kuechen-nach-mass`, `tueren-und-treppen` or `reparatur-und-restaurierung` |
| `image` | yes | Main photo |
| `imageAlt` | yes | What can be seen in the photo (for screen readers and Google) |
| `order` | no | Position; the first 3 appear on the home page |
| `imagePosition` | no | Which part of the photo stays visible in the square, see [4](#4-photos) |
| `gallery` | no | More photos, see [4](#4-photos) |
| `location`, `material` | no | Shown in the info box, e.g. `location: "Bad Füssing"`, `material: "Eiche, geölt"` |
| `seoTitle`, `seoDescription` | no | Only if Google should show a different title/description than the generated one |

The project then appears automatically on the home page (if `order` is
among the first 3), in the project overview, in the filter of its service
and on the service page.

---

## 4. Photos

### Before adding a photo: remove the location

Phones store **where** a photo was taken (GPS). The original files are
published with the site, so a photo taken at a customer's home would reveal
their address. The build therefore **stops** if a photo still contains a
location, with a message like:

```
Foto-Check: Diese Fotos dürfen so nicht veröffentlicht werden:
  • src/content/projects/eckbank-eiche.jpg enthält einen GPS-Standort
```

Fix it with:

```bash
npm run fotos:bereinigen   # removes GPS + fixes the orientation (JPEG, lossless)
npm run fotos:pruefen      # checks all photos without changing anything
```

The photo itself stays exactly the same (no re-compression).
Turning off "location" in the phone's camera settings avoids the problem
in the first place.

### Square crop

Project photos are shown **square**. Most photos are wider than tall, so
the sides are cut off. By default the middle stays visible. To keep
another part:

```yaml
imagePosition: "left"        # also "right", "top", "bottom", "left top" …
imagePosition: "30% 50%"     # 30 % from the left, 50 % from the top
```

### Several photos per project

Add a `gallery` list. The photos appear as thumbnails under the main photo;
a click swaps them into the big spot (with an animation).

```yaml
gallery:
  - image: "./eckbank-eiche-detail.jpg"
    alt: "Stauraum unter der Sitzfläche der Eckbank"
  - image: "./eckbank-eiche-werkstatt.jpg"
    alt: "Die Eckbank während der Fertigung in der Werkstatt"
    position: "right"          # optional, like imagePosition
```

Good photos: the finished piece in daylight, details (joints, handles,
surface), the piece in the workshop, before/after.

---

## 5. Edit a service

Services live in `src/content/services/`, one file each. The settings at
the top feed the card on the home page, the text below is the service page.

```yaml
---
title: "Küchen nach Maß"
description: "Short text for the card on the home page and for Google."
icon: "kitchen"     # icon name, see src/components/Icon.astro
order: 3            # position on the home page
---
```

A new file adds a new service everywhere: home page, contact form
("Worum geht es?"), project filter. Projects link to a service via its file
name (`service: "kuechen-nach-mass"`).

---

## 6. Pages: "Werkstatt & Team" and more

The page **https://schreinerei-siegfried.de/werkstatt/** is written in
`src/content/seiten/werkstatt.mdx`. The button "Werkstatt & Team" in the
section "Was uns ausmacht" leads there.

- `image` — large photo next to the intro
- `gallery` — photo grid below the text (`image`, `alt`, optional `caption`)
- Photo anywhere in the text: `![Description](../../images/werkstatt/foto.jpg)`
- Grey `{/* … */}` blocks are notes; they don't appear on the website.

**Another page:** create a new file in `src/content/seiten/`, e.g.
`geschichte.mdx` → `https://schreinerei-siegfried.de/geschichte/`.
Don't use the names `projekte`, `leistungen`, `impressum` or `datenschutz`.

---

## 7. Texts, contact details, FAQ

Everything that isn't a project, service or page is in
**`src/config/site.ts`**, sorted by section with comments:

- `homeTitle`, `description` — title and description of the home page in Google
- `business` — name, address, phone, email, area served
- `openingHours` — opening hours
- `hero` — big headline at the top of the home page
- `about` — "Was uns ausmacht"
- `faq` — questions and answers
- `ctaBanner`, `contact` — "Planen Sie ein Projekt?" and the contact section
- `ui` — small fixed labels (buttons, form fields …)

---

## 8. Google / SEO

Handled automatically for every page, generated from the texts above:
page title and description, link previews (WhatsApp, Facebook), structured
data for Google (business, services, projects, breadcrumbs), sitemap.

What helps most, and only you can do:

- **Text for every project** (a few sentences: what, where, which wood).
- **More projects and photos.**
- **Google reviews** on the business profile.
- **Google Search Console**: register the site once and submit
  `https://schreinerei-siegfried.de/sitemap-index.xml`.

To check: [Rich Results Test](https://search.google.com/test/rich-results)
(structured data) and [PageSpeed Insights](https://pagespeed.web.dev)
(speed).

---

## 9. Contact form

The form posts to `public/server/contact.php`, which sends an email via
the server's PHP `mail()`. Settings at the top of that file:

```php
const RECIPIENT = 'info@schreinerei-siegfried.de';   // receives the enquiries
const SENDER = 'kontakt@schreinerei-siegfried.de';   // sender, must exist on the server
```

The email subject contains the topic chosen in "Worum geht es?", e.g.
"Kontaktanfrage (Küchen nach Maß) von Max Muster". Visitors coming from a
project or service page find the form pre-filled.

---

## 10. Publishing

1. `npm run build` (stops if a photo still has a GPS location, see [4](#4-photos)).
2. Upload **the contents** of the folder `dist/` to the web space,
   including the hidden file `.htaccess` and the folder `server/`.
3. Check: open `http://schreinerei-siegfried.de` — it should switch to
   `https://` by itself — and send one test enquiry through the form.

`.htaccess` makes sure the site is only reachable as
`https://schreinerei-siegfried.de/…` (no `http://`, no `www.`), forwards
old addresses (`/projects/` → `/projekte/` …), compresses pages and lets
browsers cache images.

---

## 11. Troubleshooting

| Problem | Solution |
|---|---|
| Build stops with "Foto-Check" | `npm run fotos:bereinigen`, then build again |
| Build error mentioning a project file | Check the settings between the `---` lines: quotes closed? indentation of `gallery` entries correct? `service` spelled like a file in `src/content/services/`? |
| Photo not found | The photo must be in `src/content/projects/` and referenced as `./name.jpg`; check the exact spelling (upper/lower case counts) |
| Important part of a photo cut off | `imagePosition`, see [4](#4-photos) |
| "500 Internal Server Error" after uploading | The server doesn't accept a setting in `.htaccess`: delete `.htaccess` on the server, then adjust it |
| Contact form says it could not send | Check `RECIPIENT`/`SENDER` in `contact.php`; the sender address must exist on the server |

---

Based on the [Chalet](https://github.com/M4xKey/astro-chalet) Astro theme by
Antoine Grange ([MIT license](LICENSE)).
