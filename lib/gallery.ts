import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";
import type { GalleryManifest, GalleryTrip } from "@/lib/gallery-types";

const manifestPath = path.join(
  process.cwd(),
  "lib",
  "generated",
  "gallery-manifest.json",
);

let cachedManifest: GalleryManifest | undefined;

export function getGalleryManifest(): GalleryManifest {
  if (cachedManifest) return cachedManifest;

  let source: string;
  try {
    source = readFileSync(manifestPath, "utf8");
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      cachedManifest = { version: 1, trips: [] };
      return cachedManifest;
    }
    throw error;
  }

  const manifest: unknown = JSON.parse(source);
  if (
    !manifest ||
    typeof manifest !== "object" ||
    !("version" in manifest) ||
    manifest.version !== 1 ||
    !("trips" in manifest) ||
    !Array.isArray(manifest.trips)
  ) {
    throw new Error(
      "The generated gallery manifest is invalid. Run npm run gallery:prepare.",
    );
  }

  cachedManifest = manifest as GalleryManifest;
  return cachedManifest;
}

export function getGalleryTrips(): readonly GalleryTrip[] {
  return getGalleryManifest().trips;
}

export function getGalleryTrip(
  year: string,
  countrySlug: string,
  tripSlug: string,
): GalleryTrip | undefined {
  return getGalleryTrips().find(
    (trip) =>
      String(trip.year) === year &&
      trip.countrySlug === countrySlug &&
      trip.tripSlug === tripSlug,
  );
}

export function getGalleryStaticParams() {
  const params = getGalleryTrips().map((trip) => ({
    year: String(trip.year),
    country: trip.countrySlug,
    trip: trip.tripSlug,
  }));

  // Next.js 16 needs at least one generated path to establish a static
  // fallback boundary. The placeholder itself resolves through notFound().
  return params.length > 0
    ? params
    : [{ year: "__empty__", country: "__empty__", trip: "__empty__" }];
}
