import type { Locale } from "./cv.ts";
import { education, experience, languages, localize } from "./cv.ts";
import { absoluteUrl } from "./metadata.ts";
import {
  localizeProjectText,
  projectPlaceholderSources,
  type Project,
} from "./projects.ts";
import { siteConfig } from "./siteConfig.ts";

type JsonLd = Record<string, unknown>;

export function personJsonLd(locale: Locale): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/#person`,
    name: siteConfig.name,
    url: absoluteUrl(locale),
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

export function projectJsonLd(project: Project, locale: Locale): JsonLd {
  const path = `/projects/${project.slug}`;
  const firstMedia = project.media[0];
  const image =
    firstMedia?.type === "placeholder"
      ? new URL(
          projectPlaceholderSources[firstMedia.variant],
          siteConfig.url,
        ).toString()
      : firstMedia && firstMedia.type !== "video"
        ? new URL(firstMedia.src, siteConfig.url).toString()
        : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${absoluteUrl(locale, path)}#creative-work`,
    name: localizeProjectText(project.title, locale),
    description: localizeProjectText(project.description, locale),
    url: absoluteUrl(locale, path),
    inLanguage: locale,
    creator: {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: siteConfig.name,
    },
    ...(image ? { image } : {}),
    ...(project.links.length > 0
      ? { sameAs: project.links.map((link) => link.href) }
      : {}),
  };
}
