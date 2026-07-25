"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import styles from "./CvBentoLink.module.css";

type MarqueeLogo = {
  id: string;
  src: string;
  alt: string;
};

type CvBentoLinkProps = {
  className: string;
  description: string;
  eyebrow: string;
  logos: readonly MarqueeLogo[];
  title: string;
};

const BASE_SPEED = 52;
const HOVER_SPEED = 18;
const INITIAL_GROUP_COUNT = 4;

export default function CvBentoLink({
  className,
  description,
  eyebrow,
  logos,
  title,
}: CvBentoLinkProps) {
  const locale = useLocale();
  const rootRef = useRef<HTMLAnchorElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(BASE_SPEED);
  const targetSpeedRef = useRef(BASE_SPEED);
  const [groupCount, setGroupCount] = useState(INITIAL_GROUP_COUNT);

  useEffect(() => {
    const marquee = marqueeRef.current;
    const track = trackRef.current;
    const group = groupRef.current;
    const root = rootRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!root || !marquee || !track || !group || reducedMotion.matches) {
      return;
    }

    let frame = 0;
    let lastTime = performance.now();
    let offset = 0;
    let groupWidth = group.getBoundingClientRect().width;
    let isCardVisible = true;

    const updateMeasurements = () => {
      groupWidth = group.getBoundingClientRect().width;
      offset = groupWidth > 0 ? offset % groupWidth : 0;

      if (groupWidth > 0) {
        const marqueeWidth = marquee.getBoundingClientRect().width;
        const requiredGroupCount = Math.max(
          2,
          Math.ceil(marqueeWidth / groupWidth) + 1,
        );

        setGroupCount((currentCount) =>
          currentCount === requiredGroupCount
            ? currentCount
            : requiredGroupCount,
        );
      }
    };

    const resizeObserver = new ResizeObserver(updateMeasurements);

    const animate = (time: number) => {
      const delta = Math.min(time - lastTime, 64);
      lastTime = time;
      const easing = 1 - Math.exp(-delta / 260);

      speedRef.current +=
        (targetSpeedRef.current - speedRef.current) * easing;

      if (groupWidth > 0) {
        offset = (offset + (speedRef.current * delta) / 1000) % groupWidth;
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }

      frame = requestAnimationFrame(animate);
    };

    const stop = () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const start = () => {
      if (!frame && isCardVisible && !document.hidden) {
        lastTime = performance.now();
        frame = requestAnimationFrame(animate);
      }
    };

    const updateRunningState = () => {
      if (isCardVisible && !document.hidden) {
        start();
      } else {
        stop();
      }
    };

    const intersectionObserver =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => {
              isCardVisible = entry.isIntersecting;
              updateRunningState();
            },
            { threshold: 0.05 },
          )
        : null;

    resizeObserver.observe(group);
    resizeObserver.observe(marquee);
    updateMeasurements();
    intersectionObserver?.observe(root);
    document.addEventListener("visibilitychange", updateRunningState);
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
      document.removeEventListener("visibilitychange", updateRunningState);
      track.style.transform = "";
    };
  }, []);

  const slowMarquee = () => {
    targetSpeedRef.current = HOVER_SPEED;
  };

  const resetMarqueeSpeed = () => {
    targetSpeedRef.current = BASE_SPEED;
  };

  const renderLogoGroup = (groupIndex: number) => {
    const clone = groupIndex > 0;

    return (
      <div
        ref={clone ? undefined : groupRef}
        className={`${styles.logoGroup} ${clone ? styles.clone : ""}`}
        aria-hidden={clone || undefined}
        key={`logo-group-${groupIndex}`}
      >
        {logos.map((logo) => (
          <span className={styles.logoTile} key={`${groupIndex}-${logo.id}`}>
            <Image
              src={logo.src}
              alt={clone ? "" : logo.alt}
              width={108}
              height={108}
              sizes="(min-width: 1200px) 108px, 84px"
              className={styles.logo}
            />
          </span>
        ))}
      </div>
    );
  };

  return (
    <a
      ref={rootRef}
      href={`/${locale}/cv`}
      className={`${className} ${styles.root}`}
      onMouseEnter={slowMarquee}
      onMouseLeave={resetMarqueeSpeed}
      onFocus={slowMarquee}
      onBlur={resetMarqueeSpeed}
    >
      <div className={styles.defaultContent}>
        <div className={styles.topline}>
          <span>{eyebrow}</span>
          <ArrowUpRight aria-hidden="true" />
        </div>

        <div ref={marqueeRef} className={styles.marquee}>
          <div ref={trackRef} className={styles.track}>
            {Array.from({ length: groupCount }, (_, groupIndex) =>
              renderLogoGroup(groupIndex),
            )}
          </div>
        </div>

        <div className={styles.copy}>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    </a>
  );
}
