export type CodeLoopPhase = "typing" | "holding" | "deleting" | "waiting";

export type CodeLoopState = {
  phase: CodeLoopPhase;
  visibleCharacters: number;
};

export const projectCode = `export default function Portfolio() {
  return <Bento items={[cv, projects, travel]} />;
}`;

export const codeLoopTiming: Readonly<Record<CodeLoopPhase, number>> = {
  typing: 35,
  holding: 2800,
  deleting: 20,
  waiting: 600,
};

export const initialCodeLoopState: CodeLoopState = {
  phase: "typing",
  visibleCharacters: 0,
};

export function shouldAdvanceCodeLoop(
  isVisible: boolean,
  prefersReducedMotion: boolean,
): boolean {
  return isVisible && !prefersReducedMotion;
}

export function getVisibleProjectCode(
  state: CodeLoopState,
  prefersReducedMotion: boolean,
): string {
  return prefersReducedMotion
    ? projectCode
    : projectCode.slice(0, state.visibleCharacters);
}

export function advanceCodeLoop(
  state: CodeLoopState,
  codeLength: number,
): CodeLoopState {
  switch (state.phase) {
    case "typing": {
      const visibleCharacters = Math.min(
        codeLength,
        state.visibleCharacters + 1,
      );

      return {
        phase: visibleCharacters === codeLength ? "holding" : "typing",
        visibleCharacters,
      };
    }
    case "holding":
      return { phase: "deleting", visibleCharacters: codeLength };
    case "deleting": {
      const visibleCharacters = Math.max(0, state.visibleCharacters - 1);

      return {
        phase: visibleCharacters === 0 ? "waiting" : "deleting",
        visibleCharacters,
      };
    }
    case "waiting":
      return initialCodeLoopState;
  }
}
