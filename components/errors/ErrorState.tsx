import type { ReactNode } from "react";
import styles from "./ErrorState.module.css";

type ErrorStateProps = {
  actions: ReactNode;
  announce?: boolean;
  code: "404" | "500";
  description: string;
  eyebrow: string;
  headingId?: string;
  status: string;
  title: string;
};

export default function ErrorState({
  actions,
  announce = false,
  code,
  description,
  eyebrow,
  headingId = "error-page-title",
  status,
  title,
}: ErrorStateProps) {
  return (
    <main className={styles.page}>
      <section
        className={styles.surface}
        aria-labelledby={headingId}
        role={announce ? "alert" : undefined}
      >
        <div className={`${styles.card} ${styles.copyCard}`}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDot} data-code={code} />
            {eyebrow}
          </p>

          <div className={styles.copy}>
            <h1 id={headingId}>{title}</h1>
            <p>{description}</p>
            <div className={styles.actions}>{actions}</div>
          </div>
        </div>

        <div
          className={`${styles.card} ${styles.codeCard}`}
          data-code={code}
          aria-hidden="true"
        >
          <div className={styles.orbit}>
            <span className={styles.orbitInner} />
            <strong>{code}</strong>
          </div>

          <p className={styles.status}>
            <span />
            {status}
          </p>
        </div>
      </section>
    </main>
  );
}

export { styles as errorStateStyles };
