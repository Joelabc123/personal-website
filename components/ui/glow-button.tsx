"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Flash {
  id: number;
  x: number;
  y: number;
}

interface GlowButtonFont {
  fontSize?: number | string;
  letterSpacing?: number | string;
  lineHeight?: number | string;
  fontFamily?: string;
  fontWeight?: number;
  fontStyle?: "normal" | "italic";
  textAlign?: "left" | "center" | "right";
}

interface GlowButtonProps {
  label: string;
  targetId: string;
  font?: GlowButtonFont;
  textColor?: string;
  tint?: string;
  borderColor?: string;
  radius?: string;
  padding?: string;
  glowColor?: string;
  flashColor?: string;
  flashOpacity?: number;
  flashDuration?: number;
  glowBlur?: number;
  glowSpread?: number;
  pressScale?: number;
  springStiffness?: number;
  springDamping?: number;
  blurEnabled?: boolean;
  hoverScale?: number;
  hoverGlowOpacity?: number;
  cursorSheenEnabled?: boolean;
  appearance?: "dark" | "light";
}

// Adapted from a Framer code component (originally imported addPropertyControls/
// ControlType/Link/useIsStaticRenderer from "framer"). Framer-only APIs were
// dropped: property controls became plain optional props with defaults, and
// `link` (Framer Link navigation) was replaced with `targetId` + an in-page
// smooth scroll, matching the rest of this site's anchor-button convention.
export default function GlowButton({
  label,
  targetId,
  font = {
    fontSize: "14px",
    letterSpacing: "-0.01em",
    lineHeight: "1em",
    fontWeight: 600,
  },
  textColor = "#FFFFFF",
  tint = "#000000",
  borderColor = "rgba(0,0,0,0.5)",
  radius = "14px",
  padding = "14px 20px",
  glowColor = "rgba(0,0,0,0.5)",
  flashColor = "rgba(0,0,0,0.5)",
  flashOpacity = 0.75,
  flashDuration = 0.45,
  glowBlur = 18,
  glowSpread = 16,
  pressScale = 0.92,
  springStiffness = 540,
  springDamping = 28,
  blurEnabled = false,
  hoverScale = 1.03,
  hoverGlowOpacity = 0.32,
  cursorSheenEnabled = true,
  appearance = "dark",
}: GlowButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const flashIdRef = useRef(0);
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isHoverCapable, setIsHoverCapable] = useState(false);
  const [tapPoint, setTapPoint] = useState({ x: 0.5, y: 0.5 });
  const [flashes, setFlashes] = useState<Flash[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      const hoverMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
      const update = () => {
        startTransition(() => {
          setIsHoverCapable(hoverMedia.matches);
        });
      };
      update();
      if (typeof hoverMedia.addEventListener === "function") {
        hoverMedia.addEventListener("change", update);
        return () => hoverMedia.removeEventListener("change", update);
      }
      hoverMedia.addListener(update);
      return () => hoverMedia.removeListener(update);
    }
    startTransition(() => {
      setIsHoverCapable(false);
    });
  }, []);

  const springTransition = useMemo(
    () => ({
      type: "spring" as const,
      stiffness: springStiffness,
      damping: springDamping,
      mass: 0.8,
    }),
    [springDamping, springStiffness]
  );

  const appearanceTuning = useMemo(() => {
    const isLight = appearance === "light";
    return {
      sheenColor: isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.4)",
      sheenBlendMode: isLight ? ("multiply" as const) : ("screen" as const),
      effectBlendMode: isLight ? ("multiply" as const) : ("screen" as const),
      // Dark buttons keep their own border color on hover instead of turning
      // white — the glow/scale/sheen effects already communicate hover state.
      hoverBorderColor: isLight ? "#000000" : borderColor,
      dropShadowColor: isLight ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.45)",
      insetHighlightColor: isLight ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.12)",
    };
  }, [appearance, borderColor]);

  const capturePointer = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.width > 0 ? (event.clientX - rect.left) / rect.width : 0.5;
    const y = rect.height > 0 ? (event.clientY - rect.top) / rect.height : 0.5;
    return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
  }, []);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      const point = capturePointer(event);
      const id = flashIdRef.current + 1;
      flashIdRef.current = id;
      startTransition(() => {
        setTapPoint(point);
        setIsPressed(true);
        setFlashes((prev) => [...prev, { id, x: point.x, y: point.y }]);
      });
      window.setTimeout(() => {
        startTransition(() => {
          setFlashes((prev) => prev.filter((flash) => flash.id !== id));
        });
      }, Math.max(120, flashDuration * 1000));
    },
    [capturePointer, flashDuration]
  );

  const releasePress = useCallback(() => {
    startTransition(() => {
      setIsPressed(false);
    });
  }, []);

  const handlePointerEnter = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      const canHoverPointer =
        isHoverCapable && (event.pointerType === "mouse" || event.pointerType === "pen");
      if (!canHoverPointer) return;
      startTransition(() => {
        setIsHovered(true);
        setTapPoint(capturePointer(event));
      });
    },
    [capturePointer, isHoverCapable]
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      const canHoverPointer =
        isHoverCapable && (event.pointerType === "mouse" || event.pointerType === "pen");
      if (!canHoverPointer || !cursorSheenEnabled) return;
      const point = capturePointer(event);
      startTransition(() => {
        setTapPoint(point);
      });
    },
    [capturePointer, cursorSheenEnabled, isHoverCapable]
  );

  const handlePointerLeave = useCallback(() => {
    startTransition(() => {
      setIsPressed(false);
      setIsHovered(false);
    });
  }, []);

  const handleClick = useCallback(() => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  }, [targetId]);

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      aria-label={label}
      role="button"
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerUp={releasePress}
      onPointerCancel={releasePress}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "auto",
        height: "auto",
        overflow: "hidden",
        borderRadius: radius,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: tint,
        color: textColor,
        padding,
        cursor: "pointer",
        backdropFilter: blurEnabled ? "blur(16px) saturate(140%)" : "none",
        WebkitBackdropFilter: blurEnabled ? "blur(16px) saturate(140%)" : "none",
        boxShadow: `0 ${Math.max(2, glowSpread / 2)}px ${Math.max(glowBlur, 8)}px ${appearanceTuning.dropShadowColor}, inset 0 1px 0 ${appearanceTuning.insetHighlightColor}`,
        textDecoration: "none",
      }}
      initial={false}
      animate={{
        scale: 1,
        borderColor:
          !isPressed && isHovered && isHoverCapable ? appearanceTuning.hoverBorderColor : borderColor,
      }}
      whileHover={isHoverCapable && !isPressed ? { scale: hoverScale } : undefined}
      whileTap={{ scale: pressScale }}
      transition={springTransition}
    >
      <motion.span
        style={{
          position: "absolute",
          inset: -Math.max(2, glowSpread / 2),
          borderRadius: radius,
          pointerEvents: "none",
          background: glowColor,
          filter: `blur(${glowBlur}px)`,
          zIndex: 0,
        }}
        animate={{
          opacity: isPressed ? 0.9 : isHovered && isHoverCapable ? hoverGlowOpacity : 0,
        }}
        transition={{ duration: isPressed ? 0.12 : isHovered ? 0.28 : 0.45, ease: "easeOut" }}
      />

      <motion.span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          pointerEvents: "none",
          zIndex: 1,
          background: `radial-gradient(circle at ${tapPoint.x * 100}% ${tapPoint.y * 100}%, ${appearanceTuning.sheenColor} 0%, rgba(255,255,255,0) 58%)`,
          mixBlendMode: appearanceTuning.sheenBlendMode,
        }}
        animate={{
          opacity: !isPressed && isHovered && isHoverCapable && cursorSheenEnabled ? 0.24 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      <motion.span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          pointerEvents: "none",
          zIndex: 2,
          background: `radial-gradient(circle at ${tapPoint.x * 100}% ${tapPoint.y * 100}%, ${flashColor} 0%, rgba(255,255,255,0) 55%)`,
          mixBlendMode: appearanceTuning.effectBlendMode,
        }}
        animate={{ opacity: isPressed ? flashOpacity : 0 }}
        transition={{ duration: isPressed ? 0.1 : 0.25, ease: "easeOut" }}
      />

      <AnimatePresence>
        {flashes.map((flash) => (
          <motion.span
            key={flash.id}
            style={{
              position: "absolute",
              left: `${flash.x * 100}%`,
              top: `${flash.y * 100}%`,
              width: 12,
              height: 12,
              borderRadius: "50%",
              pointerEvents: "none",
              background: `radial-gradient(circle, ${flashColor} 0%, rgba(255,255,255,0) 70%)`,
              transform: "translate(-50%, -50%)",
              zIndex: 3,
              mixBlendMode: appearanceTuning.effectBlendMode,
            }}
            initial={{ opacity: flashOpacity, scale: 0 }}
            animate={{ opacity: 0, scale: 10 }}
            exit={{ opacity: 0 }}
            transition={{ duration: flashDuration, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      <span
        style={{
          position: "relative",
          zIndex: 4,
          color: textColor,
          fontSize: font.fontSize,
          letterSpacing: font.letterSpacing,
          lineHeight: font.lineHeight,
          fontFamily: font.fontFamily,
          fontWeight: font.fontWeight,
          fontStyle: font.fontStyle,
          textAlign: font.textAlign,
          whiteSpace: "nowrap",
          minWidth: "max-content",
        }}
      >
        {label}
      </span>
    </motion.button>
  );
}
