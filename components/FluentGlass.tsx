"use client";

import {
    type CSSProperties,
    startTransition,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

interface FluentGlassProps {
    baseColor?: string;
    glowColor?: string;
    midColor?: string;
    angle?: number;
    ribCount?: number;
    ribIntensity?: number;
    glowStrength?: number;
    scrollBrighten?: boolean;
    scrollRange?: number;
    maxGlowBoost?: number;
    sheenIntensity?: number;
    grainOpacity?: number;
    style?: CSSProperties;
}

export default function FluentGlass({
    baseColor = "#0d1117",
    glowColor = "#8dd6ff",
    midColor = "#151a22",
    angle = 135,
    ribCount = 44,
    ribIntensity = 0.5,
    glowStrength = 0.6,
    scrollBrighten = true,
    scrollRange = 800,
    maxGlowBoost = 0.35,
    sheenIntensity = 0.35,
    grainOpacity = 0.04,
    style,
}: FluentGlassProps) {
    const safeRibCount = useMemo(() => Math.max(1, ribCount), [ribCount]);
    const ribWidth = useMemo(() => `${100 / safeRibCount}%`, [safeRibCount]);
    const clampedRibIntensity = useMemo(
        () => Math.max(0, Math.min(1, ribIntensity)),
        [ribIntensity]
    );
    const clampedGlowStrength = useMemo(
        () => Math.max(0, Math.min(1, glowStrength)),
        [glowStrength]
    );
    const clampedMaxGlowBoost = useMemo(
        () => Math.max(0, Math.min(1, maxGlowBoost)),
        [maxGlowBoost]
    );
    const clampedSheenIntensity = useMemo(
        () => Math.max(0, Math.min(1, sheenIntensity)),
        [sheenIntensity]
    );
    const clampedGrainOpacity = useMemo(
        () => Math.max(0, Math.min(0.1, grainOpacity)),
        [grainOpacity]
    );
    const safeScrollRange = useMemo(() => Math.max(1, scrollRange), [scrollRange]);
    const [scrollProgress, setScrollProgress] = useState(0);
    const targetProgressRef = useRef(0);
    const currentProgressRef = useRef(0);
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        if (!scrollBrighten) {
            targetProgressRef.current = 0;
            currentProgressRef.current = 0;
            if (frameRef.current !== null && typeof window !== "undefined") {
                window.cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
            startTransition(() => setScrollProgress(0));
            return;
        }

        if (typeof window === "undefined") return;

        const tick = () => {
            const current = currentProgressRef.current;
            const target = targetProgressRef.current;
            const next = current + (target - current) * 0.12;

            if (Math.abs(next - current) < 0.0005 && Math.abs(target - next) < 0.0005) {
                currentProgressRef.current = target;
                startTransition(() => setScrollProgress(target));
                frameRef.current = null;
                return;
            }

            currentProgressRef.current = next;
            startTransition(() => setScrollProgress(next));
            frameRef.current = window.requestAnimationFrame(tick);
        };

        const onScroll = () => {
            const raw = window.scrollY / safeScrollRange;
            targetProgressRef.current = Math.max(0, Math.min(1, raw));

            if (frameRef.current === null) {
                frameRef.current = window.requestAnimationFrame(tick);
            }
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
            if (frameRef.current !== null) {
                window.cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
        };
    }, [scrollBrighten, safeScrollRange]);

    const effectiveGlowStrength = useMemo(() => {
        const boosted =
            clampedGlowStrength + (scrollBrighten ? scrollProgress : 0) * clampedMaxGlowBoost;
        return Math.max(0, Math.min(1, boosted));
    }, [clampedGlowStrength, scrollBrighten, scrollProgress, clampedMaxGlowBoost]);
    const darkLift = useMemo(
        () =>
            (scrollBrighten ? scrollProgress : 0) * Math.min(0.28, clampedMaxGlowBoost * 0.55),
        [scrollBrighten, scrollProgress, clampedMaxGlowBoost]
    );

    const glowLayer = useMemo(
        () =>
            `linear-gradient(${angle}deg, ${baseColor} 0%, #151a22 50%, rgba(21, 26, 34, ${Math.max(
                0.5,
                effectiveGlowStrength * 0.95
            ).toFixed(3)}) 62%, #24292f 71%, ${midColor} 80%, ${glowColor} 96%, ${glowColor} 100%)`,
        [angle, baseColor, midColor, glowColor, effectiveGlowStrength]
    );

    const tintLayer = useMemo(
        () =>
            `linear-gradient(${angle}deg, rgba(13, 17, 23, 0.5) 0%, rgba(13, 17, 23, 0.42) 48%, rgba(21, 26, 34, ${(
                0.22 * effectiveGlowStrength
            ).toFixed(3)}) 64%, rgba(145, 152, 161, ${(0.3 * effectiveGlowStrength).toFixed(
                3
            )}) 82%, rgba(141, 214, 255, ${(0.32 * effectiveGlowStrength).toFixed(3)}) 100%)`,
        [angle, effectiveGlowStrength]
    );

    const ribMask = useMemo(
        () =>
            `linear-gradient(${angle}deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 54%, rgba(0, 0, 0, 0.2) 62%, rgba(0, 0, 0, 0.85) 78%, rgba(0, 0, 0, 1) 100%)`,
        [angle]
    );

    const ribLayer = useMemo(() => {
        const bright = (0.18 * clampedRibIntensity).toFixed(3);
        const soft = (0.08 * clampedRibIntensity).toFixed(3);
        const dark = (0.12 * clampedRibIntensity).toFixed(3);
        const spec = (0.28 * clampedRibIntensity).toFixed(3);

        return `repeating-linear-gradient(
            90deg,
            rgba(255, 255, 255, ${bright}) 0%,
            rgba(255, 255, 255, ${spec}) 6%,
            rgba(255, 255, 255, ${soft}) 24%,
            rgba(255, 255, 255, 0) 44%,
            rgba(0, 0, 0, ${dark}) 58%,
            rgba(255, 255, 255, ${soft}) 74%,
            rgba(255, 255, 255, ${bright}) 100%
        )`;
    }, [clampedRibIntensity]);

    const ribSpecularLayer = useMemo(() => {
        const spec = (0.24 * clampedRibIntensity).toFixed(3);
        const falloff = (0.08 * clampedRibIntensity).toFixed(3);
        return `repeating-linear-gradient(
            90deg,
            rgba(255, 255, 255, ${spec}) 0%,
            rgba(255, 255, 255, ${falloff}) 7%,
            rgba(255, 255, 255, 0) 13%,
            rgba(255, 255, 255, 0) 100%
        )`;
    }, [clampedRibIntensity]);

    const darkeningLayer = useMemo(
        () =>
            `linear-gradient(${angle}deg, rgba(13, 17, 23, ${Math.max(0.5, 0.78 - darkLift).toFixed(
                3
            )}) 0%, rgba(13, 17, 23, ${Math.max(0.42, 0.68 - darkLift * 0.95).toFixed(
                3
            )}) 30%, rgba(13, 17, 23, ${Math.max(0.34, 0.58 - darkLift * 0.9).toFixed(
                3
            )}) 55%, rgba(13, 17, 23, ${Math.max(0.12, 0.32 - darkLift * 0.7).toFixed(
                3
            )}) 72%, rgba(13, 17, 23, ${Math.max(0, 0.05 - darkLift * 0.4).toFixed(3)}) 100%)`,
        [angle, darkLift]
    );

    const darkDepthLayer = useMemo(
        () =>
            `radial-gradient(circle at 24% 12%, rgba(1, 4, 9, 0.16) 0%, rgba(1, 4, 9, 0.07) 24%, rgba(1, 4, 9, 0) 56%)`,
        []
    );

    const sheenLayer = useMemo(
        () =>
            `linear-gradient(${angle}deg, rgba(255,255,255,0) 22%, rgba(255,255,255, ${(
                0.07 * clampedSheenIntensity
            ).toFixed(3)}) 47%, rgba(255,255,255, ${(0.13 * clampedSheenIntensity).toFixed(
                3
            )}) 56%, rgba(255,255,255, ${(0.05 * clampedSheenIntensity).toFixed(
                3
            )}) 64%, rgba(255,255,255,0) 80%)`,
        [angle, clampedSheenIntensity]
    );

    const vignetteLayer = useMemo(
        () =>
            `radial-gradient(ellipse at center, rgba(0,0,0,0) 56%, rgba(0,0,0,0.06) 78%, rgba(0,0,0,0.14) 100%)`,
        []
    );

    const grainDataUri = useMemo(
        () =>
            `url("data:image/svg+xml,${encodeURIComponent(
                "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='1'/></svg>"
            )}")`,
        []
    );

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: -10,
                overflow: "hidden",
                pointerEvents: "none",
                backgroundColor: baseColor,
                ...style,
            }}
            aria-hidden={true}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `${glowLayer}, ${tintLayer}`,
                    backgroundColor: baseColor,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: darkDepthLayer,
                    mixBlendMode: "screen",
                    opacity: 0.9,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: ribLayer,
                    backgroundSize: `${ribWidth} 100%`,
                    backgroundRepeat: "repeat",
                    mixBlendMode: "overlay",
                    opacity: 0.55 + clampedRibIntensity * 0.25,
                    filter: `blur(${(0.45 + clampedRibIntensity * 0.35).toFixed(2)}px)`,
                    maskImage: ribMask,
                    WebkitMaskImage: ribMask,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: ribSpecularLayer,
                    backgroundSize: `${ribWidth} 100%`,
                    backgroundRepeat: "repeat",
                    mixBlendMode: "screen",
                    opacity: 0.12 + clampedRibIntensity * 0.24,
                    maskImage: ribMask,
                    WebkitMaskImage: ribMask,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: ribLayer,
                    backgroundSize: `${ribWidth} 100%`,
                    backgroundRepeat: "repeat",
                    mixBlendMode: "soft-light",
                    opacity: 0.4 + clampedRibIntensity * 0.3,
                    maskImage: ribMask,
                    WebkitMaskImage: ribMask,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: darkeningLayer,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: sheenLayer,
                    mixBlendMode: "screen",
                    opacity: 0.55,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(circle at 100% 85%, ${glowColor} 0%, ${midColor} 34%, rgba(145,152,161,0.18) 48%, rgba(145,152,161,0) 55%)`,
                    opacity: 0.08 + effectiveGlowStrength * 0.32,
                    mixBlendMode: "screen",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: vignetteLayer,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: grainDataUri,
                    backgroundSize: "180px 180px",
                    backgroundRepeat: "repeat",
                    opacity: clampedGrainOpacity,
                    mixBlendMode: "overlay",
                }}
            />
        </div>
    );
}
