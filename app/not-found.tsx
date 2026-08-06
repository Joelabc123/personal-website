import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import ErrorState, {
  errorStateStyles as styles,
} from "@/components/errors/ErrorState";
import { errorCopy } from "@/components/errors/errorCopy";

export default function RootNotFound() {
  const germanCopy = errorCopy.de.notFound;
  const englishCopy = errorCopy.en.notFound;

  return (
    <>
      <title>404 | Joel Bakirel</title>
      <script
        dangerouslySetInnerHTML={{
          __html:
            'document.documentElement.lang=location.pathname.split("/")[1]==="en"?"en":"de"',
        }}
      />

      <div className={styles.languageDe}>
        <ErrorState
          code="404"
          eyebrow={germanCopy.eyebrow}
          headingId="root-404-de-title"
          title={germanCopy.title}
          description={germanCopy.description}
          status={germanCopy.status}
          actions={
            <>
              <Link
                href="/de"
                className={`${styles.action} ${styles.primaryAction}`}
              >
                <ArrowLeft aria-hidden="true" />
                {germanCopy.home}
              </Link>
              <Link
                href="/de/projects"
                className={`${styles.action} ${styles.secondaryAction}`}
              >
                {germanCopy.projects}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </>
          }
        />
      </div>

      <div className={styles.languageEn}>
        <ErrorState
          code="404"
          eyebrow={englishCopy.eyebrow}
          headingId="root-404-en-title"
          title={englishCopy.title}
          description={englishCopy.description}
          status={englishCopy.status}
          actions={
            <>
              <Link
                href="/en"
                className={`${styles.action} ${styles.primaryAction}`}
              >
                <ArrowLeft aria-hidden="true" />
                {englishCopy.home}
              </Link>
              <Link
                href="/en/projects"
                className={`${styles.action} ${styles.secondaryAction}`}
              >
                {englishCopy.projects}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </>
          }
        />
      </div>
    </>
  );
}
