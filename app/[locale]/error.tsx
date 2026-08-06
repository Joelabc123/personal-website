"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect } from "react";
import ErrorState, {
  errorStateStyles as styles,
} from "@/components/errors/ErrorState";
import {
  errorCopy,
  resolveErrorLocale,
} from "@/components/errors/errorCopy";
import { Link } from "@/i18n/navigation";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const locale = resolveErrorLocale(useLocale());
  const copy = errorCopy[locale].internal;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      announce
      code="500"
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      status={copy.status}
      actions={
        <>
          <button
            type="button"
            className={`${styles.action} ${styles.primaryAction}`}
            onClick={() => unstable_retry()}
          >
            <RotateCcw aria-hidden="true" />
            {copy.retry}
          </button>
          <Link
            href="/"
            className={`${styles.action} ${styles.secondaryAction}`}
          >
            <ArrowLeft aria-hidden="true" />
            {copy.home}
          </Link>
        </>
      }
    />
  );
}
