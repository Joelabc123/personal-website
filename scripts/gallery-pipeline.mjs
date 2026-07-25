import { createHash } from "node:crypto";
import {
  access,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const HEIF_EXTENSIONS = new Set([".heic", ".heif"]);
const LAYOUTS = new Set(["wide", "tall", "square"]);
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const YEAR_PATTERN = /^\d{4}$/;
const naturalCollator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

export class GalleryValidationError extends Error {
  constructor(message) {
    super(`Gallery validation failed: ${message}`);
    this.name = "GalleryValidationError";
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new GalleryValidationError(message);
  }
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateLocalizedText(value, label) {
  assert(isRecord(value), `${label} must contain "de" and "en" text.`);
  for (const locale of ["de", "en"]) {
    assert(
      typeof value[locale] === "string" && value[locale].trim().length > 0,
      `${label}.${locale} must be a non-empty string.`,
    );
  }
  return { de: value.de.trim(), en: value.en.trim() };
}

function validateMeta(rawMeta, tripLabel) {
  assert(isRecord(rawMeta), `${tripLabel}/_meta.json must contain an object.`);

  const meta = {
    country: validateLocalizedText(rawMeta.country, `${tripLabel}: country`),
    place: validateLocalizedText(rawMeta.place, `${tripLabel}: place`),
  };

  if (rawMeta.date !== undefined) {
    assert(
      typeof rawMeta.date === "string" &&
        /^\d{4}-(0[1-9]|1[0-2])$/.test(rawMeta.date),
      `${tripLabel}: date must use YYYY-MM.`,
    );
    meta.date = rawMeta.date;
  }

  if (rawMeta.cover !== undefined) {
    assert(
      typeof rawMeta.cover === "string" &&
        path.basename(rawMeta.cover) === rawMeta.cover,
      `${tripLabel}: cover must be an image filename from the trip folder.`,
    );
    meta.cover = rawMeta.cover;
  }

  if (rawMeta.order !== undefined) {
    assert(
      Number.isInteger(rawMeta.order),
      `${tripLabel}: order must be an integer.`,
    );
    meta.order = rawMeta.order;
  }

  if (rawMeta.collapsed !== undefined) {
    assert(
      typeof rawMeta.collapsed === "boolean" || rawMeta.collapsed === "auto",
      `${tripLabel}: collapsed must be true, false, or "auto".`,
    );
    meta.collapsed = rawMeta.collapsed;
  }

  for (const field of ["layout", "alt"]) {
    if (rawMeta[field] !== undefined) {
      assert(
        isRecord(rawMeta[field]),
        `${tripLabel}: ${field} must be an object keyed by image filename.`,
      );
    }
  }

  if (rawMeta.layout) {
    meta.layout = {};
    for (const [filename, layout] of Object.entries(rawMeta.layout)) {
      assert(
        path.basename(filename) === filename && LAYOUTS.has(layout),
        `${tripLabel}: layout for "${filename}" must be wide, tall, or square.`,
      );
      meta.layout[filename] = layout;
    }
  }

  if (rawMeta.alt) {
    meta.alt = {};
    for (const [filename, alt] of Object.entries(rawMeta.alt)) {
      assert(
        path.basename(filename) === filename,
        `${tripLabel}: alt keys must be image filenames.`,
      );
      meta.alt[filename] = validateLocalizedText(
        alt,
        `${tripLabel}: alt.${filename}`,
      );
    }
  }

  return meta;
}

async function pathExists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filename, label) {
  let source;
  try {
    source = await readFile(filename, "utf8");
  } catch (error) {
    if (error && error.code === "ENOENT") {
      throw new GalleryValidationError(`${label} is missing _meta.json.`);
    }
    throw error;
  }

  try {
    return JSON.parse(source);
  } catch (error) {
    throw new GalleryValidationError(
      `${label}/_meta.json contains invalid JSON: ${error.message}`,
    );
  }
}

async function listDirectories(folder, label, allowedFiles = new Set()) {
  const entries = await readdir(folder, { withFileTypes: true });
  const directories = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      directories.push(entry.name);
    } else if (!allowedFiles.has(entry.name)) {
      throw new GalleryValidationError(
        `${label} contains unexpected file "${entry.name}".`,
      );
    }
  }

  return directories.sort(naturalCollator.compare);
}

function imageId(year, countrySlug, tripSlug, filename) {
  const stem = path
    .basename(filename, path.extname(filename))
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${year}-${countrySlug}-${tripSlug}-${stem}`;
}

function inferLayout(width, height, index) {
  const ratio = width / height;
  if (ratio >= 1.28) return "wide";
  if (ratio <= 0.78) return "tall";
  return index % 5 === 0 ? "wide" : "square";
}

function defaultAlt(meta, year, index) {
  const number = index + 1;
  return {
    de: `${meta.place.de}, ${meta.country.de}, ${year} – Bild ${number}`,
    en: `${meta.place.en}, ${meta.country.en}, ${year} – image ${number}`,
  };
}

async function scanTrip({
  sourceRoot,
  outputRoot,
  year,
  countrySlug,
  tripSlug,
  seenIds,
}) {
  const tripLabel = `${year}/${countrySlug}/${tripSlug}`;
  const tripDirectory = path.join(sourceRoot, year, countrySlug, tripSlug);
  const rawMeta = await readJson(path.join(tripDirectory, "_meta.json"), tripLabel);
  const meta = validateMeta(rawMeta, tripLabel);
  assert(
    !meta.date || meta.date.startsWith(`${year}-`),
    `${tripLabel}: date year must match its "${year}" folder.`,
  );
  const entries = await readdir(tripDirectory, { withFileTypes: true });
  const images = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      throw new GalleryValidationError(
        `${tripLabel} contains unexpected directory "${entry.name}".`,
      );
    }
    if (entry.name === "_meta.json") continue;

    const extension = path.extname(entry.name).toLowerCase();
    if (HEIF_EXTENSIONS.has(extension)) {
      throw new GalleryValidationError(
        `${tripLabel}/${entry.name} is HEIC/HEIF. Convert it to JPEG or AVIF first.`,
      );
    }
    if (!IMAGE_EXTENSIONS.has(extension)) {
      throw new GalleryValidationError(
        `${tripLabel}/${entry.name} has an unsupported format. Use JPEG, PNG, WebP, or AVIF.`,
      );
    }
    images.push(entry.name);
  }

  images.sort(naturalCollator.compare);
  assert(images.length > 0, `${tripLabel} has metadata but no images.`);

  const imageNames = new Set(images);
  if (meta.cover) {
    assert(
      imageNames.has(meta.cover),
      `${tripLabel}: cover "${meta.cover}" does not exist.`,
    );
  }
  for (const field of ["layout", "alt"]) {
    for (const filename of Object.keys(meta[field] ?? {})) {
      assert(
        imageNames.has(filename),
        `${tripLabel}: ${field} references missing image "${filename}".`,
      );
    }
  }

  const processedImages = [];
  const tripOutput = path.join(outputRoot, year, countrySlug, tripSlug);
  await mkdir(tripOutput, { recursive: true });

  for (const [index, filename] of images.entries()) {
    const id = imageId(year, countrySlug, tripSlug, filename);
    assert(!seenIds.has(id), `duplicate image ID "${id}".`);
    seenIds.add(id);

    const source = path.join(tripDirectory, filename);
    let pipeline;
    let info;
    try {
      pipeline = sharp(source, { failOn: "error" })
        .rotate()
        .resize({
          width: 2400,
          height: 2400,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 84, effort: 5 });
      const result = await pipeline.toBuffer({ resolveWithObject: true });
      info = result.info;
      const hash = createHash("sha256")
        .update(result.data)
        .digest("hex")
        .slice(0, 12);
      const outputFilename = `${id}-${hash}.webp`;
      await writeFile(path.join(tripOutput, outputFilename), result.data);

      processedImages.push({
        id,
        src: `/generated/gallery/${year}/${countrySlug}/${tripSlug}/${outputFilename}`,
        width: info.width,
        height: info.height,
        aspectRatio: Number((info.width / info.height).toFixed(6)),
        alt: meta.alt?.[filename] ?? defaultAlt(meta, Number(year), index),
        layout:
          meta.layout?.[filename] ??
          inferLayout(info.width, info.height, index),
      });
    } catch (error) {
      if (error instanceof GalleryValidationError) throw error;
      throw new GalleryValidationError(
        `${tripLabel}/${filename} could not be processed: ${error.message}`,
      );
    }
  }

  const coverFilename = meta.cover ?? images[0];
  const coverIndex = images.indexOf(coverFilename);
  const collapsed =
    typeof meta.collapsed === "boolean"
      ? meta.collapsed
      : processedImages.length >= 7;

  return {
    year: Number(year),
    countrySlug,
    tripSlug,
    meta: {
      country: meta.country,
      place: meta.place,
      ...(meta.date ? { date: meta.date } : {}),
      ...(meta.cover ? { cover: meta.cover } : {}),
      ...(meta.order !== undefined ? { order: meta.order } : {}),
      collapsed: meta.collapsed ?? "auto",
      ...(meta.layout ? { layout: meta.layout } : {}),
    },
    cover: processedImages[coverIndex],
    images: processedImages,
    collapsed,
  };
}

function sortTrips(trips) {
  return trips.sort((left, right) => {
    if (left.year !== right.year) return right.year - left.year;
    const leftOrder = left.meta.order ?? 0;
    const rightOrder = right.meta.order ?? 0;
    if (leftOrder !== rightOrder) return rightOrder - leftOrder;
    const dateComparison = (right.meta.date ?? "").localeCompare(
      left.meta.date ?? "",
    );
    if (dateComparison !== 0) return dateComparison;
    return naturalCollator.compare(left.meta.place.en, right.meta.place.en);
  });
}

async function writeManifest(manifestPath, trips) {
  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(
    manifestPath,
    `${JSON.stringify({ version: 1, trips }, null, 2)}\n`,
    "utf8",
  );
}

export async function prepareGallery({
  sourceRoot,
  outputRoot,
  manifestPath,
}) {
  const resolvedSource = path.resolve(sourceRoot);
  const resolvedOutput = path.resolve(outputRoot);
  const resolvedManifest = path.resolve(manifestPath);
  const trips = [];

  if (!(await pathExists(resolvedSource))) {
    await rm(resolvedOutput, { recursive: true, force: true });
    await writeManifest(resolvedManifest, trips);
    return { version: 1, trips };
  }

  const years = await listDirectories(
    resolvedSource,
    "content/gallery",
    new Set(["README.md", "_meta.example.json"]),
  );

  for (const year of years) {
    assert(YEAR_PATTERN.test(year), `year folder "${year}" must use four digits.`);
    const countries = await listDirectories(
      path.join(resolvedSource, year),
      year,
    );
    for (const countrySlug of countries) {
      assert(
        SLUG_PATTERN.test(countrySlug),
        `${year}: country slug "${countrySlug}" is invalid.`,
      );
      const tripSlugs = await listDirectories(
        path.join(resolvedSource, year, countrySlug),
        `${year}/${countrySlug}`,
      );
      for (const tripSlug of tripSlugs) {
        assert(
          SLUG_PATTERN.test(tripSlug),
          `${year}/${countrySlug}: trip slug "${tripSlug}" is invalid.`,
        );
      }
    }
  }

  await rm(resolvedOutput, { recursive: true, force: true });
  const seenIds = new Set();

  for (const year of years) {
    const countries = await listDirectories(
      path.join(resolvedSource, year),
      year,
    );
    for (const countrySlug of countries) {
      const tripSlugs = await listDirectories(
        path.join(resolvedSource, year, countrySlug),
        `${year}/${countrySlug}`,
      );
      for (const tripSlug of tripSlugs) {
        trips.push(
          await scanTrip({
            sourceRoot: resolvedSource,
            outputRoot: resolvedOutput,
            year,
            countrySlug,
            tripSlug,
            seenIds,
          }),
        );
      }
    }
  }

  sortTrips(trips);
  await writeManifest(resolvedManifest, trips);
  return { version: 1, trips };
}
