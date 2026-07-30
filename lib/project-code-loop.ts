export type CodeLoopPhase = "typing" | "holding" | "deleting" | "waiting";

export type CodeLoopState = {
  phase: CodeLoopPhase;
  visibleCharacters: number;
  snippetIndex: number;
};

export const projectCodeSnippets = [
  `const projects = await fetchProjects();

projects.forEach(project => {
  project.status = "ready";
});`,
  `const featured = projects
  .filter(project => project.featured)
  .sort((a, b) => b.year - a.year);`,
  `const cards = featured.map(project => (
  <ProjectCard
    key={project.id}
    project={project}
  />
));`,
  `animate(".project-card", {
  opacity: [0, 1],
  y: [24, 0],
  delay: stagger(0.12)
});`,
  `await portfolio.deploy({
  environment: "production",
  domain: "joel-bakirel.de"
});

console.log("Portfolio is live.");`,
] as const;

export const codeLoopTiming: Readonly<Record<CodeLoopPhase, number>> = {
  typing: 35,
  holding: 2800,
  deleting: 20,
  waiting: 600,
};

export const initialCodeLoopState: CodeLoopState = {
  phase: "typing",
  visibleCharacters: 0,
  snippetIndex: 0,
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
  const currentCode =
    projectCodeSnippets[state.snippetIndex] ?? projectCodeSnippets[0];

  return prefersReducedMotion
    ? currentCode
    : currentCode.slice(0, state.visibleCharacters);
}

export function advanceCodeLoop(
  state: CodeLoopState,
  codeLength: number,
  snippetCount: number,
): CodeLoopState {
  switch (state.phase) {
    case "typing": {
      const visibleCharacters = Math.min(
        codeLength,
        state.visibleCharacters + 1,
      );

      return {
        ...state,
        phase: visibleCharacters === codeLength ? "holding" : "typing",
        visibleCharacters,
      };
    }
    case "holding":
      return { ...state, phase: "deleting", visibleCharacters: codeLength };
    case "deleting": {
      const visibleCharacters = Math.max(0, state.visibleCharacters - 1);

      return {
        ...state,
        phase: visibleCharacters === 0 ? "waiting" : "deleting",
        visibleCharacters,
      };
    }
    case "waiting":
      return {
        ...initialCodeLoopState,
        snippetIndex: (state.snippetIndex + 1) % snippetCount,
      };
  }
}
