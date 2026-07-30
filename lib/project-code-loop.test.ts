import assert from "node:assert/strict";
import test from "node:test";
import {
  advanceCodeLoop,
  codeLoopTiming,
  getVisibleProjectCode,
  initialCodeLoopState,
  projectCodeSnippets,
  shouldAdvanceCodeLoop,
} from "./project-code-loop.ts";

test("runs through every phase before advancing to the next snippet", () => {
  const firstCharacter = advanceCodeLoop(initialCodeLoopState, 2, 5);
  const holding = advanceCodeLoop(firstCharacter, 2, 5);
  const deleting = advanceCodeLoop(holding, 2, 5);
  const waiting = advanceCodeLoop(
    advanceCodeLoop(deleting, 2, 5),
    2,
    5,
  );
  const nextSnippet = advanceCodeLoop(waiting, 2, 5);

  assert.deepEqual(firstCharacter, {
    phase: "typing",
    visibleCharacters: 1,
    snippetIndex: 0,
  });
  assert.deepEqual(holding, {
    phase: "holding",
    visibleCharacters: 2,
    snippetIndex: 0,
  });
  assert.deepEqual(deleting, {
    phase: "deleting",
    visibleCharacters: 2,
    snippetIndex: 0,
  });
  assert.deepEqual(waiting, {
    phase: "waiting",
    visibleCharacters: 0,
    snippetIndex: 0,
  });
  assert.deepEqual(nextSnippet, {
    ...initialCodeLoopState,
    snippetIndex: 1,
  });
});

test("wraps from the final snippet back to the first", () => {
  const finalWaitingState = {
    phase: "waiting" as const,
    visibleCharacters: 0,
    snippetIndex: projectCodeSnippets.length - 1,
  };

  assert.deepEqual(
    advanceCodeLoop(finalWaitingState, 0, projectCodeSnippets.length),
    initialCodeLoopState,
  );
});

test("uses the specified timing for every phase", () => {
  assert.deepEqual(codeLoopTiming, {
    typing: 35,
    holding: 2800,
    deleting: 20,
    waiting: 600,
  });
});

test("pauses while outside the viewport", () => {
  assert.equal(shouldAdvanceCodeLoop(false, false), false);
  assert.equal(shouldAdvanceCodeLoop(true, false), true);
});

test("uses the finished code and disables advancement for reduced motion", () => {
  const secondSnippetState = {
    ...initialCodeLoopState,
    snippetIndex: 1,
  };

  assert.equal(shouldAdvanceCodeLoop(true, true), false);
  assert.equal(
    getVisibleProjectCode(secondSnippetState, true),
    projectCodeSnippets[1],
  );
});

test("contains the five portfolio snippets in their requested order", () => {
  assert.equal(projectCodeSnippets.length, 5);
  assert.match(projectCodeSnippets[0], /^const projects = await fetchProjects/);
  assert.match(projectCodeSnippets[1], /^const featured = projects/);
  assert.match(projectCodeSnippets[2], /^const cards = featured\.map/);
  assert.match(projectCodeSnippets[3], /^animate\("\.project-card"/);
  assert.match(projectCodeSnippets[4], /Portfolio is live\."\);$/);
});
