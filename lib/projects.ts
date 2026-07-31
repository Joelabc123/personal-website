import type { Locale, LocalizedText } from "@/lib/cv";

export type ProjectStatus = "published" | "coming-soon";
export type ProjectLinkKind = "repository" | "demo" | "documentation";
export type ProjectMotif =
  | "property-flow"
  | "red-black-tree"
  | "quiz-network"
  | "game-board"
  | "finance-dashboard";

export const projectPlaceholderSources = {
  finance: "/images/projects/finance-platform.svg",
} as const;

type ProjectPlaceholderVariant = keyof typeof projectPlaceholderSources;

export type ProjectMedia =
  | {
      type: "image" | "gif";
      src: string;
      width: number;
      height: number;
      cardPosition?: string;
      cardPositionMobile?: string;
      frameBackground?: string;
      alt: LocalizedText;
    }
  | {
      type: "video";
      src: string;
      poster?: string;
      alt: LocalizedText;
    }
  | {
      type: "placeholder";
      variant: ProjectPlaceholderVariant;
      alt: LocalizedText;
    };

export type Project = {
  slug: string;
  title: LocalizedText;
  type: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  highlight: LocalizedText;
  technologies: readonly string[];
  motif: ProjectMotif;
  status: ProjectStatus;
  featured: boolean;
  media: readonly ProjectMedia[];
  links: readonly {
    kind: ProjectLinkKind;
    href: string;
  }[];
};

export const projects: readonly Project[] = [
  {
    slug: "property-management-platform",
    title: {
      de: "Immobilienverwaltung",
      en: "Property Management",
    },
    type: {
      de: "Web-Anwendung",
      en: "Web application",
    },
    summary: {
      de: "Automatisierte Abläufe von der Bewerbung bis zur laufenden Objektverwaltung.",
      en: "Automated workflows from tenant application to day-to-day property management.",
    },
    description: {
      de: "Eine durchgängige Immobilienverwaltung, die Bewerberauswahl, Vertragsabwicklung und laufende Verwaltungsaufgaben in einem zentralen Arbeitsbereich zusammenführt. Ein individuelles Dashboard unterstützt zusätzlich bei Finanzkontrolle und Aufgabenplanung.",
      en: "An end-to-end property management workspace that brings applicant selection, contract processing, and ongoing administration together. A custom dashboard also supports financial control and task planning.",
    },
    highlight: {
      de: "Ein Workflow für Bewerbung, Vertrag und Verwaltung",
      en: "One workflow for applications, contracts, and management",
    },
    technologies: ["TypeScript", "Web App", "Automation"],
    motif: "property-flow",
    status: "published",
    featured: true,
    media: [
      {
        type: "image",
        src: "/images/projects/property-management.png",
        width: 2559,
        height: 1267,
        alt: {
          de: "Dashboard der Immobilienverwaltung mit Kennzahlen und offenen Aufgaben",
          en: "Property management dashboard with metrics and open tasks",
        },
      },
    ],
    links: [
      {
        kind: "repository",
        href: "https://github.com/Joelabc123/immo-manager",
      },
    ],
  },
  {
    slug: "red-black-tree-learning-module",
    title: {
      de: "Rot-Schwarz-Baum",
      en: "Red-Black Tree",
    },
    type: {
      de: "Interaktives Lernmodul",
      en: "Interactive learning module",
    },
    summary: {
      de: "Algorithmen verstehen, Bäume bearbeiten und Fehler direkt korrigieren.",
      en: "Understand algorithms, edit trees, and correct errors directly.",
    },
    description: {
      de: "Ein Lern- und Übungsmodul für die E-Learning-Plattform der Universität Mannheim. Es verbindet Grapheneditor, automatische Fehlererkennung und -behebung, interaktive Tutorials und einen Algorithmen-Simulator.",
      en: "A learning and practice module for the University of Mannheim’s e-learning platform. It combines a graph editor, automated error detection and correction, interactive tutorials, and an algorithm simulator.",
    },
    highlight: {
      de: "Direktes Feedback bei ungültigen Baumoperationen",
      en: "Immediate feedback for invalid tree operations",
    },
    technologies: ["Algorithms", "Graph Editor", "E-Learning"],
    motif: "red-black-tree",
    status: "published",
    featured: false,
    media: [
      {
        type: "image",
        src: "/images/projects/red-black-tree-learning-module.png",
        width: 2239,
        height: 1104,
        alt: {
          de: "Grapheneditor des Rot-Schwarz-Baum-Lernmoduls mit einem Beispielbaum",
          en: "Graph editor of the red-black tree learning module showing an example tree",
        },
      },
    ],
    links: [],
  },
  {
    slug: "quiz-duel",
    title: {
      de: "Quizduell",
      en: "Quiz Duel",
    },
    type: {
      de: "Client-Server-Spiel",
      en: "Client-server game",
    },
    summary: {
      de: "Zwei Spieler treten über eine direkte Netzwerkverbindung gegeneinander an.",
      en: "Two players compete through a direct network connection.",
    },
    description: {
      de: "Eine Projektarbeit zur Entwicklung einer Client-Server-Architektur über TCP-Sockets in Java. Spielstände, Fragen und Antworten werden zwischen zwei Clients koordiniert und zuverlässig ausgetauscht.",
      en: "A course project implementing a client-server architecture over TCP sockets in Java. Scores, questions, and answers are coordinated and reliably exchanged between two clients.",
    },
    highlight: {
      de: "Synchroner Datenaustausch zwischen zwei Spielern",
      en: "Synchronous data exchange between two players",
    },
    technologies: ["Java", "TCP Sockets", "Client–Server"],
    motif: "quiz-network",
    status: "published",
    featured: false,
    media: [
      {
        type: "image",
        src: "/images/projects/quiz-duel.png",
        width: 2105,
        height: 1110,
        alt: {
          de: "Quizduell-Spielansicht mit Punktestand und Kategorieauswahl",
          en: "Quiz Duel game screen with score and category selection",
        },
      },
    ],
    links: [
      {
        kind: "repository",
        href: "https://github.com/Joelabc123/Quizduell",
      },
    ],
  },
  {
    slug: "online-board-game",
    title: {
      de: "Online-Brettspiel",
      en: "Online Board Game",
    },
    type: {
      de: "Multiplayer-Spiel",
      en: "Multiplayer game",
    },
    summary: {
      de: "Strategisches Capture the Flag auf einem digitalen Spielfeld für bis zu vier Personen.",
      en: "Strategic capture the flag on a digital board for up to four players.",
    },
    description: {
      de: "Ein kollaborativ entwickeltes Capture-the-Flag-Spiel mit Client, Server und KI-Client. Die Java-Anwendung bildet strategische Mehrspieler-Partien auf einem zweidimensionalen Spielfeld ab.",
      en: "A collaboratively developed capture-the-flag game with a client, server, and AI client. The Java application supports strategic multiplayer matches on a two-dimensional board.",
    },
    highlight: {
      de: "Bis zu 4 Spieler plus eigenständiger KI-Client",
      en: "Up to 4 players plus a dedicated AI client",
    },
    technologies: ["Java", "JavaFX", "Client–Server"],
    motif: "game-board",
    status: "published",
    featured: false,
    media: [
      {
        type: "image",
        src: "/images/projects/online-board-game.png",
        width: 1810,
        height: 1096,
        alt: {
          de: "Spielansicht des Online-Brettspiels mit blau-roten Spielfiguren",
          en: "Online board game screen with blue and red game pieces",
        },
      },
    ],
    links: [
      {
        kind: "repository",
        href: "https://github.com/robert-kratz/capture-the-flag-multiplayer",
      },
    ],
  },
  {
    slug: "finance-management-platform",
    title: {
      de: "Finanzplattform",
      en: "Finance Platform",
    },
    type: {
      de: "FinTech-Plattform",
      en: "FinTech platform",
    },
    summary: {
      de: "Finanzdaten, Trends und zentrale Kennzahlen in einer klaren Übersicht.",
      en: "Financial data, trends, and key metrics in one clear overview.",
    },
    description: {
      de: "Eine derzeit entstehende Plattform, die Finanzdaten in verständliche Verläufe, Balkendiagramme und kompakte Kennzahlen übersetzt. Der Fokus liegt auf einer schnellen, visuellen Einordnung komplexer Entwicklungen.",
      en: "A platform currently in development that translates financial data into clear trends, bar charts, and compact metrics. Its focus is fast visual interpretation of complex developments.",
    },
    highlight: {
      de: "Kennzahlen und Trends auf einen Blick",
      en: "Metrics and trends at a glance",
    },
    technologies: ["Data Visualization", "Analytics", "Web App"],
    motif: "finance-dashboard",
    status: "coming-soon",
    featured: false,
    media: [
      {
        type: "placeholder",
        variant: "finance",
        alt: {
          de: "Abstrakte Vorschau der Finanzplattform mit Diagrammen und Kennzahlen",
          en: "Abstract preview of the finance platform with charts and metrics",
        },
      },
    ],
    links: [],
  },
] as const;

export const publishedProjects = projects.filter(
  (project) => project.status === "published",
);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getPublishedProjectBySlug(slug: string): Project | undefined {
  const project = getProjectBySlug(slug);

  return project?.status === "published" ? project : undefined;
}

export function localizeProjectText(
  value: LocalizedText,
  locale: Locale,
): string {
  return value[locale];
}
