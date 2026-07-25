"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import type { GalleryLayout } from "@/lib/gallery-types";
import styles from "./TravelContent.module.css";

export type LightboxImage = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  layout: GalleryLayout;
};

type GalleryLightboxProps = {
  images: readonly LightboxImage[];
  labels: {
    gallery: string;
    openImage: string;
    close: string;
    previous: string;
    next: string;
    position: string;
  };
};

export default function GalleryLightbox({
  images,
  labels,
}: GalleryLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const pointerStartX = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  function close() {
    dialogRef.current?.close();
  }

  function previous() {
    setActiveIndex((index) =>
      index === null ? null : (index - 1 + images.length) % images.length,
    );
  }

  function next() {
    setActiveIndex((index) =>
      index === null ? null : (index + 1) % images.length,
    );
  }

  useEffect(() => {
    if (activeIndex !== null && !dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, [activeIndex]);

  function open(index: number, opener: HTMLButtonElement) {
    openerRef.current = opener;
    setActiveIndex(index);
  }

  function handlePointerDown(event: PointerEvent<HTMLDialogElement>) {
    pointerStartX.current = event.clientX;
  }

  function handlePointerUp(event: PointerEvent<HTMLDialogElement>) {
    if (pointerStartX.current === null) return;
    const distance = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(distance) < 48) return;
    if (distance > 0) previous();
    else next();
  }

  const activeImage =
    activeIndex === null ? undefined : images[activeIndex];

  return (
    <>
      <div className={styles.galleryGrid} aria-label={labels.gallery}>
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            className={`${styles.galleryButton} ${styles[image.layout]}`}
            onClick={(event) => open(index, event.currentTarget)}
            aria-label={labels.openImage.replace(
              "%index%",
              String(index + 1),
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 420px"
            />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        aria-label={labels.gallery}
        onClose={() => {
          setActiveIndex(null);
          openerRef.current?.focus({ preventScroll: true });
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            previous();
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            next();
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {activeImage && activeIndex !== null ? (
          <div className={styles.lightboxInner}>
            <button
              type="button"
              className={`${styles.lightboxControl} ${styles.lightboxClose}`}
              onClick={close}
              aria-label={labels.close}
              autoFocus
            >
              <X aria-hidden="true" />
            </button>

            <Image
              className={styles.lightboxImage}
              src={activeImage.src}
              alt={activeImage.alt}
              width={activeImage.width}
              height={activeImage.height}
              sizes="100vw"
              draggable={false}
            />

            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  className={`${styles.lightboxControl} ${styles.lightboxPrevious}`}
                  onClick={previous}
                  aria-label={labels.previous}
                >
                  <ChevronLeft aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={`${styles.lightboxControl} ${styles.lightboxNext}`}
                  onClick={next}
                  aria-label={labels.next}
                >
                  <ChevronRight aria-hidden="true" />
                </button>
              </>
            ) : null}

            <p className={styles.lightboxPosition} aria-live="polite">
              {labels.position
                .replace("%current%", String(activeIndex + 1))
                .replace("%total%", String(images.length))}
            </p>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
