import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import {
  GalleryValidationError,
  prepareGallery,
} from "../scripts/gallery-pipeline.mjs";

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-gallery-"));
  return {
    root,
    sourceRoot: path.join(root, "content", "gallery"),
    outputRoot: path.join(root, "public", "generated", "gallery"),
    manifestPath: path.join(root, "lib", "generated", "gallery-manifest.json"),
  };
}

async function writeImage(filename, index = 0) {
  await sharp({
    create: {
      width: 80 + index,
      height: 60,
      channels: 3,
      background: {
        r: (index * 31) % 255,
        g: 90,
        b: 160,
      },
    },
  })
    .jpeg()
    .toFile(filename);
}

async function writeTrip(
  sourceRoot,
  {
    year = "2026",
    country = "japan",
    trip = "tokyo",
    names = ["01-cover.jpg"],
    meta = {},
  } = {},
) {
  const directory = path.join(sourceRoot, year, country, trip);
  await mkdir(directory, { recursive: true });
  await writeFile(
    path.join(directory, "_meta.json"),
    JSON.stringify({
      country: { de: "Japan", en: "Japan" },
      place: { de: "Tokio", en: "Tokyo" },
      date: `${year}-04`,
      ...meta,
    }),
  );
  for (const [index, name] of names.entries()) {
    await writeImage(path.join(directory, name), index);
  }
  return directory;
}

test("a missing gallery folder creates an empty manifest", async () => {
  const paths = await fixture();
  try {
    const manifest = await prepareGallery(paths);
    assert.deepEqual(manifest, { version: 1, trips: [] });
    assert.deepEqual(
      JSON.parse(await readFile(paths.manifestPath, "utf8")),
      manifest,
    );
  } finally {
    await rm(paths.root, { recursive: true, force: true });
  }
});

test("images sort naturally and six/seven image collapse defaults are stable", async () => {
  const paths = await fixture();
  try {
    await writeTrip(paths.sourceRoot, {
      trip: "six-images",
      names: [
        "10-view.jpg",
        "02-view.jpg",
        "01-cover.jpg",
        "03-view.jpg",
        "04-view.jpg",
        "05-view.jpg",
      ],
      meta: { place: { de: "Sechs", en: "Six" }, cover: "02-view.jpg" },
    });
    await writeTrip(paths.sourceRoot, {
      trip: "seven-images",
      names: Array.from(
        { length: 7 },
        (_, index) => `${String(index + 1).padStart(2, "0")}-view.jpg`,
      ),
      meta: { place: { de: "Sieben", en: "Seven" }, date: "2026-05" },
    });

    const manifest = await prepareGallery(paths);
    const seven = manifest.trips.find((trip) => trip.tripSlug === "seven-images");
    const six = manifest.trips.find((trip) => trip.tripSlug === "six-images");

    assert.equal(manifest.trips[0].tripSlug, "seven-images");
    assert.equal(six.collapsed, false);
    assert.equal(seven.collapsed, true);
    assert.match(six.cover.id, /02-view$/);
    assert.deepEqual(
      six.images.map((image) => image.id.split("-").slice(-2).join("-")),
      [
        "01-cover",
        "02-view",
        "03-view",
        "04-view",
        "05-view",
        "10-view",
      ],
    );
    assert.ok(six.images.every((image) => image.src.endsWith(".webp")));
  } finally {
    await rm(paths.root, { recursive: true, force: true });
  }
});

test("metadata can override collapse, layout, and localized alt text", async () => {
  const paths = await fixture();
  try {
    await writeTrip(paths.sourceRoot, {
      names: Array.from(
        { length: 7 },
        (_, index) => `${String(index + 1).padStart(2, "0")}-view.jpg`,
      ),
      meta: {
        collapsed: false,
        layout: { "01-view.jpg": "tall" },
        alt: {
          "01-view.jpg": {
            de: "Manueller Alternativtext",
            en: "Manual alternative text",
          },
        },
      },
    });

    const manifest = await prepareGallery(paths);
    assert.equal(manifest.trips[0].collapsed, false);
    assert.equal(manifest.trips[0].images[0].layout, "tall");
    assert.equal(
      manifest.trips[0].images[0].alt.en,
      "Manual alternative text",
    );
  } finally {
    await rm(paths.root, { recursive: true, force: true });
  }
});

test("broken trips fail with the specific filename or missing image reason", async () => {
  const duplicatePaths = await fixture();
  try {
    await writeTrip(duplicatePaths.sourceRoot, {
      names: ["01-view.jpg", "01-view.png"],
    });
    await assert.rejects(
      prepareGallery(duplicatePaths),
      (error) =>
        error instanceof GalleryValidationError &&
        /duplicate image ID/.test(error.message),
    );
  } finally {
    await rm(duplicatePaths.root, { recursive: true, force: true });
  }

  const coverPaths = await fixture();
  try {
    await writeTrip(coverPaths.sourceRoot, {
      meta: { cover: "missing.jpg" },
    });
    await assert.rejects(
      prepareGallery(coverPaths),
      (error) =>
        error instanceof GalleryValidationError &&
        /cover "missing\.jpg" does not exist/.test(error.message),
    );
  } finally {
    await rm(coverPaths.root, { recursive: true, force: true });
  }

  const unsupportedPaths = await fixture();
  try {
    const directory = await writeTrip(unsupportedPaths.sourceRoot);
    await writeFile(path.join(directory, "02-phone.heic"), "not-an-image");
    await assert.rejects(
      prepareGallery(unsupportedPaths),
      (error) =>
        error instanceof GalleryValidationError &&
        /Convert it to JPEG or AVIF first/.test(error.message),
    );
  } finally {
    await rm(unsupportedPaths.root, { recursive: true, force: true });
  }

  const emptyPaths = await fixture();
  try {
    const directory = await writeTrip(emptyPaths.sourceRoot);
    await rm(path.join(directory, "01-cover.jpg"));
    await assert.rejects(
      prepareGallery(emptyPaths),
      (error) =>
        error instanceof GalleryValidationError &&
        /has metadata but no images/.test(error.message),
    );
  } finally {
    await rm(emptyPaths.root, { recursive: true, force: true });
  }
});
