import assert from "node:assert/strict";
import test from "node:test";
import {
  createLocalizedMetadata,
  languageAlternates,
} from "./metadata.ts";
import { publishedProjects } from "./projects.ts";
import {
  contactPageJsonLd,
  personJsonLd,
  profilePageJsonLd,
  projectJsonLd,
  projectsPageJsonLd,
} from "./structured-data.ts";

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

test("page-specific structured data references the same canonical person", () => {
  const profile = profilePageJsonLd({
    locale: "de",
    name: "Joel Bakirel | Portfolio",
    description: "Portfolio von Joel Bakirel",
  });
  const contact = contactPageJsonLd({
    locale: "en",
    path: "/contact",
    name: "Contact | Joel Bakirel",
    description: "Get in touch with Joel Bakirel",
  });
  const profileGraph = profile["@graph"] as Record<string, unknown>[];
  const contactGraph = contact["@graph"] as Record<string, unknown>[];
  const person = profileGraph.find((node) => node["@type"] === "Person");

  assert.deepEqual(person?.sameAs, [
    "https://github.com/Joelabc123",
    "https://www.linkedin.com/in/joel-bakirel-93bb13292/",
  ]);
  assert.equal(
    profileGraph.find((node) => node["@type"] === "ProfilePage")?.url,
    "https://joelbakirel.de/de",
  );
  assert.equal(
    contactGraph.find((node) => node["@type"] === "ContactPage")?.url,
    "https://joelbakirel.de/en/contact",
  );
});

test("the project overview exposes its projects as an ItemList", () => {
  const data = projectsPageJsonLd(
    {
      locale: "en",
      path: "/projects",
      name: "Projects | Joel Bakirel",
      description: "Selected software projects by Joel Bakirel",
    },
    publishedProjects,
  );
  const graph = data["@graph"] as Record<string, unknown>[];
  const itemList = graph.find((node) => node["@type"] === "ItemList");

  assert.equal(itemList?.numberOfItems, publishedProjects.length);
  assert.equal(
    graph.filter((node) => node["@type"] === "CreativeWork").length,
    publishedProjects.length,
  );
});
