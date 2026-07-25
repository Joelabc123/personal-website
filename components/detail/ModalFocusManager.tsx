"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

const focusStorageKey = "portfolio-modal-focus";

export default function ModalFocusManager() {
  const pathname = usePathname();

  useEffect(() => {
    let storedValue: string | null;

    try {
      storedValue = sessionStorage.getItem(focusStorageKey);
    } catch {
      return;
    }

    if (!storedValue) {
      return;
    }

    let focusState: { href?: string; returnPath?: string };

    try {
      focusState = JSON.parse(storedValue);
    } catch {
      try {
        sessionStorage.removeItem(focusStorageKey);
      } catch {
        // Storage access is optional.
      }
      return;
    }

    if (
      !focusState.href ||
      focusState.returnPath !== window.location.pathname ||
      document.querySelector(".detail-dialog")
    ) {
      return;
    }

    const restoreFocus = () => {
      const trigger = Array.from(
        document.querySelectorAll<HTMLAnchorElement>("a[href]"),
      ).find((link) => link.getAttribute("href") === focusState.href);

      if (!trigger) {
        return;
      }

      trigger.focus({ preventScroll: true });

      try {
        sessionStorage.removeItem(focusStorageKey);
      } catch {
        // Storage access is optional.
      }
    };

    const focusFrame = requestAnimationFrame(() => {
      requestAnimationFrame(restoreFocus);
    });
    const focusTimer = window.setTimeout(restoreFocus, 150);

    return () => {
      cancelAnimationFrame(focusFrame);
      window.clearTimeout(focusTimer);
    };
  }, [pathname]);

  return null;
}
