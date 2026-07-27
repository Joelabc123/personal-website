"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const AUTO_ROTATE_SPEED = 0.28;
const HOVER_ROTATE_SPEED = 0.12;

// COBE's MIT-licensed world mask, originally based on the borderless
// Wikimedia world map. Keeping the tiny mask local avoids an extra request.
const LAND_MASK =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAACAAQAAAADMzoqnAAAECklEQVR42u3VsW4jRRzH8d94gzfF4Q0VQaC4vBLTRTp0mze4ggfAPAE5XQEFsGNAVIjwBrmW7h7gJE+giKjyABTZE4g06LKJETdRJvtD65kdz6yduKABiW+TVfzRf2bXYxtcE/59YJCz6YdbgQF6ACSRrwYKYImmh5PbwOewlV3wlQNbAN6SEExjUOO+BU0aCSnxReHABUlK4YFQeJeUT3da8IIkZ6NGoSnFY5KsMoVzMKfECUnqxgPYRArarmUCndHwzIEaQEpg5xVdBXROl8mpAQx5dUgPiHoYAAkg5w3JABR06byGAVgcRGAz5bznj6phBQNRFwyqgdxebH6gshJAesWoFhgYpApAFoG8BIZ/fEhSox5jDjQXmV0Ar5XJfAIrALi3URVs09gHIL4XJCkLC5LH9JWiArABFCSrQjdgkBzRJ0WJeUOSNyQAfJJwUSWUBRlJQ8oGHATACGlBynnzy2kEYLNjrxouigD8BZcgOeVPqh12RtufaCN5wCPVDpvQ9lsIrqndsJtDcWqBCpf4hWN7OdWHBw58FwIaNOU/n1TpMW2DFaD48cmr4185T8NHkpUFX749pQPVdgRKC/DGoQPVeAEKv+WHvY8OOWNTPRp5kHuwSf8wzXtVBKR7YwEH9H3lQUaypUfSATOALyVNu5vZJW31Bnx98nkLfDUWJaz6ixvm+RIQRdl3kmRxxiaDoGnZW4CpPfkaQadlcPim1xOSvETQo7Lv75enVAXJ3xGUlony4KQBBWUM1NiDc6qhyS8RgQs18OCMMtPDaAUIyg0PZkRWDqs+wnKJBTDI1Js6BolegOsKmUxNDBAAKqQyMQmidhegBlLZ+wwKYdv5M/8x1khkb1cgKqP2H+MKyV5vS+whrE8DQDgAlUAoRBX056EElJCjJVACeJBZgNfVp+iCCm4RBWCgKsRxASSA9KgDhDtCiTuMyfHsKXzhC6wNAIjjWb8LKAOA2ctk3FmCOlgKFy8f1N0JJtgsxinYnVAHt4t3gPzZXSCTyCWCQmBT91QE3B5yarSN40dNHYPka4TlDhTUI8zLvl0JSL3vZn6DsCFZOeB2yROEpR68sECQQA++xIGCR2X7DwlEoLRgUrZrqlUg50S1uy43YqDcN6UFBVkhAjWiCV2Q0jgQPdplMKxvBXodcOfAwJYvgdL+1etA1YJJfBcZlQV7sO1i2gHoNiyxtQ5sBsCgWyoxCHiFFd2L5nUTCqMAqGUgsQ9f5kCcCiZgRYkMgMTd5WsB1rTzj0Em14BE4r+QxN1lCEsVur2PoF5Wbg8RJXR4djgvBgauhLywoEZQrt1KKRdVS4CdlJ8qafyP+9KIj/nE/d7kKwH9jgS72e9DV+kvfTWgct4ZyP8Byb8BPG7MaaIIkAQAAAAASUVORK5CYII=";

const VERTEX_SHADER = `
  attribute vec2 position;
  varying vec2 uv;

  void main() {
    uv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  varying vec2 uv;
  uniform vec2 resolution;
  uniform float phi;
  uniform float theta;
  uniform sampler2D landMask;

  const float PI = 3.14159265359;
  const float RADIUS = 0.79;

  vec3 rotateX(vec3 point, float angle) {
    float sine = sin(angle);
    float cosine = cos(angle);

    return vec3(
      point.x,
      cosine * point.y - sine * point.z,
      sine * point.y + cosine * point.z
    );
  }

  vec3 rotateY(vec3 point, float angle) {
    float sine = sin(angle);
    float cosine = cos(angle);

    return vec3(
      cosine * point.x + sine * point.z,
      point.y,
      -sine * point.x + cosine * point.z
    );
  }

  float terrainNoise(vec3 point) {
    float broad = sin(point.x * 7.0 + point.y * 6.0 - point.z * 4.0);
    float detail = sin(point.z * 13.0 - point.x * 9.0 + point.y * 7.0);

    return clamp(0.5 + broad * 0.18 + detail * 0.1, 0.0, 1.0);
  }

  float sampleLand(vec2 coordinates) {
    return texture2D(landMask, coordinates).r;
  }

  void main() {
    vec2 point = uv * 2.0 - 1.0;
    point.x *= resolution.x / resolution.y;

    float distanceFromCenter = length(point);
    float pixel = 2.0 / resolution.y;
    vec3 atmosphere = vec3(0.35, 0.72, 0.94);

    if (distanceFromCenter > RADIUS) {
      float halo = 1.0 - smoothstep(RADIUS, RADIUS + 0.085, distanceFromCenter);

      if (halo <= 0.0) {
        discard;
      }

      gl_FragColor = vec4(atmosphere * (0.34 + halo * 0.2), halo * 0.26);
      return;
    }

    float sphereDepth = sqrt(max(RADIUS * RADIUS - dot(point, point), 0.0));
    vec3 normal = normalize(vec3(point, sphereDepth));
    vec3 world = rotateY(rotateX(normal, -theta), phi);

    float longitude = atan(world.x, world.z);
    float latitude = asin(clamp(world.y, -1.0, 1.0));
    vec2 mapUv = vec2(
      fract(0.5 + longitude / (2.0 * PI)),
      clamp(0.5 - latitude / PI, 0.0, 1.0)
    );

    vec2 texel = vec2(1.0 / 256.0, 1.0 / 128.0);
    float mask = sampleLand(mapUv);
    float north = sampleLand(mapUv + vec2(0.0, -texel.y));
    float south = sampleLand(mapUv + vec2(0.0, texel.y));
    float east = sampleLand(mapUv + vec2(texel.x, 0.0));
    float west = sampleLand(mapUv - vec2(texel.x, 0.0));
    float nearestOcean = min(min(north, south), min(east, west));
    float nearestLand = max(max(north, south), max(east, west));
    float land = smoothstep(0.34, 0.66, mask);
    float coast = land * smoothstep(0.05, 0.75, mask - nearestOcean);
    float shallowWater =
      (1.0 - land) * smoothstep(0.05, 0.75, nearestLand - mask);

    float terrain = terrainNoise(world);
    float absoluteLatitude = abs(latitude);

    vec3 forest = vec3(0.12, 0.28, 0.105);
    vec3 grass = vec3(0.38, 0.48, 0.205);
    vec3 dryLand = vec3(0.67, 0.52, 0.29);
    vec3 rock = vec3(0.42, 0.35, 0.255);
    vec3 sand = vec3(0.76, 0.65, 0.40);
    vec3 ice = vec3(0.88, 0.94, 0.95);

    vec3 landColor = mix(forest, grass, terrain);
    float dryLatitude =
      smoothstep(0.20, 0.38, absoluteLatitude) *
      (1.0 - smoothstep(0.65, 0.84, absoluteLatitude));
    float aridity = dryLatitude * smoothstep(0.43, 0.78, terrain);
    landColor = mix(landColor, dryLand, aridity * 0.88);
    landColor = mix(
      landColor,
      rock,
      smoothstep(0.84, 0.98, terrain) * (1.0 - aridity * 0.6)
    );
    landColor = mix(landColor, sand, coast * 0.48);
    landColor = mix(
      landColor,
      ice,
      smoothstep(1.04, 1.31, absoluteLatitude)
    );

    vec3 deepOcean = vec3(0.018, 0.19, 0.36);
    vec3 blueOcean = vec3(0.025, 0.38, 0.59);
    vec3 coastalOcean = vec3(0.08, 0.53, 0.65);
    vec3 oceanColor = mix(deepOcean, blueOcean, 0.48);
    oceanColor = mix(oceanColor, coastalOcean, shallowWater * 0.66);

    vec3 surface = mix(oceanColor, landColor, land);

    vec3 lightDirection = normalize(vec3(-0.52, 0.64, 0.78));
    float diffuseLight = max(dot(normal, lightDirection), 0.0);
    float illumination = 0.30 + diffuseLight * 0.76;
    vec3 color = surface * illumination;

    vec3 viewDirection = vec3(0.0, 0.0, 1.0);
    vec3 halfDirection = normalize(lightDirection + viewDirection);
    float oceanHighlight =
      pow(max(dot(normal, halfDirection), 0.0), 44.0) *
      (1.0 - land) *
      0.48;
    color += vec3(0.62, 0.83, 0.94) * oceanHighlight;

    float rim = pow(1.0 - max(normal.z, 0.0), 2.7);
    color += atmosphere * rim * (0.12 + diffuseLight * 0.20);

    float edge = 1.0 - smoothstep(
      RADIUS - pixel,
      RADIUS + pixel,
      distanceFromCenter
    );

    gl_FragColor = vec4(color, edge);
  }
`;

type EarthRenderer = {
  destroy: () => void;
  render: (phi: number, theta: number) => void;
  resize: () => void;
};

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

  if (!vertexShader || !fragmentShader) {
    if (vertexShader) gl.deleteShader(vertexShader);
    if (fragmentShader) gl.deleteShader(fragmentShader);
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function createEarthRenderer(canvas: HTMLCanvasElement): EarthRenderer | null {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
  });
  if (!gl) return null;

  const program = createProgram(gl);
  if (!program) return null;

  const positionLocation = gl.getAttribLocation(program, "position");
  const resolutionLocation = gl.getUniformLocation(program, "resolution");
  const phiLocation = gl.getUniformLocation(program, "phi");
  const thetaLocation = gl.getUniformLocation(program, "theta");
  const landMaskLocation = gl.getUniformLocation(program, "landMask");
  const buffer = gl.createBuffer();
  const texture = gl.createTexture();

  if (
    positionLocation < 0 ||
    !resolutionLocation ||
    !phiLocation ||
    !thetaLocation ||
    !landMaskLocation ||
    !buffer ||
    !texture
  ) {
    if (buffer) gl.deleteBuffer(buffer);
    if (texture) gl.deleteTexture(texture);
    gl.deleteProgram(program);
    return null;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]),
    gl.STATIC_DRAW,
  );

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 0, 255]),
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  let destroyed = false;
  let lastPhi = 0;
  let lastTheta = 0;

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(bounds.width * pixelRatio));
    const height = Math.max(1, Math.round(bounds.height * pixelRatio));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    gl.viewport(0, 0, width, height);
  };

  const render = (nextPhi: number, nextTheta: number) => {
    if (destroyed) return;

    lastPhi = nextPhi;
    lastTheta = nextTheta;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(landMaskLocation, 0);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(phiLocation, nextPhi);
    gl.uniform1f(thetaLocation, nextTheta);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const image = new Image();
  image.onload = () => {
    if (destroyed) return;

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      image,
    );
    render(lastPhi, lastTheta);
  };
  image.src = LAND_MASK;

  return {
    destroy: () => {
      destroyed = true;
      image.onload = null;
      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
    },
    render,
    resize,
  };
}

type EarthGlobeProps = {
  className?: string;
  slowOnHover?: boolean;
  theta?: number;
};

export default function EarthGlobe({
  className,
  slowOnHover = false,
  theta = 0.25,
}: EarthGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = createEarthRenderer(canvas);
    if (!renderer) return;

    let phi = 0;
    let animationFrame: number | null = null;
    let previousTime: number | null = null;
    let currentSpeed = AUTO_ROTATE_SPEED;
    let targetSpeed = AUTO_ROTATE_SPEED;
    let reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const draw = () => {
      renderer.resize();
      renderer.render(phi, theta);
    };

    const animate = (time: number) => {
      animationFrame = null;
      const elapsed =
        previousTime === null ? 0 : Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      const easing = 1 - Math.exp(-elapsed * 5);
      currentSpeed += (targetSpeed - currentSpeed) * easing;
      phi += currentSpeed * elapsed;
      renderer.render(phi, theta);

      if (!reducedMotion) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    const startAnimation = () => {
      if (animationFrame !== null || reducedMotion) return;
      previousTime = null;
      animationFrame = window.requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      previousTime = null;
      draw();
    };

    const hoverTarget = slowOnHover ? canvas.closest<HTMLElement>("a") : null;
    const slowRotation = () => {
      targetSpeed = HOVER_ROTATE_SPEED;
    };
    const restoreRotation = () => {
      targetSpeed = AUTO_ROTATE_SPEED;
    };

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const handleMotionPreference = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;

      if (reducedMotion) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    const resizeObserver = new ResizeObserver(draw);

    draw();
    startAnimation();
    resizeObserver.observe(canvas);
    hoverTarget?.addEventListener("pointerenter", slowRotation);
    hoverTarget?.addEventListener("pointerleave", restoreRotation);
    motionPreference.addEventListener("change", handleMotionPreference);

    return () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
      resizeObserver.disconnect();
      hoverTarget?.removeEventListener("pointerenter", slowRotation);
      hoverTarget?.removeEventListener("pointerleave", restoreRotation);
      motionPreference.removeEventListener("change", handleMotionPreference);
      renderer.destroy();
    };
  }, [slowOnHover, theta]);

  return (
    <div
      className={cn(
        "mx-auto flex w-full items-center justify-center",
        className,
      )}
      style={{ overflow: "hidden" }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          width: "100%",
          height: "100%",
          aspectRatio: "1",
          display: "block",
        }}
      />
    </div>
  );
}
