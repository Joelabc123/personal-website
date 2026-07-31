"use client";

import { useSyncExternalStore } from "react";

export type CookieConsentChoice = "accepted" | "rejected";
export type CookieConsentState = CookieConsentChoice | null | undefined;

const storageKey = "joelbakirel-cookie-consent-v1";
const changeEvent = "joelbakirel-cookie-consent-change";

let memoryChoice: CookieConsentState;

function readStoredChoice(): CookieConsentChoice | null {
  try {
    const value = window.localStorage.getItem(storageKey);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

function getSnapshot(): CookieConsentState {
  if (memoryChoice !== undefined) return memoryChoice;
  return readStoredChoice();
}

function getServerSnapshot(): CookieConsentState {
  return undefined;
}

function subscribe(onStoreChange: () => void): () => void {
  function handleStorage(event: StorageEvent) {
    if (event.key !== storageKey) return;
    memoryChoice = undefined;
    onStoreChange();
  }

  window.addEventListener(changeEvent, onStoreChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(changeEvent, onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

function notify() {
  window.dispatchEvent(new Event(changeEvent));
}

export function setCookieConsent(choice: CookieConsentChoice) {
  memoryChoice = choice;

  try {
    window.localStorage.setItem(storageKey, choice);
  } catch {
    // The in-memory choice still applies for the current page view.
  }

  notify();
}

export function resetCookieConsent() {
  memoryChoice = null;

  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // The in-memory reset still reopens the banner for the current page view.
  }

  notify();
}

export function useCookieConsent(): CookieConsentState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
