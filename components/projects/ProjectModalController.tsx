"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { X } from "lucide-react";

type ProjectModalContextValue = {
  activeSlug: string | null;
  closeProject: () => void;
  openProject: (slug: string) => void;
};

const ProjectModalContext = createContext<ProjectModalContextValue | null>(
  null,
);

function useProjectModal() {
  const context = useContext(ProjectModalContext);

  if (!context) {
    throw new Error(
      "Project modal components must be rendered inside ProjectModalController.",
    );
  }

  return context;
}

export function ProjectModalController({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const openProject = useCallback((slug: string) => {
    setActiveSlug(slug);
  }, []);

  const closeProject = useCallback(() => {
    setActiveSlug(null);
  }, []);

  const contextValue = useMemo(
    () => ({ activeSlug, closeProject, openProject }),
    [activeSlug, closeProject, openProject],
  );

  return (
    <ProjectModalContext.Provider value={contextValue}>
      {children}
    </ProjectModalContext.Provider>
  );
}

export function ProjectModalLink({
  children,
  className,
  href,
  slug,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
  slug: string;
}) {
  const { openProject } = useProjectModal();

  return (
    <a
      href={href}
      className={className}
      aria-haspopup="dialog"
      onClick={(event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        event.preventDefault();
        openProject(slug);
      }}
    >
      {children}
    </a>
  );
}

export function ProjectModalEntry({
  children,
  closeLabel,
  returnFocusHref,
  slug,
  titleId,
}: {
  children: React.ReactNode;
  closeLabel: string;
  returnFocusHref: string;
  slug: string;
  titleId: string;
}) {
  const { activeSlug, closeProject } = useProjectModal();

  if (activeSlug !== slug) {
    return null;
  }

  return (
    <ProjectInlineModal
      closeLabel={closeLabel}
      onRequestClose={closeProject}
      returnFocusHref={returnFocusHref}
      titleId={titleId}
    >
      {children}
    </ProjectInlineModal>
  );
}

function ProjectInlineModal({
  children,
  closeLabel,
  onRequestClose,
  returnFocusHref,
  titleId,
}: {
  children: React.ReactNode;
  closeLabel: string;
  onRequestClose: () => void;
  returnFocusHref: string;
  titleId: string;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const routeTrigger = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("a[href]"),
    ).find((link) => link.getAttribute("href") === returnFocusHref);
    const previousFocus =
      routeTrigger ??
      (document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null);
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeButtonRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onRequestClose();
        return;
      }

      if (event.key !== "Tab" || !overlay) {
        return;
      }

      const focusableElements = Array.from(
        overlay.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusableElements[0];
      const last = focusableElements.at(-1);

      if (!first || !last) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;

      if (previousFocus?.isConnected) {
        requestAnimationFrame(() => {
          previousFocus.focus({ preventScroll: true });
        });
      }
    };
  }, [onRequestClose, returnFocusHref]);

  return (
    <div
      ref={overlayRef}
      className="detail-dialog project-inline-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          event.preventDefault();
          onRequestClose();
        }
      }}
    >
      <article className="detail-surface">
        <div className="detail-surface__topbar">
          <button
            ref={closeButtonRef}
            type="button"
            className="detail-close"
            onClick={onRequestClose}
            aria-label={closeLabel}
            title={closeLabel}
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="detail-surface__content">{children}</div>
      </article>
    </div>
  );
}
