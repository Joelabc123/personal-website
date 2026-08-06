"use client";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useLocale } from "next-intl";
import ErrorState, {
  errorStateStyles as styles,
} from "@/components/errors/ErrorState";
import {
  errorCopy,
  resolveErrorLocale,
} from "@/components/errors/errorCopy";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const locale = resolveErrorLocale(useLocale());
  const copy = errorCopy[locale].notFound;

  return (
    <ErrorState
      code="404"
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      status={copy.status}
      actions={
        <>
          <Link
            href="/"
            className={`${styles.action} ${styles.primaryAction}`}
          >
            <ArrowLeft aria-hidden="true" />
            {copy.home}
          </Link>
          <Link
            href="/projects"
            className={`${styles.action} ${styles.secondaryAction}`}
          >
            {copy.projects}
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </>
      }
    />
  );
}
