// Structured CV data (Berufserfahrung, Ausbildung, Projekte, Sprachkenntnisse — requirements §5.3).
// Proper names, role titles and body copy stay untranslated (same convention as About's skills list).

import { type LucideIcon } from "lucide-react";

export type CvEntry = {
  organization: string;
  role: string;
  from: string; // "YYYY-MM"
  to: string | null; // null = ongoing / present
  bullets?: string[];
  logo?: string; // image path under /public for org logos
  logoScale?: number; // zoom factor for logos with excess whitespace/margin
  icon?: LucideIcon; // fallback vector icon when there is no logo
};

export type ProjectEntry = {
  name: string;
  description: string;
  link?: string;
};

export type LanguageEntry = {
  name: string;
  level: string;
};

// Newest first.
export const experience: CvEntry[] = [
  {
    organization: "Speira GmbH",
    role: "Werkstudent IT Governance | Teilzeit | Grevenbroich",
    from: "2025-03",
    to: null,
    logo: "/icons/speira.jpg",
    bullets: [
      "Verwaltung externer IT-Dienstleister",
      "Eigenständige Abwicklung von IT-Beschaffungsprozessen und Bestellungen über SAP Logon und Coupa",
      "Mitarbeit mit dem IT-PMO Team zur Realisierung von IT-Projekten",
    ],
  },
];

// Newest first.
export const education: CvEntry[] = [
  {
    organization: "Technische Universität München",
    role: "M.Sc. Information Systems",
    from: "2026-10",
    to: null,
    logo: "/icons/tum.png",
    logoScale: 1.4,
  },
  {
    organization: "Universität Mannheim",
    role: "B.Sc. Wirtschaftsinformatik",
    from: "2021-09",
    to: "2026-07",
    logo: "/icons/uni-mannheim.webp",
    bullets: [
      "Aktueller Durchschnitt: 2,4",
      "Bachelorarbeit: Entwicklung eines interaktiven Lern- und Übungsmoduls zum Thema Rot-Schwarz-Bäume für die E-Learning-Plattform der Universität Mannheim",
    ],
  },
  {
    organization: "Georg-Büchner-Gymnasium",
    role: "Abitur | Köln-Weiden",
    from: "2013-09",
    to: "2021-06",
    logo: "/icons/georgbuechnericon.jpg",
    logoScale: 1.4,
    bullets: ["Durchschnitt: 2,5"],
  },
];

export const projects: ProjectEntry[] = [
  {
    name: "Immobilienverwaltungsplattform",
    description:
      "Vollautomatisierte Immobilienverwaltung von Bewerberauswahl bis Vertragsabwicklung, mit individuellem Dashboard für Finanzkontrolle und Aufgabenplanung.",
    link: "https://github.com/Joelabc123/immo-manager",
  },
  {
    name: "Rot-Schwarz-Baum Lern- und Übungsmodul",
    description:
      "Für die E-Learning-Plattform der Universität Mannheim: Grapheneditor, automatische Fehlererkennung/-behebung, interaktive Tutorials, Algorithmen-Simulator.",
  },
  {
    name: "Quizduell",
    description:
      "Projektarbeit Client-Server-Architektur über TCP-Sockets in Java.",
    link: "https://github.com/Joelabc123/Quizduell",
  },
  {
    name: "Online-Brettspiel",
    description: "Kollaborativ in Java entwickelt.",
    link: "https://github.com/robert-kratz/capture-the-flag-multiplayer",
  },
];

export const languages: LanguageEntry[] = [
  { name: "Deutsch", level: "Muttersprache" },
  { name: "Englisch", level: "C1 (TOEFL iBT 110/120)" },
];
