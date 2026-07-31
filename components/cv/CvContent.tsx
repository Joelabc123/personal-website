import Image from "next/image";
import {
  ArrowDownToLine,
  ArrowUpRight,
  FolderOpen,
  Mail,
  MapPin,
} from "lucide-react";
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
import {
  formatDateRange,
  type DateRangeLabels,
} from "@/lib/dates";
import { siteConfig } from "@/lib/siteConfig";
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
    location: string;
    links: string;
    projects: string;
  };
  variant: "detail" | "print";
};

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .7A11.5 11.5 0 0 0 8.36 23.1c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.57-.29-5.28-1.29-5.28-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.76 0c2.19-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.71 5.38-5.29 5.67.42.36.79 1.07.79 2.16v3.25c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z"
      />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M5.34 7.76A2.35 2.35 0 1 0 5.3 3.05a2.35 2.35 0 0 0 .04 4.7ZM3.3 20.95h4.08V9.25H3.3v11.7Zm6.51 0h4.08v-6.53c0-1.72.33-3.39 2.47-3.39 2.1 0 2.13 1.97 2.13 3.5v6.42h4.08v-7.24c0-3.56-.77-6.3-4.93-6.3-2 0-3.33 1.1-3.88 2.14h-.06v-1.8H9.81v13.2Z"
      />
    </svg>
  );
}

function Logo({ entry }: { entry: CvEntry }) {
  return (
    <span className={styles.logoTile}>
      <Image
        src={entry.logo.src}
        alt={entry.logo.alt}
        width={96}
        height={96}
        sizes="56px"
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
}: {
  entry: CvEntry;
  labels: DateRangeLabels;
  locale: Locale;
}) {
  const bullets = entry.bullets ? localize(entry.bullets, locale) : [];
  const date = formatDateRange(entry.from, entry.to, locale, labels);
  const tags =
    entry.id === "speira-it-governance"
      ? ["IT Governance", "IT Procurement", "IT-PMO"]
      : [];

  return (
    <article className={styles.entry}>
      <div className={styles.entryCard}>
        <div className={styles.entryHeader}>
          <Logo entry={entry} />
          <div className={styles.entryIdentity}>
            <h3>{localize(entry.role, locale)}</h3>
            <p>{entry.organization}</p>
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

        {tags.length > 0 ? (
          <ul className={styles.entryTags} aria-label="Skills">
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

function SectionHeading({
  index,
  id,
  children,
}: {
  index: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.sectionHeading}>
      <span>{index}</span>
      <h2 id={id}>{children}</h2>
    </div>
  );
}

function Sidebar({ locale, labels }: Pick<CvViewProps, "locale" | "labels">) {
  return (
    <aside className={styles.sidebar} aria-label={labels.languages}>
      <div className={styles.sidebarCard}>
        <section className={styles.sidebarSection}>
          <h2>{labels.languages}</h2>
          <ul className={styles.languageList}>
            {languages.map((language) => (
              <li key={language.id}>
                <span>{localize(language.name, locale)}</span>
                <strong>{localize(language.level, locale)}</strong>
              </li>
            ))}
          </ul>
        </section>

        <nav className={styles.sidebarSection} aria-label={labels.links}>
          <h2>{labels.links}</h2>
          <ul className={styles.linkList}>
            <li>
              <Link href="/projects">
                <FolderOpen aria-hidden="true" />
                <span>{labels.projects}</span>
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </li>
            <li>
              <a href={siteConfig.social.github} target="_blank" rel="noreferrer">
                <GitHubMark />
                <span>GitHub</span>
                <ArrowUpRight aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <LinkedInMark />
                <span>LinkedIn</span>
                <ArrowUpRight aria-hidden="true" />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

function CvView({ locale, labels, variant }: CvViewProps) {
  const dateLabels = { present: labels.present, from: labels.from };
  const pdf =
    locale === "de"
      ? {
          href: "/lebenslauf_de.pdf",
          download: "Lebenslauf-Joel-Bakirel-DE.pdf",
        }
      : {
          href: "/lebenslauf_en.pdf",
          download: "CV-Joel-Bakirel-EN.pdf",
        };

  return (
    <div
      className={`${styles.cv} ${
        variant === "print" ? styles.printDocument : styles.detailDocument
      }`}
    >
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{labels.eyebrow}</p>
          <h1 id="detail-title-cv">{labels.title}</h1>
          <div className={styles.profileLinks}>
            <a href={`mailto:${siteConfig.email}`}>
              <Mail aria-hidden="true" />
              {siteConfig.email}
            </a>
            <span>
              <MapPin aria-hidden="true" />
              {labels.location}
            </span>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              <LinkedInMark />
              LinkedIn
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>

        {variant === "detail" ? (
          <a
            className={styles.primaryAction}
            href={pdf.href}
            download={pdf.download}
          >
            <ArrowDownToLine aria-hidden="true" />
            {labels.pdf}
          </a>
        ) : null}
      </header>

      <div className={styles.contentGrid}>
        <div className={styles.primaryColumn}>
          <section className={styles.section} aria-labelledby="cv-experience">
            <SectionHeading index="01" id="cv-experience">
              {labels.experience}
            </SectionHeading>
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
            <SectionHeading index="02" id="cv-education">
              {labels.education}
            </SectionHeading>
            <div className={styles.timeline}>
              {education.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  labels={dateLabels}
                  locale={locale}
                />
              ))}
            </div>
          </section>
        </div>

        <Sidebar locale={locale} labels={labels} />
      </div>
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
      location: t("location"),
      links: t("links"),
      projects: t("projects"),
    },
  };
}

export async function CvContent() {
  return <CvView {...(await getCvViewProps())} variant="detail" />;
}

export async function CvPrintContent() {
  return <CvView {...(await getCvViewProps())} variant="print" />;
}
