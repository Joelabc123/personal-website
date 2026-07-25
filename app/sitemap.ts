import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getGalleryTrips } from "@/lib/gallery";
import { absoluteUrl, languageAlternates } from "@/lib/metadata";
import { publishedProjects } from "@/lib/projects";
import { siteConfig } from "@/lib/siteConfig";

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

function localizedEntries({
  path,
  changeFrequency,
  priority,
  images,
}: {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
  images?: string[];
}): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: absoluteUrl(locale, path),
    alternates: {
      languages: languageAlternates(path),
    },
    changeFrequency,
    priority,
    ...(images && images.length > 0 ? { images } : {}),
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "", changeFrequency: "monthly", priority: 1 },
    { path: "/cv", changeFrequency: "monthly", priority: 0.9 },
    { path: "/projects", changeFrequency: "monthly", priority: 0.9 },
    { path: "/travel", changeFrequency: "monthly", priority: 0.8 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
    { path: "/impressum", changeFrequency: "yearly", priority: 0.2 },
    { path: "/datenschutz", changeFrequency: "yearly", priority: 0.2 },
  ] as const;

  const projectRoutes = publishedProjects.flatMap((project) =>
    localizedEntries({
      path: `/projects/${project.slug}`,
      changeFrequency: "monthly",
      priority: project.featured ? 0.8 : 0.7,
    }),
  );

  const travelRoutes = getGalleryTrips().flatMap((trip) =>
    localizedEntries({
      path: `/travel/${trip.year}/${trip.countrySlug}/${trip.tripSlug}`,
      changeFrequency: "yearly",
      priority: 0.6,
      images: trip.images.map((image) =>
        new URL(image.src, siteConfig.url).toString(),
      ),
    }),
  );

  return [
    ...staticRoutes.flatMap((route) => localizedEntries(route)),
    ...projectRoutes,
    ...travelRoutes,
  ];
}
