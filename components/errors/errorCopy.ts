export type ErrorLocale = "de" | "en";

export const errorCopy = {
  de: {
    notFound: {
      eyebrow: "Fehler 404",
      title: "Diese Seite wurde nicht gefunden.",
      description:
        "Der Link ist möglicherweise veraltet oder die Adresse ist nicht korrekt. Über die Startseite findest du zurück ins Portfolio.",
      status: "Route nicht gefunden",
      home: "Zur Startseite",
      projects: "Projekte ansehen",
      metadataTitle: "Seite nicht gefunden | Joel Bakirel",
      metadataDescription:
        "Die angeforderte Seite konnte nicht gefunden werden.",
    },
    internal: {
      eyebrow: "Fehler 500",
      title: "Da ist etwas schiefgelaufen.",
      description:
        "Die Seite konnte gerade nicht geladen werden. Versuche es erneut oder kehre zur Startseite zurück.",
      status: "Unerwarteter Fehler",
      retry: "Erneut versuchen",
      home: "Zur Startseite",
      metadataTitle: "Fehler | Joel Bakirel",
    },
  },
  en: {
    notFound: {
      eyebrow: "Error 404",
      title: "Page not found.",
      description:
        "The link may be outdated or the address may be incorrect. Head back to the homepage to continue through the portfolio.",
      status: "Route not found",
      home: "Back to the homepage",
      projects: "View projects",
      metadataTitle: "Page not found | Joel Bakirel",
      metadataDescription: "The requested page could not be found.",
    },
    internal: {
      eyebrow: "Error 500",
      title: "Something went wrong.",
      description:
        "This page couldn’t be loaded right now. Try again or return to the homepage.",
      status: "Unexpected error",
      retry: "Try again",
      home: "Back to the homepage",
      metadataTitle: "Error | Joel Bakirel",
    },
  },
} as const;

export function resolveErrorLocale(locale: string | null | undefined): ErrorLocale {
  return locale === "en" ? "en" : "de";
}
