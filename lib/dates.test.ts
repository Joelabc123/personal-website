import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatDateRange, isFutureYearMonth } from "./dates.ts";

const july2026 = new Date(2026, 6, 24);

describe("CV date formatting", () => {
  it("uses 'ab' for a future open German entry", () => {
    assert.equal(
      formatDateRange(
        "2026-10",
        null,
        "de",
        { present: "Heute", from: "ab" },
        july2026,
      ),
      "ab Oktober 2026",
    );
  });

  it("uses 'from' for a future open English entry", () => {
    assert.equal(
      formatDateRange(
        "2026-10",
        null,
        "en",
        { present: "Present", from: "from" },
        july2026,
      ),
      "from October 2026",
    );
  });

  it("keeps an already-started open entry ongoing", () => {
    const result = formatDateRange(
      "2025-03",
      null,
      "en",
      { present: "Present", from: "from" },
      july2026,
    );

    assert.match(result, /^Mar 2025 – Present$/);
  });

  it("compares year and month without depending on the day", () => {
    assert.equal(isFutureYearMonth("2026-08", july2026), true);
    assert.equal(isFutureYearMonth("2026-07", july2026), false);
  });
});
