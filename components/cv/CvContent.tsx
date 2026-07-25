import Image from "next/image";
import { ArrowDownToLine, ArrowUpRight, Mail, MapPin } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  education,
  experience,
  languages,
  localize,
  type CvEntry,
  type Locale,
} from "@/lib/cv";
import { formatDateRange, type DateRangeLabels } from "@/lib/dates";
import { siteConfig } from "@/lib/siteConfig";
import styles from "./CvContent.module.css";

type CvViewProps = {
  locale: Locale;
  labels: {
    title: string;
    eyebrow: string;
    summary: string;
    experience: string;
    education: string;
    languages: string;
    present: string;
    from: string;
    pdf: string;
    printView: string;
  };
  variant: "detail" | "print";
};

function Logo({ entry }: { entry: CvEntry }) {
  return (
    <span className={styles.logoTile}>
      <Image
        src={entry.logo.src}
        alt={entry.logo.alt}
        width={96}
        height={72}
        sizes="96px"
        className={styles.logo}
        style={
          entry.logo.scale
            ? { transform: `scale(${entry.logo.scale})` }
            : undefined
        }
      />
    </span>
  );
}

function EntryCard({
  entry,
  labels,
  locale,
  index,
}: {
  entry: CvEntry;
  labels: DateRangeLabels;
  locale: Locale;
  index: number;
}) {
  const bullets = entry.bullets ? localize(entry.bullets, locale) : [];

  return (
    <article className={styles.entry}>
      <div className={styles.timelineMark} aria-hidden="true">
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>
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
          <time className={styles.date}>
            {formatDateRange(entry.from, entry.to, locale, labels)}
          </time>
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
        variant === "print" ? styles.printDocument : ""
      }`}
    >
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>{labels.eyebrow}</p>
          <h1 id="detail-title-cv">{labels.title}</h1>
          <p className={styles.summary}>{labels.summary}</p>
        </div>
        <div className={styles.contactFacts}>
          <span>
            <MapPin aria-hidden="true" />
            {locale === "de" ? "Köln, Deutschland" : "Cologne, Germany"}
          </span>
          <a href={`mailto:${siteConfig.email}`}>
            <Mail aria-hidden="true" />
            {siteConfig.email}
          </a>
        </div>
        {variant === "detail" ? (
          <div className={styles.actions}>
            <a
              className={styles.primaryAction}
              href="/Lebenslauf.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ArrowDownToLine aria-hidden="true" />
              {labels.pdf}
            </a>
            <Link className={styles.secondaryAction} href="/cv/print">
              {labels.printView}
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        ) : null}
      </header>

      <section className={styles.section} aria-labelledby="cv-experience">
        <div className={styles.sectionHeading}>
          <span>01</span>
          <h2 id="cv-experience">{labels.experience}</h2>
        </div>
        <div className={styles.timeline}>
          {experience.map((entry, index) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              labels={dateLabels}
              locale={locale}
              index={index}
            />
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="cv-education">
        <div className={styles.sectionHeading}>
          <span>02</span>
          <h2 id="cv-education">{labels.education}</h2>
        </div>
        <div className={styles.timeline}>
          {education.map((entry, index) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              labels={dateLabels}
              locale={locale}
              index={index}
            />
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="cv-languages">
        <div className={styles.sectionHeading}>
          <span>03</span>
          <h2 id="cv-languages">{labels.languages}</h2>
        </div>
        <ul className={styles.languageGrid}>
          {languages.map((language) => (
            <li key={language.id}>
              <span>{localize(language.name, locale)}</span>
              <strong>{localize(language.level, locale)}</strong>
            </li>
          ))}
        </ul>
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
      summary: t("summary"),
      experience: t("experience"),
      education: t("education"),
      languages: t("languages"),
      present: t("present"),
      from: t("from"),
      pdf: t("pdf"),
      printView: t("printView"),
    },
  };
}

export async function CvContent() {
  return <CvView {...(await getCvViewProps())} variant="detail" />;
}

export async function CvPrintContent() {
  return <CvView {...(await getCvViewProps())} variant="print" />;
}
