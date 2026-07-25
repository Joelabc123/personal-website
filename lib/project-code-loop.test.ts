import assert from "node:assert/strict";
import test from "node:test";
import {
  advanceCodeLoop,
  codeLoopTiming,
  getVisibleProjectCode,
  initialCodeLoopState,
  projectCode,
  shouldAdvanceCodeLoop,
} from "./project-code-loop.ts";

test("runs through typing, holding, deleting, and waiting", () => {
  const firstCharacter = advanceCodeLoop(initialCodeLoopState, 2);
  const holding = advanceCodeLoop(firstCharacter, 2);
  const deleting = advanceCodeLoop(holding, 2);
  const waiting = advanceCodeLoop(
    advanceCodeLoop(deleting, 2),
    2,
  );
  const restarted = advanceCodeLoop(waiting, 2);

  assert.deepEqual(firstCharacter, {
    phase: "typing",
    visibleCharacters: 1,
  });
  assert.deepEqual(holding, { phase: "holding", visibleCharacters: 2 });
  assert.deepEqual(deleting, { phase: "deleting", visibleCharacters: 2 });
  assert.deepEqual(waiting, { phase: "waiting", visibleCharacters: 0 });
  assert.deepEqual(restarted, initialCodeLoopState);
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
  assert.equal(shouldAdvanceCodeLoop(true, true), false);
  assert.equal(getVisibleProjectCode(initialCodeLoopState, true), projectCode);
});
