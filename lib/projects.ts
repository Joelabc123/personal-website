import type { Locale, LocalizedText } from "@/lib/cv";

export type ProjectStatus = "published" | "coming-soon";
export type ProjectLinkKind = "repository" | "demo" | "documentation";
export type ProjectPlaceholderVariant =
  | "property"
  | "learning"
  | "quiz"
  | "board-game"
  | "finance";

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
  description: LocalizedText;
  status: ProjectStatus;
  featured: boolean;
  media: readonly ProjectMedia[];
  links: readonly {
    kind: ProjectLinkKind;
    href: string;
  }[];
};

export const projectPlaceholderSources: Readonly<
  Record<ProjectPlaceholderVariant, string>
> = {
  property: "/images/projects/property-management.svg",
  learning: "/images/projects/learning-module.svg",
  quiz: "/images/projects/quiz-duel.svg",
  "board-game": "/images/projects/board-game.svg",
  finance: "/images/projects/finance-platform.svg",
};

export const projects: readonly Project[] = [
  {
    slug: "property-management-platform",
    title: {
      de: "Immobilienverwaltungsplattform",
      en: "Property Management Platform",
    },
    description: {
      de: "Vollautomatisierte Immobilienverwaltung von Bewerberauswahl bis Vertragsabwicklung, mit individuellem Dashboard für Finanzkontrolle und Aufgabenplanung.",
      en: "Fully automated property management from applicant selection to contract processing, with a custom dashboard for financial control and task planning.",
    },
    status: "published",
    featured: true,
    media: [
      {
        type: "image",
        src: "/images/projects/property-management.png",
        width: 2559,
        height: 1267,
        cardPosition: "50% 0%",
        cardPositionMobile: "18% 0%",
        frameBackground: "#ffffff",
        alt: {
          de: "Dashboard der Immobilienverwaltungsplattform mit Kennzahlen und offenen Aufgaben",
          en: "Property management platform dashboard with metrics and open tasks",
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
      de: "Rot-Schwarz-Baum Lern- und Übungsmodul",
      en: "Red-Black Tree Learning and Practice Module",
    },
    description: {
      de: "Für die E-Learning-Plattform der Universität Mannheim: Grapheneditor, automatische Fehlererkennung und -behebung, interaktive Tutorials und Algorithmen-Simulator.",
      en: "Built for the University of Mannheim’s e-learning platform: graph editor, automated error detection and correction, interactive tutorials, and an algorithm simulator.",
    },
    status: "published",
    featured: false,
    media: [
      {
        type: "image",
        src: "/images/projects/red-black-tree-learning-module.png",
        width: 2239,
        height: 1104,
        cardPosition: "40% 50%",
        frameBackground: "#ffffff",
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
    description: {
      de: "Projektarbeit zu einer Client-Server-Architektur über TCP-Sockets in Java.",
      en: "Course project implementing a client-server architecture over TCP sockets in Java.",
    },
    status: "published",
    featured: false,
    media: [
      {
        type: "image",
        src: "/images/projects/quiz-duel.png",
        width: 2105,
        height: 1110,
        cardPosition: "52% 50%",
        frameBackground:
          "linear-gradient(180deg, #0496c6 0%, #92e0f1 100%)",
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
    description: {
      de: "Kollaborativ in Java entwickelt.",
      en: "Developed collaboratively in Java.",
    },
    status: "published",
    featured: false,
    media: [
      {
        type: "image",
        src: "/images/projects/online-board-game.png",
        width: 1810,
        height: 1096,
        cardPosition: "50% 50%",
        frameBackground:
          "linear-gradient(90deg, #071d2d 0%, #231322 100%)",
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
      de: "Finanzverwaltungsplattform",
      en: "Finance Management Platform",
    },
    description: {
      de: "In Entwicklung.",
      en: "In development.",
    },
    status: "coming-soon",
    featured: false,
    media: [
      {
        type: "placeholder",
        variant: "finance",
        alt: {
          de: "Neutraler Platzhalter für die Finanzverwaltungsplattform",
          en: "Neutral placeholder for the finance management platform",
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
