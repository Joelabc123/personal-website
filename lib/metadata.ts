import type { Metadata } from "next";
import { routing } from "../i18n/routing.ts";
import type { Locale } from "./cv.ts";
import { siteConfig } from "./siteConfig.ts";

const openGraphLocales: Readonly<Record<Locale, string>> = {
  de: "de_DE",
  en: "en_US",
};

export function asLocale(locale: string): Locale {
  return locale === "en" ? "en" : "de";
}

export function localizedPath(locale: Locale, path = ""): string {
  const normalizedPath =
    path === "/" || path === "" ? "" : path.startsWith("/") ? path : `/${path}`;

  return `/${locale}${normalizedPath}`;
}

export function absoluteUrl(locale: Locale, path = ""): string {
  return new URL(localizedPath(locale, path), siteConfig.url).toString();
}

export function languageAlternates(path = ""): Record<string, string> {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      absoluteUrl(locale, path),
    ]),
  );

  return {
    ...languages,
    "x-default": absoluteUrl(routing.defaultLocale, path),
  };
}

export function createLocalizedMetadata({
  locale,
  path = "",
  title,
  description,
  openGraphImagePath = "",
  index = true,
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  openGraphImagePath?: "" | "/cv" | "/projects" | "/travel";
  index?: boolean;
}): Metadata {
  const canonical = absoluteUrl(locale, path);
  const openGraphImage = absoluteUrl(
    locale,
    `${openGraphImagePath}/opengraph-image`,
  );
  const alternateLocale = routing.locales
    .filter((candidate) => candidate !== locale)
    .map((candidate) => openGraphLocales[candidate]);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: siteConfig.name,
      locale: openGraphLocales[locale],
      alternateLocale,
      images: [
        {
          url: openGraphImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [openGraphImage],
    },
    robots: {
      index,
      follow: index,
    },
  };
}
