import assert from "node:assert/strict";
import test from "node:test";
import {
  getProjectBySlug,
  getPublishedProjectBySlug,
  projects,
  publishedProjects,
} from "./projects.ts";

test("finds a published project by its stable slug", () => {
  const project = getPublishedProjectBySlug("property-management-platform");

  assert.equal(project?.featured, true);
  assert.equal(project?.status, "published");
});

test("keeps coming-soon projects in the overview without publishing a detail", () => {
  const project = getProjectBySlug("finance-management-platform");

  assert.equal(project?.status, "coming-soon");
  assert.equal(
    getPublishedProjectBySlug("finance-management-platform"),
    undefined,
  );
});

test("returns undefined for an unknown project slug", () => {
  assert.equal(getProjectBySlug("does-not-exist"), undefined);
});

test("exposes four published details and five overview projects", () => {
  assert.equal(publishedProjects.length, 4);
  assert.equal(projects.length, 5);
});
