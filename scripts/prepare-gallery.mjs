import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  GalleryValidationError,
  prepareGallery,
} from "./gallery-pipeline.mjs";

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptsDirectory, "..");

try {
  const manifest = await prepareGallery({
    sourceRoot: path.join(projectRoot, "content", "gallery"),
    outputRoot: path.join(projectRoot, "public", "generated", "gallery"),
    manifestPath: path.join(
      projectRoot,
      "lib",
      "generated",
      "gallery-manifest.json",
    ),
  });
  const imageCount = manifest.trips.reduce(
    (total, trip) => total + trip.images.length,
    0,
  );
  console.log(
    `Gallery prepared: ${manifest.trips.length} trip(s), ${imageCount} image(s).`,
  );
} catch (error) {
  if (error instanceof GalleryValidationError) {
    console.error(error.message);
  } else {
    console.error("Gallery preparation failed unexpectedly.", error);
  }
  process.exitCode = 1;
}
