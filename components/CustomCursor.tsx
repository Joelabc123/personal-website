"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR = "a, button, [role='button'], input, textarea, select, label";

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const position = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const scale = useRef(1);
  const targetScale = useRef(1);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.documentElement.classList.add("cursor-none");

    const onMove = (event: PointerEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
      const el = event.target as HTMLElement | null;
      targetScale.current = el?.closest(INTERACTIVE_SELECTOR) ? 1.7 : 1;
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    const onLeaveWindow = () => {
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const tick = () => {
      position.current.x += (target.current.x - position.current.x) * 0.18;
      position.current.y += (target.current.y - position.current.y) * 0.18;
      scale.current += (targetScale.current - scale.current) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0) translate(-50%, -50%) scale(${scale.current.toFixed(3)})`;
      }

      frame.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    frame.current = window.requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("cursor-none");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[999] h-8 w-8 rounded-full border border-primary/80 opacity-0 mix-blend-difference transition-opacity duration-200 ease-out"
    />
  );
}
