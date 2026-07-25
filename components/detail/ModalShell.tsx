"use client";

import { useCallback, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import UtilityDock from "@/components/UtilityDock";

type ModalShellProps = {
  children: React.ReactNode;
  closeLabel: string;
  returnFocusHref: string;
  titleId: string;
};

export default function ModalShell({
  children,
  closeLabel,
  returnFocusHref,
  titleId,
}: ModalShellProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const closeRequested = useRef(false);
  const router = useRouter();

  const closeModal = useCallback(() => {
    if (closeRequested.current) {
      return;
    }

    closeRequested.current = true;

    if (dialogRef.current?.open) {
      dialogRef.current.close();
    }

    router.back();
  }, [router]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    const routeTrigger = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("a[href]"),
    ).find((link) => link.getAttribute("href") === returnFocusHref);

    routeTrigger?.focus({ preventScroll: true });
    previouslyFocusedElement.current =
      routeTrigger ??
      (document.activeElement instanceof HTMLElement &&
      !dialog.contains(document.activeElement)
        ? document.activeElement
        : null);
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const focusCloseButton = () => {
      closeButtonRef.current?.focus({ preventScroll: true });
    };

    dialog.addEventListener("toggle", focusCloseButton);

    if (!dialog.open) {
      dialog.showModal();
    }

    focusCloseButton();
    const focusFrame = requestAnimationFrame(() => {
      requestAnimationFrame(focusCloseButton);
    });
    const focusTimer = window.setTimeout(focusCloseButton, 0);
    const settledFocusTimer = window.setTimeout(focusCloseButton, 100);

    return () => {
      cancelAnimationFrame(focusFrame);
      window.clearTimeout(focusTimer);
      window.clearTimeout(settledFocusTimer);
      dialog.removeEventListener("toggle", focusCloseButton);

      if (dialog.open) {
        dialog.close();
      }

      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;

      const focusTarget = previouslyFocusedElement.current ?? routeTrigger;

      if (focusTarget?.isConnected) {
        const restoreFocus = () => {
          if (focusTarget.isConnected) {
            focusTarget.focus({ preventScroll: true });
          }
        };

        requestAnimationFrame(restoreFocus);
        window.setTimeout(() => {
          const activeElement = document.activeElement;

          if (
            activeElement === document.body ||
            activeElement?.classList.contains("utility-button")
          ) {
            restoreFocus();
          }
        }, 750);
      }
    };
  }, [returnFocusHref]);

  return (
    <dialog
      ref={dialogRef}
      className="detail-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        closeModal();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
      onClose={() => {
        if (!closeRequested.current) {
          closeModal();
        }
      }}
    >
      <article className="detail-surface">
        <div className="detail-surface__topbar">
          <button
            ref={closeButtonRef}
            type="button"
            className="detail-close"
            onClick={closeModal}
            aria-label={closeLabel}
            title={closeLabel}
            autoFocus
          >
            <X aria-hidden="true" />
          </button>
          <div className="detail-dialog__utility">
            <UtilityDock />
          </div>
        </div>
        <div className="detail-surface__content">{children}</div>
      </article>
    </dialog>
  );
}
