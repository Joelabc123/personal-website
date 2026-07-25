"use client";

import { useEffect, useRef, useState } from "react";
import {
  advanceCodeLoop,
  codeLoopTiming,
  getVisibleProjectCode,
  initialCodeLoopState,
  projectCode,
  shouldAdvanceCodeLoop,
  type CodeLoopState,
} from "@/lib/project-code-loop";
import styles from "./ProjectCodeLoop.module.css";

export default function ProjectCodeLoop({ label }: { label: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CodeLoopState>(initialCodeLoopState);
  const [isVisible, setIsVisible] = useState(true);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const updateVisibility = () => setIsDocumentVisible(!document.hidden);

    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);

    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );

    observer.observe(root);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (
      !shouldAdvanceCodeLoop(
        isVisible && isDocumentVisible,
        prefersReducedMotion,
      )
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      setState((current) => advanceCodeLoop(current, projectCode.length));
    }, codeLoopTiming[state.phase]);

    return () => window.clearTimeout(timer);
  }, [
    isDocumentVisible,
    isVisible,
    prefersReducedMotion,
    state.phase,
    state.visibleCharacters,
  ]);

  const visibleCode = getVisibleProjectCode(state, prefersReducedMotion);

  return (
    <div
      ref={rootRef}
      className={styles.loop}
      data-phase={prefersReducedMotion ? "static" : state.phase}
      data-paused={!isVisible || !isDocumentVisible ? "true" : undefined}
    >
      <span className={styles.srOnly}>{label}</span>
      <div className={styles.windowBar} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <pre aria-hidden="true">
        <code>{visibleCode}</code>
        {!prefersReducedMotion ? (
          <span className={styles.cursor} aria-hidden="true" />
        ) : null}
      </pre>
    </div>
  );
}
