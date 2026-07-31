import type { Locale } from "./cv.ts";
import { education, experience, languages, localize } from "./cv.ts";
import type { GalleryTrip } from "./gallery-types.ts";
import { localizeGalleryText } from "./gallery-types.ts";
import { absoluteUrl } from "./metadata.ts";
import {
  localizeProjectText,
  projectPlaceholderSources,
  type Project,
} from "./projects.ts";
import { siteConfig } from "./siteConfig.ts";

type JsonLd = Record<string, unknown>;
type PageType =
  | "CollectionPage"
  | "ContactPage"
  | "ProfilePage"
  | "WebPage";

type PageDetails = {
  locale: Locale;
  path?: string;
  name: string;
  description: string;
};

const personId = `${siteConfig.url}/#person`;
const websiteId = `${siteConfig.url}/#website`;

function personNode(locale: Locale): JsonLd {
  return {
    "@type": "Person",
    "@id": personId,
    name: siteConfig.name,
    url: siteConfig.url,
    email: `mailto:${siteConfig.email}`,
    sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
    homeLocation: {
      "@type": "Place",
      name: locale === "de" ? "Köln, Deutschland" : "Cologne, Germany",
    },
    worksFor: experience.map((entry) => ({
      "@type": "Organization",
      name: entry.organization,
    })),
    alumniOf: education.map((entry) => ({
      "@type": "EducationalOrganization",
      name: entry.organization,
    })),
    knowsLanguage: languages.map((language) => localize(language.name, locale)),
  };
}

function websiteNode(): JsonLd {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: siteConfig.url,
    name: siteConfig.name,
    inLanguage: ["de", "en"],
    publisher: { "@id": personId },
  };
}

function pageNode(
  { locale, path = "", name, description }: PageDetails,
  type: PageType,
  extra: JsonLd = {},
): JsonLd {
  const url = absoluteUrl(locale, path);

  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: locale,
    isPartOf: { "@id": websiteId },
    author: { "@id": personId },
    ...extra,
  };
}

function graphJsonLd(locale: Locale, ...nodes: JsonLd[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [websiteNode(), personNode(locale), ...nodes],
  };
}

function projectImage(project: Project): string | undefined {
  const firstMedia = project.media[0];

  if (firstMedia?.type === "placeholder") {
    return new URL(
      projectPlaceholderSources[firstMedia.variant],
      siteConfig.url,
    ).toString();
  }

  if (firstMedia && firstMedia.type !== "video") {
    return new URL(firstMedia.src, siteConfig.url).toString();
  }

  return firstMedia?.poster
    ? new URL(firstMedia.poster, siteConfig.url).toString()
    : undefined;
}

function projectNode(project: Project, locale: Locale): JsonLd {
  const path = `/projects/${project.slug}`;
  const image = projectImage(project);

  return {
    "@type": "CreativeWork",
    "@id": `${absoluteUrl(locale, path)}#creative-work`,
    name: localizeProjectText(project.title, locale),
    description: localizeProjectText(project.description, locale),
    url: absoluteUrl(locale, path),
    inLanguage: locale,
    creator: { "@id": personId },
    ...(image ? { image } : {}),
    ...(project.links.length > 0
      ? { sameAs: project.links.map((link) => link.href) }
      : {}),
  };
}

function tripPath(trip: GalleryTrip): string {
  return `/travel/${trip.year}/${trip.countrySlug}/${trip.tripSlug}`;
}

function tripName(trip: GalleryTrip, locale: Locale): string {
  return `${localizeGalleryText(trip.meta.place, locale)} (${trip.year})`;
}

function imageNode(
  image: GalleryTrip["images"][number],
  locale: Locale,
): JsonLd {
  return {
    "@type": "ImageObject",
    contentUrl: new URL(image.src, siteConfig.url).toString(),
    caption: localizeGalleryText(image.alt, locale),
    width: image.width,
    height: image.height,
    inLanguage: locale,
  };
}

function tripNode(
  trip: GalleryTrip,
  locale: Locale,
  includeAllImages = false,
): JsonLd {
  const url = absoluteUrl(locale, tripPath(trip));
  const images = includeAllImages
    ? trip.images.map((image) => imageNode(image, locale))
    : [imageNode(trip.cover, locale)];

  return {
    "@type": "ImageGallery",
    "@id": `${url}#image-gallery`,
    url,
    name: tripName(trip, locale),
    inLanguage: locale,
    creator: { "@id": personId },
    contentLocation: {
      "@type": "Place",
      name: `${localizeGalleryText(trip.meta.place, locale)}, ${localizeGalleryText(trip.meta.country, locale)}`,
    },
    ...(trip.meta.date ? { dateCreated: trip.meta.date } : {}),
    image: images,
  };
}

export function personJsonLd(locale: Locale): JsonLd {
  return {
    "@context": "https://schema.org",
    ...personNode(locale),
  };
}

export function projectJsonLd(project: Project, locale: Locale): JsonLd {
  return {
    "@context": "https://schema.org",
    ...projectNode(project, locale),
  };
}

export function profilePageJsonLd(details: PageDetails): JsonLd {
  return graphJsonLd(
    details.locale,
    pageNode(details, "ProfilePage", {
      mainEntity: { "@id": personId },
    }),
  );
}

export function projectsPageJsonLd(
  details: PageDetails,
  projects: readonly Project[],
): JsonLd {
  const listId = `${absoluteUrl(details.locale, details.path)}#project-list`;
  const works = projects.map((project) => projectNode(project, details.locale));
  const list: JsonLd = {
    "@type": "ItemList",
    "@id": listId,
    numberOfItems: works.length,
    itemListElement: works.map((work, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: { "@id": work["@id"] },
    })),
  };

  return graphJsonLd(
    details.locale,
    pageNode(details, "CollectionPage", { mainEntity: { "@id": listId } }),
    list,
    ...works,
  );
}

export function projectPageJsonLd(
  details: PageDetails,
  project: Project,
): JsonLd {
  const work = projectNode(project, details.locale);

  return graphJsonLd(
    details.locale,
    pageNode(details, "WebPage", {
      mainEntity: { "@id": work["@id"] },
    }),
    work,
  );
}

export function travelPageJsonLd(
  details: PageDetails,
  trips: readonly GalleryTrip[],
): JsonLd {
  const listId = `${absoluteUrl(details.locale, details.path)}#travel-list`;
  const galleries = trips.map((trip) => tripNode(trip, details.locale));
  const list: JsonLd = {
    "@type": "ItemList",
    "@id": listId,
    numberOfItems: galleries.length,
    itemListElement: galleries.map((gallery, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: { "@id": gallery["@id"] },
    })),
  };

  return graphJsonLd(
    details.locale,
    pageNode(details, "CollectionPage", { mainEntity: { "@id": listId } }),
    list,
    ...galleries,
  );
}

export function travelTripPageJsonLd(
  details: PageDetails,
  trip: GalleryTrip,
): JsonLd {
  const gallery = tripNode(trip, details.locale, true);

  return graphJsonLd(
    details.locale,
    pageNode(details, "WebPage", {
      mainEntity: { "@id": gallery["@id"] },
    }),
    gallery,
  );
}

export function contactPageJsonLd(details: PageDetails): JsonLd {
  return graphJsonLd(
    details.locale,
    pageNode(details, "ContactPage", {
      mainEntity: { "@id": personId },
    }),
  );
}

export function webPageJsonLd(
  details: PageDetails,
  about: "person" | "website",
): JsonLd {
  return graphJsonLd(
    details.locale,
    pageNode(details, "WebPage", {
      about: { "@id": about === "person" ? personId : websiteId },
    }),
  );
}
