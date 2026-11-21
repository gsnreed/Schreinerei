// ============================================================================
// SITE CONFIG — the ONE file to edit for each new site.
// ============================================================================
// All of the site's content (copy, contact details, opening hours, services,
// reviews...) lives here. Components contain NO hard-coded text: they read
// this config. To spin up a new site: fill in this file, replace the images
// in public/images/, and adjust the colors in src/styles/tokens.css.
//
// This data also powers the SEO: the JSON-LD LocalBusiness markup
// (JsonLdLocalBusiness.astro) is generated automatically from SITE.business.
//
// Every visible UI string lives in SITE.ui — translate that section and the
// content below to ship the site in any language (a full French example is
// provided in examples/french-bakery/).

import workshopImage from "../images/workshop.jpg";
import heroImage from "../images/hero.jpeg";

export const SITE = {
  // --- Identity & URLs -------------------------------------------------------
  url: "https://schreinerei-siegfried.de", // NO trailing slash
  lang: "de",
  // BCP 47 locale used for Open Graph (e.g. "en_US", "fr_FR", "de_DE")
  ogLocale: "de_DE",
  brand: "Schreinerei",
  name: "Alexander Siegfried",
  // Short brand for page titles in search results (Google shows ~60 characters)
  shortName: "Schreinerei Siegfried",
  tagline: "Traditionelles Handwerk. Modern gedacht.",
  workshop: "Werkstatt",
  projects: "Projekte",
  // Home page title in Google (keep under ~60 characters: place + what you do)
  homeTitle: "Schreinerei Siegfried in Pocking | Möbel & Küchen nach Maß",
  // Home page meta description (~120–158 characters)
  description:
  "Schreinerei-Meisterbetrieb in Pocking seit 2008: Möbel nach Maß, Küchen, Innenausbau, Türen und Treppen. Aufmaß, Fertigung und Montage aus einer Hand.",

  // --- Business (powers the JSON-LD LocalBusiness markup) --------------------
  business: {
    "@context": "https://schema.org",
    // The most specific schema.org type you can find. Useful examples:
    // "Bakery", "Restaurant", "LodgingBusiness", "HairSalon", "Plumber",
    // "SportingGoodsStore", "TouristInformationCenter"... (see schema.org)
    // "HomeAndConstructionBusiness" fits a joinery better than the generic
    // "LocalBusiness" (schema.org has no dedicated carpenter type).
    schemaType: "HomeAndConstructionBusiness",
    // Founding year (structured data for Google)
    foundingYear: "2008",
    name: "Schreinerei Alexander Siegfried",
    description:
    "Schreinerei in Pocking für Möbel nach Maß, individuellen Innenausbau, Küchen, Türen und Treppen sowie Reparatur und Restaurierung.",
    phone: "+49 8531 9130931",
    email: "info@schreinerei-siegfried.de",
    address: {
      street: "Oberer Mühlweg 2",
      postalCode: "94060",
      city: "Pocking",
      country: "DE",
    },
    // GPS coordinates (Google Maps → right-click the location → copy)
    geo: { latitude: 48.4248, longitude: 13.3476 },
    // Price range shown by Google: "€", "€€", "€€€" (or "$", "$$"...)
    priceRange: "€€€",
    areaServed: [
      {
        "@type": "City",
        name: "Pocking",
      },
      {
        "@type": "AdministrativeArea",
        name: "Landkreis Passau",
      },
      {
        "@type": "AdministrativeArea",
        name: "Niederbayern",
      },
      {
        "@type": "AdministrativeArea",
        name: "Oberösterreich",
      }
    ],
    // Link to the business's Google Business Profile
    googleBusinessUrl: "https://maps.app.goo.gl/2CHXoKfnLutAn4EB6",
    socialProfiles: [
      //"https://www.instagram.com/example",  //TODO
      //"https://www.facebook.com/example",
    ],
  },

  // --- Opening hours (shown on the site AND injected into the JSON-LD) -------
  // days: 0 = Monday ... 6 = Sunday. closed: true = closing day.
  openingHours: [
    { label: "Montag", days: [0], opens: "07:00", closes: "18:00" },
    { label: "Dienstag", days: [1], opens: "07:00", closes: "18:00" },
    { label: "Mittwoch", days: [2], opens: "07:00", closes: "18:00" },
    { label: "Donnerstag", days: [3], opens: "07:00", closes: "18:00" },
    { label: "Freitag", days: [4], opens: "07:00", closes: "12:30" },
    { label: "Samstag", days: [5], closed: true },
    { label: "Sonntag", days: [6], closed: true },
  ] as OpeningHours[],

  // --- Navigation (home page anchors + pages) --------------------------------
  navigation: [
    { label: "Leistungen", href: "/#services" },
    { label: "Über uns", href: "/#about" },
    { label: "Projekte", href: "/projekte/" },
    // { label: "Rezensionen", href: "/#reviews" },
    { label: "Anfahrt", href: "/#info" },
    { label: "Kontakt", href: "/#contact" },
  ],

  // --- Hero section -----------------------------------------------------------
  hero: {
    // "immersive" = the photo fills the whole first screen behind a dark
    //               veil (use a wide atmospheric photo, ≥1600px).
    // "split"     = text left, framed photo right, on the dark background
    //               (best with a product close-up).
    layout: "immersive" as "immersive" | "split",
    title: "Individuelles Handwerk aus Pocking",
    // Optional: a substring of the title rendered in italic accent color.
    // Leave "" to disable.
    titleHighlight: "Pocking",
    subtitle:
      "Möbel nach Maß, Küchen, Innenausbau, Türen und Treppen. Wir messen bei Ihnen auf, fertigen in unserer Werkstatt in Pocking und bauen selbst ein.",
    image: heroImage,
    imageAlt: "Hobel trägt Holzspäne von einer Holzplatte ab",
    primaryCta: { label: "Unsere Leistungen", href: "/#services" },
    secondaryCta: { label: "Projekt anfragen", href: "/#contact" },
    // Trust badges shown under the buttons (2 to 4 short items).
    // Great spots for the Google rating, founding year, a signature promise.
    highlights: ["Familienbetrieb seit 2008", "Meisterbetrieb"],
  },

  // --- Services section heading (cards come from src/content/services/) -------
  services: {
    eyebrow: "Schreinerarbeiten nach Maß",
    title: "Was wir für Sie fertigen",
    intro:
      "Planung, Aufmaß, Fertigung und Montage kommen bei uns aus einer Hand. Wir arbeiten in Pocking, im Landkreis Passau, in Niederbayern und in Oberösterreich.",

    // The service tiles and their detail pages live in src/content/services/
    // (one MDX file per service, see src/content.config.ts).
  },

  // --- About -------------------------------------------------------------------
  about: {
    eyebrow: "Seit 2008 in Pocking",
    title: "Was uns ausmacht",
    paragraphs: [
      "Die Schreinerei Siegfried ist ein Familien- und Meisterbetrieb in Pocking. Seit 2008 fertigen wir in unserer Werkstatt in Pocking Möbel, Küchen, Türen und Treppen für Kunden im Landkreis Passau, in Niederbayern und in Oberösterreich.",
      "Aufmaß, Planung, Fertigung und Montage machen wir selbst. Sie haben dadurch von der Anfrage bis zum Einbau dieselben Ansprechpartner, und auch wenn später etwas nachgestellt werden muss, wissen Sie, an wen Sie sich wenden."
    ],
    image: workshopImage,
    imageAlt: "Holzregal in einer Werkstatt mit Werkzeugen",
    // Button under the text → page written in src/content/seiten/werkstatt.mdx
    moreLink: { label: "Werkstatt & Team", href: "/werkstatt/" },
  },

  // --- Projects / gallery section (cards come from src/content/projects/) --------
  gallery: {
    eyebrow: "Aus unserer Werkstatt",
    title: "Ausgewählte Projekte",
    // Heading of the /projekte/ page, which shows ALL images below
    allTitle: "Unsere Projekte",
    // Intro under the heading on /projekte/
    allIntro:
      "Eine Auswahl an Arbeiten aus unserer Werkstatt in Pocking. Wählen Sie eine Leistung, um nur die passenden Projekte zu sehen.",
    // Maximum number of projects with `star: true` (shown on the home page,
    // alphabetically). 3 fills one row on desktop; the build stops if more
    // projects have a star. The "all projects" button only appears when
    // there are more projects than the home page shows.
    featuredCount: 3,
    // The project cards and their detail pages live in src/content/projects/
    // (one MDX file per project, see src/content.config.ts).
  },

  // --- Customer reviews (copied from the business's Google profile) --------------
  reviews: {
    eyebrow: "Reviews",
    title: "In their words",
    // Link to the "reviews" tab of the Google profile, to read or leave more
    allReviewsUrl: "https://maps.app.goo.gl/2CHXoKfnLutAn4EB6",
    items: [
      {
        author: "Marie L.",
        rating: 5,
        text: "The best bread in the valley, hands down. The stone-milled boule keeps for a week and the mont-blanc is to die for.",
      },
      {
        author: "Thomas B.",
        rating: 5,
        text: "Open early — perfect before heading out on a route. The baguette sandwiches are generous and the coffee is good.",
      },
      {
        author: "Elena K.",
        rating: 4,
        text: "Wonderful bakery, authentic sourdough bread. A bit of a queue on Saturday mornings but absolutely worth it.",
      },
    ],
  },

  // --- FAQ (SEO bonus: questions people actually type into Google) ---------------
  faq: {
    eyebrow: "Gut zu wissen",
    title: "Ihre Fragen. Unsere Antworten.",
    items: [
      {
        question: "Wie kann ich eine Anfrage stellen?",
        answer:
          "Per Telefon während unserer Öffnungszeiten, per E-Mail oder über das Kontaktformular. Damit wir Ihr Vorhaben schnell einschätzen können, helfen uns: eine kurze Beschreibung, ungefähre Maße, ein paar Fotos vom Raum (per E-Mail), Ihr Wunschtermin und, falls vorhanden, eine Skizze oder ein Budgetrahmen.",
      },

      {
        question: "Wie läuft ein Projekt ab?",
        answer:
          "1. Sie schildern uns Ihr Vorhaben. 2. Wir besprechen Ausführung, Material und Budget und kommen zum Aufmaß zu Ihnen. 3. Sie erhalten ein Angebot. 4. Nach Ihrem Auftrag fertigen wir in unserer Werkstatt und vereinbaren mit Ihnen einen Montagetermin. 5. Wir bauen bei Ihnen ein.",
      },

      {
        question: "Kann ich vorab ein Angebot erhalten?",
        answer:
          "Ja. Für eine erste Preiseinschätzung reichen oft Fotos und ungefähre Maße. Ein verbindliches Angebot erstellen wir, sobald die genauen Maße und Ihre Wünsche zu Material und Ausführung feststehen.",
      },

      {
        question: "Wie lange dauert die Umsetzung eines Projekts?",
        answer:
          "Das hängt vom Umfang des Projekts und von unserer aktuellen Auslastung ab. Den Montagetermin nennen wir Ihnen nach der Auftragserteilung. Wenn Sie einen festen Termin haben, zum Beispiel einen Einzug oder das Ende eines Umbaus, sagen Sie es uns bitte schon bei der Anfrage.",
      },

      {
        question: "Kommen Sie zum Ausmessen zu mir?",
        answer:
          "Ja. Bei Einbaumöbeln, Küchen, Treppen und Innenausbau messen wir selbst vor Ort auf. Wände und Böden sind selten ganz gerade, und nur mit einem eigenen Aufmaß passt das fertige Stück beim Einbau genau.",
      },

      {
        question: "In welchem Gebiet ist die Schreinerei tätig?",
        answer:
          "Unsere Werkstatt ist in Pocking. Wir arbeiten im gesamten Landkreis Passau, in Niederbayern und in Oberösterreich. Projekte weiter entfernt sind nach Absprache möglich.",
      },

      {
        question: "Kann ich eigene Vorstellungen oder Materialien einbringen?",
        answer:
          "Ja. Holzart, Oberfläche (zum Beispiel geölt oder lackiert), Griffe und Beschläge bestimmen Sie mit. Wenn Sie eigenes Material verwenden möchten, etwa Holz aus dem eigenen Wald oder Teile eines alten Möbelstücks, sprechen Sie uns bitte vorab an. Dann prüfen wir, ob es sich verarbeiten lässt.",
      },

      {
        question: "Kann ich in der Werkstatt vorbeikommen?",
        answer:
          "Gerne, bitte vereinbaren Sie vorher einen Termin. Wir sind häufig bei Kunden auf Montage, und so ist sicher jemand für Sie da. Bei einem Termin in der Werkstatt können wir Ihnen Holzarten und Oberflächen direkt zeigen.",
      },
    ],
  },

  // --- Call-to-action banner ------------------------------------------------------
  ctaBanner: {
    title: "Planen Sie ein Projekt?",
    text: "Schicken Sie uns eine kurze Beschreibung mit ungefähren Maßen oder Fotos. Wir melden uns innerhalb eines Geschäftstages mit einer ersten Einschätzung.",
    button: { label: "Angebot anfordern", href: "/#contact" },
  },

  // --- Contact form ------------------------------------------------------------------
  contact: {
    eyebrow: "Ihr Projekt beginnt hier",
    title: "Erzählen Sie uns von Ihrer Idee",
    intro:
      "Beschreiben Sie kurz, was Sie vorhaben, und geben Sie wenn möglich ungefähre Maße und Ihren Wunschtermin an. Fotos können Sie uns per E-Mail schicken. Wir melden uns innerhalb eines Geschäftstages bei Ihnen.",
    // Form endpoint. Options:
    //  1. Formspree/Basin: paste the URL the service gives you.
    //  2. Your own backend (any endpoint accepting a classic form POST).
    //  3. Leave empty "": the form falls back to a mailto button automatically.
    endpoint: "/server/contact.php",
    // Name of the hidden anti-spam (honeypot) field. Your backend must reject
    // any submission where this field is filled in. Keep the default unless
    // your form backend expects a specific field name.
    honeypotField: "website",
  },

  // --- Legal pages ---------------------------------------------------------------------
  // Shown on /impressum/ — mandatory for professional sites in many
  // EU countries (e.g. France's LCEN, Germany's Impressumspflicht).
  legal: {
    companyType: "SARL with a capital of €10,000",  // TODO
    registrationNumber: "000 000 000 00000",  // TODO
    publisher: "Alexander Siegfried",
    host: {
      name: "Hetzner Online GmbH",
      address: "440 N Barranca Ave #4133, Covina, CA 91723, USA", // TODO
      url: "https://www.hetzner.com",
    },
  },

  // --- UI strings ------------------------------------------------------------------------
  // Every fixed label used by the components. Translate this section (plus the
  // content above) to ship the site in another language — no component edits.
  ui: {
    skipToContent: "Weiter zum Inhalt",
    menuOpenLabel: "Menü öffnen",
    closedLabel: "Geschlossen",
    hoursTitle: "Öffnungszeiten",
    findUsTitle: "Besuchen Sie uns",
    infoEyebrow: "Wo Ihre Idee entsteht",
    infoTitle: "Anfahrt",
    directionsLabel: "Google Maps",
    googleProfileLabel: "Google Profil",
    readAllReviews: "Reviews auf Google →",
    ratingLabel: "Bewertung:", // followed by "4 out of 5"
    ratingOutOf: "von 5",
    reviewsScoreLabel: "laut Google reviews", // under the big average score
    formNameLabel: "Ihr Name",
    formEmailLabel: "Ihre E-Mail-Adresse",
    formTelephoneLabel: "Ihre Telefonnummer",
    formProjectTypeLabel: "Worum geht es?",
    formProjectTypePlaceholder: "Bitte wählen (optional)",
    formProjectTypeOther: "Etwas anderes / weiß ich noch nicht",
    formMessageLabel: "Ihre Nachricht",
    formSubmitLabel: "Nachricht senden",
    formHoneypotLabel: "Lassen Sie dieses Feld leer",
    legalNoticeLabel: "Impressum",
    privacyPolicyLabel: "Datenschutzerklärung",
    allRightsReserved: "Alle Rechte vorbehalten",
    notFoundTitle: "Seite nicht gefunden",
    notFoundText: "Die Seite, die Sie suchen, existiert nicht oder wurde verschoben.",
    notFoundCta: "Zurück zur Startseite",
    serviceMoreLabel: "Mehr erfahren",
    backToServices: "Alle Leistungen",
    // "{count}" is replaced with the number of projects
    allProjectsLabel: "Alle {count} Projekte ansehen",
    backToAllProjects: "Alle Projekte",
    backToHome: "Startseite",
    projectsFilterLabel: "Projekte nach Leistung filtern",
    projectsFilterAll: "Alle",
    // Heading of a filtered list; "{service}" is replaced with the service name
    projectsForServiceTitle: "Projekte: {service}",
    projectsServiceLink: "Mehr zur Leistung",
    projectFactsTitle: "Auf einen Blick",
    projectServiceLabel: "Leistung",
    projectLocationLabel: "Ort",
    projectMaterialLabel: "Material",
    projectMorePhotos: "Fotos zum Projekt",
    projectPrevLabel: "Vorheriges Projekt",
    projectNextLabel: "Nächstes Projekt",
    similarProjectTitle: "Etwas Ähnliches geplant?",
    similarProjectText:
      "Erzählen Sie uns von Ihrem Vorhaben. Wir melden uns innerhalb eines Geschäftstages mit einer ersten Einschätzung.",
    similarProjectCta: "Ähnliches Projekt anfragen",
    // Pre-filled into the contact form; "{project}" = project title
    similarProjectMessage:
      "Guten Tag, ich interessiere mich für ein ähnliches Projekt wie „{project}“. ",
    serviceProjectsTitle: "Projekte zu dieser Leistung",
  },
} as const;

// --- Utility types ---------------------------------------------------------------------
export interface OpeningHours {
  label: string;
  days: number[];
  opens?: string;
  closes?: string;
  closed?: boolean;
}

export type SiteConfig = typeof SITE;
