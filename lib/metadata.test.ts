import assert from "node:assert/strict";
import test from "node:test";
import {
  createLocalizedMetadata,
  languageAlternates,
} from "./metadata.ts";
import { publishedProjects } from "./projects.ts";
import { personJsonLd, projectJsonLd } from "./structured-data.ts";

test("localized metadata keeps canonical, hreflang, and OG URLs aligned", () => {
  const metadata = createLocalizedMetadata({
    locale: "en",
    path: "/projects/example",
    title: "Example | Joel Bakirel",
    description: "Example project",
    openGraphImagePath: "/projects",
  });

  assert.equal(
    metadata.alternates?.canonical,
    "https://joelbakirel.de/en/projects/example",
  );
  assert.deepEqual(metadata.alternates?.languages, {
    de: "https://joelbakirel.de/de/projects/example",
    en: "https://joelbakirel.de/en/projects/example",
    "x-default": "https://joelbakirel.de/de/projects/example",
  });

  const images = metadata.openGraph?.images as
    | Array<{ url: string }>
    | undefined;
  assert.equal(
    images?.[0]?.url,
    "https://joelbakirel.de/en/projects/opengraph-image",
  );
});

test("language alternates use German as the default route", () => {
  assert.equal(
    languageAlternates("/cv")["x-default"],
    "https://joelbakirel.de/de/cv",
  );
});

test("structured data is generated from canonical person and project data", () => {
  const person = personJsonLd("de");
  const project = publishedProjects[0]!;
  const creativeWork = projectJsonLd(project, "en");

  assert.equal(person["@type"], "Person");
  assert.equal(person.name, "Joel Bakirel");
  assert.equal(creativeWork["@type"], "CreativeWork");
  assert.equal(
    creativeWork.url,
    `https://joelbakirel.de/en/projects/${project.slug}`,
  );
});
