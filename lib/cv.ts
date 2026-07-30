export type Locale = "de" | "en";
export type LocalizedText = Readonly<Record<Locale, string>>;
export type YearMonth = `${number}-${number}`;

export type CvEntry = {
  id: string;
  category: "experience" | "education";
  organization: string;
  role: LocalizedText;
  from: YearMonth;
  to: YearMonth | null;
  location?: LocalizedText;
  bullets?: Readonly<Record<Locale, readonly string[]>>;
  logo: {
    src: string;
    alt: string;
    scale?: number;
  };
};

type LanguageEntry = {
  id: string;
  name: LocalizedText;
  level: LocalizedText;
};

export function localize<T>(value: Readonly<Record<Locale, T>>, locale: Locale): T {
  return value[locale];
}

// Newest first. This is the canonical CV source for web and PDF.
export const experience: readonly CvEntry[] = [
  {
    id: "speira-it-governance",
    category: "experience",
    organization: "Speira GmbH",
    role: {
      de: "Werkstudent IT Governance",
      en: "Working Student IT Governance",
    },
    from: "2025-03",
    to: null,
    location: {
      de: "Teilzeit · Grevenbroich",
      en: "Part-time · Grevenbroich",
    },
    logo: {
      src: "/icons/Speira.png",
      alt: "Speira",
    },
    bullets: {
      de: [
        "Verwaltung und Einkauf externer IT-Dienstleistungen und Softwarelizenzen",
        "Eigenständige Abwicklung von IT-Beschaffungsprozessen und Bestellungen",
        "Mitarbeit mit dem IT-PMO-Team zur Realisierung von IT-Projekten",
      ],
      en: [
        "Management and procurement of external IT services and software licenses",
        "Independent handling of IT procurement processes and purchase orders",
        "Collaboration with the IT PMO team on the delivery of IT projects",
      ],
    },
  },
] as const;

// Newest first.
export const education: readonly CvEntry[] = [
  {
    id: "tum-information-systems",
    category: "education",
    organization: "Technische Universität München",
    role: {
      de: "M.Sc. Information Systems",
      en: "M.Sc. Information Systems",
    },
    from: "2026-10",
    to: null,
    location: {
      de: "München",
      en: "Munich",
    },
    logo: {
      src: "/icons/tum-transparent.png",
      alt: "Technische Universität München",
      scale: 1.4,
    },
  },
  {
    id: "mannheim-business-informatics",
    category: "education",
    organization: "Universität Mannheim",
    role: {
      de: "B.Sc. Wirtschaftsinformatik",
      en: "B.Sc. Business Informatics",
    },
    from: "2021-09",
    to: "2026-07",
    location: {
      de: "Mannheim",
      en: "Mannheim",
    },
    logo: {
      src: "/icons/UniMannheim.png",
      alt: "Universität Mannheim",
    },
    bullets: {
      de: [
        "Durchschnitt: 2,4",
        "Bachelorarbeit: Entwicklung eines interaktiven Lern- und Übungsmoduls zum Thema Rot-Schwarz-Bäume für die E-Learning-Plattform der Universität Mannheim · Note: 1,0",
      ],
      en: [
        "Grade: 2.4",
        "Bachelor’s thesis: Development of an interactive learning and practice module on red-black trees for the University of Mannheim’s e-learning platform · Grade: 1.0",
      ],
    },
  },
  {
    id: "georg-buechner-abitur",
    category: "education",
    organization: "Georg-Büchner-Gymnasium",
    role: {
      de: "Abitur",
      en: "German Abitur",
    },
    from: "2013-09",
    to: "2021-06",
    location: {
      de: "Köln-Weiden",
      en: "Cologne-Weiden",
    },
    logo: {
      src: "/icons/GeorgBuechner.png",
      alt: "Georg-Büchner-Gymnasium",
      scale: 1.4,
    },
    bullets: {
      de: ["Durchschnitt: 2,5"],
      en: ["Grade: 2.5"],
    },
  },
] as const;

export const languages: readonly LanguageEntry[] = [
  {
    id: "german",
    name: { de: "Deutsch", en: "German" },
    level: { de: "Muttersprache", en: "Native" },
  },
  {
    id: "english",
    name: { de: "Englisch", en: "English" },
    level: { de: "C1 (TOEFL iBT 110/120)", en: "C1 (TOEFL iBT 110/120)" },
  },
] as const;

export const cvEntries = [...experience, ...education] as const;
