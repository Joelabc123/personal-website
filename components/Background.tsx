"use client";

import {
    startTransition,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useInView } from "framer-motion";

interface BackgroundProps {
    particleColor?: string;
    backgroundColor?: string;
    gridDensity?: number;
    animationSpeed?: number;
    heroIntensity?: number;
    bottomIntensity?: number;
    heroFadeEnd?: number;
    bottomFadeStart?: number;
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

function parseColorToRgb(color: string): [number, number, number] {
    if (typeof window === "undefined" || typeof document === "undefined")
        return [1, 1, 1];
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return [1, 1, 1];
    ctx.fillStyle = color;
    const normalized = ctx.fillStyle;
    // Chrome normalizes opaque colors back to "#rrggbb" hex (not "rgb(...)"),
    // so hex needs to be parsed explicitly instead of relying on a digit regex.
    const hexMatch = normalized.match(/^#([0-9a-f]{6})$/i);
    if (hexMatch) {
        const intVal = parseInt(hexMatch[1], 16);
        const r = ((intVal >> 16) & 255) / 255;
        const g = ((intVal >> 8) & 255) / 255;
        const b = (intVal & 255) / 255;
        return [clamp(r, 0, 1), clamp(g, 0, 1), clamp(b, 0, 1)];
    }
    const match = normalized.match(/[\d.]+/g);
    if (!match || match.length < 3) return [1, 1, 1];
    const r = Number(match[0]) / 255;
    const g = Number(match[1]) / 255;
    const b = Number(match[2]) / 255;
    return [clamp(r, 0, 1), clamp(g, 0, 1), clamp(b, 0, 1)];
}

export default function Background({
    particleColor = "#ffffff",
    backgroundColor = "#000000",
    gridDensity = 120,
    animationSpeed = 1,
    heroIntensity = 1,
    bottomIntensity = 1,
    heroFadeEnd = 0.2,
    bottomFadeStart = 0.8,
}: BackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number>(0);
    const programRef = useRef<WebGLProgram | null>(null);
    const visibleRef = useRef<boolean>(true);
    const tabVisibleRef = useRef<boolean>(true);
    const scrollProgressRef = useRef<number>(0);
    const [webglReady, setWebglReady] = useState<boolean>(true);
    const inView = useInView(canvasRef, { amount: 0.001 });

    const particleRgb = useMemo(() => parseColorToRgb(particleColor), [particleColor]);
    const backgroundRgb = useMemo(
        () => parseColorToRgb(backgroundColor),
        [backgroundColor]
    );
    const safeHeroFadeEnd = useMemo(() => clamp(heroFadeEnd, 0.01, 0.95), [heroFadeEnd]);
    const safeBottomFadeStart = useMemo(
        () => clamp(bottomFadeStart, safeHeroFadeEnd + 0.01, 0.99),
        [bottomFadeStart, safeHeroFadeEnd]
    );

    const updateScrollProgress = useCallback(() => {
        if (typeof window === "undefined" || typeof document === "undefined") return;
        const doc = document.documentElement;
        const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
        scrollProgressRef.current = clamp(window.scrollY / maxScroll, 0, 1);
    }, []);

    useEffect(() => {
        if (typeof document === "undefined") return;
        const onVisibility = () => {
            tabVisibleRef.current = !document.hidden;
        };
        document.addEventListener("visibilitychange", onVisibility);
        return () => document.removeEventListener("visibilitychange", onVisibility);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        let pending = false;
        const onScroll = () => {
            if (pending) return;
            pending = true;
            window.requestAnimationFrame(() => {
                updateScrollProgress();
                pending = false;
            });
        };
        updateScrollProgress();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [updateScrollProgress]);

    useEffect(() => {
        visibleRef.current = inView;
    }, [inView]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (typeof window === "undefined") return;

        const vertexShaderSource = `
            attribute vec2 aPosition;
            varying vec2 vUv;
            void main() {
                vUv = aPosition * 0.5 + 0.5;
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }
        `;
        const fragmentShaderSource = `
            precision highp float;
            varying vec2 vUv;
            uniform vec2 uResolution;
            uniform float uTime;
            uniform float uScroll;
            uniform vec3 uParticleColor;
            uniform vec3 uBackgroundColor;
            uniform float uGridDensity;
            uniform float uAnimationSpeed;
            uniform float uHeroIntensity;
            uniform float uBottomIntensity;
            uniform float uHeroFadeEnd;
            uniform float uBottomFadeStart;

            float hash(vec2 p) {
                p = fract(p * vec2(123.34, 456.21));
                p += dot(p, p + 34.45);
                return fract(p.x * p.y);
            }

            float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                float a = hash(i);
                float b = hash(i + vec2(1.0, 0.0));
                float c = hash(i + vec2(0.0, 1.0));
                float d = hash(i + vec2(1.0, 1.0));
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
            }

            float fbm(vec2 p) {
                float value = 0.0;
                float amp = 0.5;
                for (int i = 0; i < 5; i++) {
                    value += amp * noise(p);
                    p *= 2.0;
                    amp *= 0.5;
                }
                return value;
            }

            float dotGrid(vec2 uv, float n, float radius, float softness) {
                vec2 p = fract(uv * n) - 0.5;
                float d = length(p);
                return smoothstep(radius + softness, radius, d);
            }

            void main() {
                vec2 uv = vUv;
                vec2 centered = uv - 0.5;
                centered.x *= uResolution.x / max(uResolution.y, 1.0);
                float t = uTime * uAnimationSpeed;

                float heroZone = (1.0 - smoothstep(uHeroFadeEnd * 0.5, uHeroFadeEnd, uScroll)) * uHeroIntensity;
                float bottomReveal = smoothstep(uBottomFadeStart, min(1.0, uBottomFadeStart + 0.2), uScroll);
                float bottomZone = bottomReveal * uBottomIntensity;

                float nHero = fbm(centered * 2.6 + vec2(0.0, t * 0.18));
                float cloudMask = smoothstep(0.92, 0.18, length(centered * vec2(1.15, 1.4) + vec2(0.0, 0.08)));
                float heroPattern = smoothstep(0.28, 0.78, nHero) * cloudMask;
                float heroDots = dotGrid(uv + vec2(nHero * 0.03, -nHero * 0.02), uGridDensity, 0.20 + nHero * 0.14, 0.10);
                float hero = heroPattern * heroDots * (0.52 + 0.85 * nHero) * heroZone;

                float x = abs(uv.x - 0.5);
                float yFromBottom = 1.0 - uv.y;
                float plumeWidth = mix(0.015, 0.07, yFromBottom);
                float column = smoothstep(plumeWidth + 0.04, plumeWidth, x);
                float plumeNoise = fbm(vec2((uv.x - 0.5) * 9.0, yFromBottom * 5.0 - t * 0.55));
                float glitch = step(0.86, hash(vec2(floor(uv.y * 150.0), floor(t * 30.0)))) * 0.35;
                float plumeCore = column * smoothstep(0.22, 0.96, plumeNoise + glitch) * smoothstep(0.0, 0.06, yFromBottom);

                // 4-pointed sparkle/star: union (min) of two elongated
                // diamonds — one stretched vertically (tall top/bottom
                // points), one stretched horizontally (shorter left/right
                // points) — gives the concave waist of a real star shape
                // instead of a plain rhombus. Slightly bigger reach + a
                // narrower smoothstep band than before for a larger, more
                // clearly-defined (less blurry) star.
                vec2 starUv = centered - vec2(0.0, -0.10);
                float starVertical = abs(starUv.x) * 3.6 + abs(starUv.y) * 0.95;
                float starHorizontal = abs(starUv.x) * 1.3 + abs(starUv.y) * 2.4;
                float starField = min(starVertical, starHorizontal);
                float star = smoothstep(0.33, 0.17, starField) * smoothstep(0.0, 0.22, yFromBottom);

                // Contain the whole plume+star shape so it spreads wide
                // rather than stretching all the way up above the footer.
                // The allowed height grows in step with scroll progress
                // (not just opacity) so the shape's leading edge never
                // outpaces how far the footer has actually scrolled into
                // view — otherwise it would poke up over the footer's top
                // edge into the Contact section while still transitioning in.
                float maxReach = mix(0.04, 0.68, bottomReveal);
                float verticalContain = 1.0 - smoothstep(maxReach - 0.14, maxReach, uv.y);

                float bottomDots = dotGrid(uv + vec2(plumeNoise * 0.025, 0.0), uGridDensity * 1.1, 0.19, 0.09);
                float bottom = (plumeCore * 0.55 + star * 1.5) * bottomDots * bottomZone * verticalContain;

                float intensity = clamp(hero + bottom, 0.0, 1.0);
                float alpha = mix(0.24, 0.95, intensity) * step(0.001, intensity);
                vec3 color = mix(uBackgroundColor, uParticleColor, intensity);

                gl_FragColor = vec4(color, alpha + (1.0 - alpha) * 0.0);
            }
        `;

        const gl =
            canvas.getContext("webgl", {
                alpha: false,
                antialias: false,
                preserveDrawingBuffer: true,
            }) ||
            canvas.getContext("experimental-webgl", {
                alpha: false,
                antialias: false,
                preserveDrawingBuffer: true,
            });
        if (!gl) {
            startTransition(() => setWebglReady(false));
            return;
        }
        const glContext = gl as WebGLRenderingContext;
        const compileShader = (type: number, source: string): WebGLShader | null => {
            const shader = glContext.createShader(type);
            if (!shader) return null;
            glContext.shaderSource(shader, source);
            glContext.compileShader(shader);
            if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
                glContext.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertexShader = compileShader(glContext.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = compileShader(glContext.FRAGMENT_SHADER, fragmentShaderSource);
        if (!vertexShader || !fragmentShader) {
            startTransition(() => setWebglReady(false));
            return;
        }

        const program = glContext.createProgram();
        if (!program) {
            startTransition(() => setWebglReady(false));
            return;
        }
        glContext.attachShader(program, vertexShader);
        glContext.attachShader(program, fragmentShader);
        glContext.linkProgram(program);
        if (!glContext.getProgramParameter(program, glContext.LINK_STATUS)) {
            startTransition(() => setWebglReady(false));
            return;
        }
        programRef.current = program;

        const buffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, buffer);
        glContext.bufferData(
            glContext.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
            glContext.STATIC_DRAW
        );

        const positionLocation = glContext.getAttribLocation(program, "aPosition");
        const uResolution = glContext.getUniformLocation(program, "uResolution");
        const uTime = glContext.getUniformLocation(program, "uTime");
        const uScroll = glContext.getUniformLocation(program, "uScroll");
        const uParticleColor = glContext.getUniformLocation(program, "uParticleColor");
        const uBackgroundColor = glContext.getUniformLocation(program, "uBackgroundColor");
        const uGridDensity = glContext.getUniformLocation(program, "uGridDensity");
        const uAnimationSpeed = glContext.getUniformLocation(program, "uAnimationSpeed");
        const uHeroIntensity = glContext.getUniformLocation(program, "uHeroIntensity");
        const uBottomIntensity = glContext.getUniformLocation(program, "uBottomIntensity");
        const uHeroFadeEnd = glContext.getUniformLocation(program, "uHeroFadeEnd");
        const uBottomFadeStart = glContext.getUniformLocation(program, "uBottomFadeStart");

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
            const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }
            glContext.viewport(0, 0, canvas.width, canvas.height);
        };

        const startTime = performance.now();
        let hasDrawnFirstFrame = false;
        const render = () => {
            rafRef.current = window.requestAnimationFrame(render);
            if (hasDrawnFirstFrame && (!visibleRef.current || !tabVisibleRef.current)) return;
            resize();
            glContext.clearColor(backgroundRgb[0], backgroundRgb[1], backgroundRgb[2], 1);
            glContext.clear(glContext.COLOR_BUFFER_BIT);
            glContext.useProgram(program);
            glContext.bindBuffer(glContext.ARRAY_BUFFER, buffer);
            glContext.enableVertexAttribArray(positionLocation);
            glContext.vertexAttribPointer(positionLocation, 2, glContext.FLOAT, false, 0, 0);
            glContext.uniform2f(uResolution, canvas.width, canvas.height);
            glContext.uniform1f(uTime, (performance.now() - startTime) * 0.001);
            glContext.uniform1f(uScroll, scrollProgressRef.current);
            glContext.uniform3f(uParticleColor, particleRgb[0], particleRgb[1], particleRgb[2]);
            glContext.uniform3f(
                uBackgroundColor,
                backgroundRgb[0],
                backgroundRgb[1],
                backgroundRgb[2]
            );
            glContext.uniform1f(uGridDensity, clamp(gridDensity, 30, 240));
            glContext.uniform1f(uAnimationSpeed, clamp(animationSpeed, 0.05, 4));
            glContext.uniform1f(uHeroIntensity, clamp(heroIntensity, 0, 1));
            glContext.uniform1f(uBottomIntensity, clamp(bottomIntensity, 0, 1));
            glContext.uniform1f(uHeroFadeEnd, safeHeroFadeEnd);
            glContext.uniform1f(uBottomFadeStart, safeBottomFadeStart);
            glContext.drawArrays(glContext.TRIANGLE_STRIP, 0, 4);
            hasDrawnFirstFrame = true;
        };

        render();
        const onResize = () => resize();
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
            window.cancelAnimationFrame(rafRef.current);
            if (programRef.current) glContext.deleteProgram(programRef.current);
            if (vertexShader) glContext.deleteShader(vertexShader);
            if (fragmentShader) glContext.deleteShader(fragmentShader);
            if (buffer) glContext.deleteBuffer(buffer);
        };
    }, [
        animationSpeed,
        backgroundRgb,
        bottomIntensity,
        gridDensity,
        heroIntensity,
        particleRgb,
        safeBottomFadeStart,
        safeHeroFadeEnd,
    ]);

    if (!webglReady) {
        return (
            <div
                aria-hidden="true"
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: -10,
                    pointerEvents: "none",
                    backgroundColor,
                }}
            />
        );
    }

    return (
        <div
            aria-hidden="true"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: -10,
                pointerEvents: "none",
                overflow: "hidden",
                backgroundColor,
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    position: "fixed",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    display: "block",
                    backgroundColor,
                }}
            />
        </div>
    );
}
