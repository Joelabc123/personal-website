import Image from "next/image";
import { ArrowDownToLine } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import {
  education,
  experience,
  languages,
  localize,
  type CvEntry,
  type Locale,
} from "@/lib/cv";
import {
  formatDateRange,
  formatMonthYear,
  type DateRangeLabels,
} from "@/lib/dates";
import styles from "./CvContent.module.css";

type CvViewProps = {
  locale: Locale;
  labels: {
    title: string;
    eyebrow: string;
    experience: string;
    education: string;
    languages: string;
    present: string;
    from: string;
    pdf: string;
  };
  variant: "detail" | "print";
};

function Logo({ entry }: { entry: CvEntry }) {
  const scale =
    entry.id === "tum-information-systems"
      ? entry.logo.scale
      : entry.logo.scale
        ? entry.logo.scale * 1.15
        : 1.4;

  return (
    <span className={styles.logoTile}>
      <Image
        src={entry.logo.src}
        alt={entry.logo.alt}
        width={96}
        height={72}
        sizes="96px"
        className={styles.logo}
        style={scale ? { transform: `scale(${scale})` } : undefined}
      />
    </span>
  );
}

function EntryCard({
  entry,
  labels,
  locale,
}: {
  entry: CvEntry;
  labels: DateRangeLabels;
  locale: Locale;
}) {
  const bullets = entry.bullets ? localize(entry.bullets, locale) : [];
  const date =
    entry.id === "tum-information-systems"
      ? `${formatMonthYear(entry.from, locale)} – ${
          locale === "de" ? "Jetzt" : "Current"
        }`
      : formatDateRange(entry.from, entry.to, locale, labels);

  return (
    <article className={styles.entry}>
      <div className={styles.entryCard}>
        <div className={styles.entryHeader}>
          <Logo entry={entry} />
          <div className={styles.entryIdentity}>
            <h3>{entry.organization}</h3>
            <p>{localize(entry.role, locale)}</p>
            {entry.location ? (
              <span>{localize(entry.location, locale)}</span>
            ) : null}
          </div>
          <time className={styles.date}>{date}</time>
        </div>
        {bullets.length > 0 ? (
          <ul className={styles.bullets}>
            {bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

function CvView({ locale, labels, variant }: CvViewProps) {
  const dateLabels = { present: labels.present, from: labels.from };

  return (
    <div
      className={`${styles.cv} ${
        variant === "print" ? styles.printDocument : styles.detailDocument
      }`}
    >
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>{labels.eyebrow}</p>
          <h1 id="detail-title-cv">{labels.title}</h1>
        </div>
        {variant === "detail" ? (
          <div className={styles.actions}>
            <a
              className={styles.primaryAction}
              href="/Lebenslaufneu.pdf"
              download="Lebenslauf-Joel-Bakirel.pdf"
            >
              <ArrowDownToLine aria-hidden="true" />
              {labels.pdf}
            </a>
          </div>
        ) : null}
      </header>

      <section className={styles.section} aria-labelledby="cv-experience">
        <div className={styles.sectionHeading}>
          <span>01</span>
          <h2 id="cv-experience">{labels.experience}</h2>
        </div>
        <div className={styles.timeline}>
          {experience.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              labels={dateLabels}
              locale={locale}
            />
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="cv-education">
        <div className={styles.sectionHeading}>
          <span>02</span>
          <h2 id="cv-education">{labels.education}</h2>
        </div>
        <div className={styles.educationContent}>
          <div className={styles.educationGroup}>
            {education.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                labels={dateLabels}
                locale={locale}
              />
            ))}
          </div>
          <section
            className={styles.languageTags}
            aria-label={labels.languages}
          >
            <ul>
              {languages.map((language) => (
                <li key={language.id}>
                  <span>{localize(language.name, locale)}</span>
                  <strong>{localize(language.level, locale)}</strong>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </div>
  );
}

async function getCvViewProps(): Promise<Omit<CvViewProps, "variant">> {
  const [rawLocale, t] = await Promise.all([
    getLocale(),
    getTranslations("cv"),
  ]);
  const locale: Locale = rawLocale === "en" ? "en" : "de";

  return {
    locale,
    labels: {
      title: t("title"),
      eyebrow: t("eyebrow"),
      experience: t("experience"),
      education: t("education"),
      languages: t("languages"),
      present: t("present"),
      from: t("from"),
      pdf: t("pdf"),
    },
  };
}

export async function CvContent() {
  return <CvView {...(await getCvViewProps())} variant="detail" />;
}

export async function CvPrintContent() {
  return <CvView {...(await getCvViewProps())} variant="print" />;
}
