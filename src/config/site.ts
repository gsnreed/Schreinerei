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

export const SITE = {
  // --- Identity & URLs -------------------------------------------------------
  url: "https://schreinerei-siegfried.de", // NO trailing slash
  lang: "de",
  // BCP 47 locale used for Open Graph (e.g. "en_US", "fr_FR", "de_DE")
  ogLocale: "de_DE",
  brand: "Schreinerei",
  name: "Alexander Siegfried",
  tagline: "Handwerk, das bleibt",
  workshop: "Werkstatt",
  projects: "Projekte",
  description:
  "Schreinerei-Meisterbetrieb für maßgefertigte Möbel, Küchen und individuellen Innenausbau. Hochwertiges Schreinerhandwerk, persönliche Beratung und individuelle Lösungen für Pocking, Passau und Umgebung.",

  // --- Business (powers the JSON-LD LocalBusiness markup) --------------------
  business: {
    "@context": "https://schema.org",
    // The most specific schema.org type you can find. Useful examples:
    // "Bakery", "Restaurant", "LodgingBusiness", "HairSalon", "Plumber",
    // "SportingGoodsStore", "TouristInformationCenter"... (see schema.org)
    schemaType: "LocalBusiness",
    name: "Schreinerei Alexander Siegfried",
    description:
    "Schreinerei in Pocking für Möbel nach Maß, individuellen Innenausbau, Küchen, Türen und Treppen sowie Reparatur und Restaurierung.",
    phone: "+49 162 4106237",
    email: "schreinerei-siegfried@yahoo.com",
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
    googleBusinessUrl: "https://maps.google.com/?cid=EXAMPLE",  //TODO
    socialProfiles: [
      "https://www.instagram.com/example",  //TODO
      "https://www.facebook.com/example",
    ],
  },

  // --- Opening hours (shown on the site AND injected into the JSON-LD) -------
  // days: 0 = Monday ... 6 = Sunday. closed: true = closing day.
  openingHours: [
    { label: "Montag", days: [0], opens: "06:30", closes: "19:00" },
    { label: "Dienstag", days: [1], opens: "06:30", closes: "19:00" },
    { label: "Mittwoch", days: [2], opens: "06:30", closes: "19:00" },
    { label: "Donnerstag", days: [3], opens: "06:30", closes: "19:00" },
    { label: "Freitag", days: [4], opens: "06:30", closes: "19:00" },
    { label: "Samstag", days: [5], opens: "06:30", closes: "19:30" },
    { label: "Sonntag", days: [6], closed: true },
  ] as OpeningHours[],

  // --- Navigation (home page anchors + pages) --------------------------------
  navigation: [
    { label: "Leistungen", href: "/#services" },
    { label: "Über uns", href: "/#about" },
    { label: "Portfolio", href: "/#gallery" },
    // { label: "Rezensionen", href: "/#reviews" },
    { label: "Öffnungszeiten", href: "/#info" },
    { label: "Kontakt", href: "/#contact" },
  ],

  // --- Hero section -----------------------------------------------------------
  hero: {
    // "immersive" = the photo fills the whole first screen behind a dark
    //               veil (use a wide atmospheric photo, ≥1600px).
    // "split"     = text left, framed photo right, on the dark background
    //               (best with a product close-up).
    layout: "immersive" as "immersive" | "split",
    title: "Schreinermeisterei aus Pocking",
    // Optional: a substring of the title rendered in italic accent color.
    // Leave "" to disable.
    titleHighlight: "Pocking",
    subtitle:
      "Indiviudelle Möbel und Schreinerarbeiten aus Meisterhand. Gefertigt mit Liebe zum Detail - von der Planung bis zur Montage.",
    image: "/images/hero.webp",
    imageAlt: "Hobel trägt Holzspäne von einer Holzplatte ab",
    primaryCta: { label: "Unsere Leistungen", href: "/#services" },
    secondaryCta: { label: "Projekt anfragen", href: "/#contact" },
    // Trust badges shown under the buttons (2 to 4 short items).
    // Great spots for the Google rating, founding year, a signature promise.
    highlights: ["Familienbetrieb seit 2010", "Meisterbetrieb"],
  },

  // --- Services / products (3 to 6 cards) -------------------------------------
  services: {
    eyebrow: "Schreinerei in Pocking",
    title: "Schreinerarbeiten nach Maß",
    intro:
      "Individuelle Möbel, Innenausbau und hochwertige Holzarbeiten für Pocking, den Landkreis Passau und die Region Niederbayern. Von der ersten Planung bis zur fertigen Montage setzen wir Ihre Vorstellungen mit handwerklicher Präzision um.",

    items: [
      {
        title: "Möbel nach Maß",
        description:
          "Individuelle Möbel nach Maß für Wohn- und Geschäftsräume. Wir fertigen Einbauschränke, Regale, Sideboards und weitere Einzelanfertigungen passend zu Ihren Räumen.",
        icon: "wardrobe",
      },

      {
        title: "Innenausbau",
        description:
          "Individueller Innenausbau für Wohnungen, Häuser, Büros und Praxen. Maßgefertigte Lösungen, die Funktionalität, Design und hochwertiges Schreinerhandwerk verbinden.",
        icon: "home",
      },

      {
        title: "Küchen nach Maß",
        description:
          "Individuell geplante und gefertigte Küchen nach Maß. Von der Planung über die Fertigung bis zur fachgerechten Montage entstehen Küchen, die optimal zu Ihren Räumen und Bedürfnissen passen.",
        icon: "kitchen",
      },

      {
        title: "Türen & Treppen",
        description:
          "Individuell gefertigte Türen und Treppen aus hochwertigen Materialien. Wir planen und fertigen langlebige Holzlösungen passend zu Architektur, Raum und Einrichtung.",
        icon: "stairs",
      },

      {
        title: "Reparatur & Restaurierung",
        description:
          "Fachgerechte Reparatur und Restaurierung von Möbeln und Holzelementen. Wir erhalten und erneuern beschädigte oder in die Jahre gekommene Stücke mit Erfahrung und Liebe zum Detail.",
        icon: "tools",
      },
    ],
  },

  // --- About -------------------------------------------------------------------
  about: {
    eyebrow: "Seit 2010 in Pocking",
    title: "Über uns",
    paragraphs: [
      "Seit 2010 steht unsere Schreinerei in Pocking für individuelles Handwerk, hochwertige Materialien und Lösungen, die genau zum Menschen und zum Raum passen. Als Schreinermeister verbinden wir traditionelles Handwerk mit einem modernen Blick für Gestaltung und Funktion.",
      "Ob Möbel nach Maß, individueller Innenausbau oder passgenaue Einzelanfertigungen - jedes Projekt entsteht mit viel Liebe zum Detail und wird von der ersten Idee bis zur fertigen Umsetzung persönlich begleitet."
    ],
    image: "/images/about.webp",
    imageAlt: "Alexander Siegfried, Schreinermeister, steht in seiner Werkstatt vor einem Holzregal mit Werkzeugen",
  },

  // --- Gallery (4 to 8 images) ---------------------------------------------------
  gallery: {
    eyebrow: "Portfolio",
    title: "Kundenprojekte",
    // The first image is featured (2×2 in the grid): 5 or 7 images fill the
    // grid perfectly on desktop.
    images: [
      { src: "/images/gallery-1.webp", alt: "Wooden shelves stacked with rustic sourdough loaves" },
      { src: "/images/gallery-2.webp", alt: "Golden croissants in the bakery display case" },
      { src: "/images/gallery-3.webp", alt: "Éclairs and cream puffs lined up on the pastry counter" },
      { src: "/images/gallery-4.webp", alt: "The bakery storefront and its green woodwork" },
      { src: "/images/gallery-5.webp", alt: "Baker presenting a crusty boule over the wooden counter" },
    ],
  },

  // --- Customer reviews (copied from the business's Google profile) --------------
  reviews: {
    eyebrow: "Reviews",
    title: "In their words",
    // Link to the "reviews" tab of the Google profile, to read or leave more
    allReviewsUrl: "https://maps.google.com/?cid=EXAMPLE",
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
    title: "Häufig gestellte Fragen",
    items: [
      {
        question: "Wie kann ich eine Anfrage stellen?",
        answer:
          "Kontaktieren Sie uns am besten telefonisch, per E-Mail oder über das Kontaktformular und beschreiben Sie kurz Ihr Vorhaben. Gerne können Sie uns auch erste Fotos oder Maße zukommen lassen.",
      },

      {
        question: "Wie läuft ein Projekt ab?",
        answer:
          "Nach Ihrer Anfrage besprechen wir zunächst Ihre Wünsche und die Anforderungen an das Projekt. Bei Bedarf vereinbaren wir einen Termin vor Ort, nehmen die notwendigen Maße auf und besprechen anschließend die weitere Planung.",
      },

      {
        question: "Kann ich vorab ein Angebot erhalten?",
        answer:
          "Ja. Nach einer ersten Einschätzung Ihres Vorhabens besprechen wir die nächsten Schritte und erstellen Ihnen ein individuelles Angebot.",
      },

      {
        question: "Wie lange dauert die Umsetzung eines Projekts?",
        answer:
          "Die Dauer hängt vom Umfang und der Art des Projekts ab. Nach der Planung und Auftragserteilung besprechen wir mit Ihnen den voraussichtlichen Fertigstellungstermin.",
      },

      {
        question: "Ist ein Termin vor Ort möglich?",
        answer:
          "Ja. Wenn es für die Planung erforderlich ist, vereinbaren wir einen Termin vor Ort, um die räumlichen Gegebenheiten zu besprechen und ein genaues Aufmaß zu erstellen.",
      },

      {
        question: "In welchem Gebiet ist die Schreinerei tätig?",
        answer:
          "Unsere Schreinerei befindet sich in Pocking. Wir arbeiten hauptsächlich in Pocking und im gesamten Landkreis Passau, sowie Niederbayern und Oberösterreich. Projekte in umliegenden Orten und Regionen sind nach Absprache ebenfalls möglich.",
      },

      {
        question: "Kann ich eigene Vorstellungen oder Materialien einbringen?",
        answer:
          "Natürlich. Ihre persönlichen Vorstellungen sind ein wichtiger Bestandteil der Planung. Besondere Wünsche zu Gestaltung, Materialien oder Ausführung können wir gemeinsam besprechen und nach Möglichkeit berücksichtigen.",
      },

      {
        question: "Wie kann ich einen persönlichen Beratungstermin vereinbaren?",
        answer:
          "Rufen Sie uns gerne an, schreiben Sie uns eine E-Mail oder nutzen Sie das Kontaktformular. Wir besprechen Ihr Anliegen und vereinbaren anschließend einen passenden Termin.",
      },
    ],
  },

  // --- Call-to-action banner ------------------------------------------------------
  ctaBanner: {
    title: "Planen Sie ein Projekt?",
    text: "Wir beraten Sie gerne und erstellen Ihnen ein individuelles Angebot für Ihre maßgefertigten Möbel oder Schreinerarbeiten.",
    button: { label: "Angebot anfordern", href: "/#contact" },
  },

  // --- Contact form ------------------------------------------------------------------
  contact: {
    eyebrow: "Kontakt",
    title: "Schreiben Sie uns",
    intro:
      "Eine Frage, ein Sonderauftrag? Schreiben Sie uns - wir antworten innerhalb eines Geschäftstages.",
    // Form endpoint. Options:
    //  1. Formspree/Basin: paste the URL the service gives you.
    //  2. Your own backend (any endpoint accepting a classic form POST).
    //  3. Leave empty "": the form falls back to a mailto button automatically.
    endpoint: "/contact.php",
    // Name of the hidden anti-spam (honeypot) field. Your backend must reject
    // any submission where this field is filled in. Keep the default unless
    // your form backend expects a specific field name.
    honeypotField: "website",
  },

  // --- Legal pages ---------------------------------------------------------------------
  // Shown on /legal-notice/ — mandatory for professional sites in many
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
    infoEyebrow: "Zum Betrieb",
    infoTitle: "Informationen",
    directionsLabel: "Google Maps",
    googleProfileLabel: "Google Profil",
    readAllReviews: "Reviews auf Google →",
    ratingLabel: "Bewertung:", // followed by "4 out of 5"
    ratingOutOf: "von 5",
    reviewsScoreLabel: "laut Google reviews", // under the big average score
    formNameLabel: "Ihr Name",
    formEmailLabel: "Ihre Email",
    formMessageLabel: "Ihre Nachricht",
    formSubmitLabel: "Nachricht senden",
    formHoneypotLabel: "Lassen Sie dieses Feld leer",
    legalNoticeLabel: "Rechtliche Hinweise",
    privacyPolicyLabel: "Datenschutzbestimmungen",
    allRightsReserved: "Alle Rechte vorbehalten",
    notFoundTitle: "Seite nicht gefunden",
    notFoundText: "Die Seite, die Sie suchen, existiert nicht oder wurde verschoben.",
    notFoundCta: "Zurück zur Startseite",
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
