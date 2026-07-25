import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import ModalRouteLink from "@/components/detail/ModalRouteLink";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/cv";
import {
  localizeProjectText,
  projectPlaceholderSources,
  projects,
  type Project,
  type ProjectLinkKind,
  type ProjectMedia,
} from "@/lib/projects";
import styles from "./ProjectContent.module.css";

type ProjectLabels = {
  eyebrow: string;
  title: string;
  description: string;
  openProject: string;
  comingSoon: string;
  published: string;
  status: string;
  descriptionHeading: string;
  mediaHeading: string;
  linksHeading: string;
  noPublicLink: string;
  backToProjects: string;
  links: Record<ProjectLinkKind, string>;
};

export function projectTitleId(slug: string) {
  return `detail-title-project-${slug}`;
}

function Media({
  media,
  locale,
  preload = false,
}: {
  media: ProjectMedia;
  locale: Locale;
  preload?: boolean;
}) {
  const alt = localizeProjectText(media.alt, locale);

  if (media.type === "video") {
    return (
      <video
        className={styles.media}
        controls
        playsInline
        poster={media.poster}
        aria-label={alt}
      >
        <source src={media.src} />
      </video>
    );
  }

  const src =
    media.type === "placeholder"
      ? projectPlaceholderSources[media.variant]
      : media.src;

  return (
    <Image
      className={styles.media}
      src={src}
      alt={alt}
      width={1600}
      height={900}
      sizes={
        preload
          ? "(max-width: 760px) 100vw, 820px"
          : "(max-width: 760px) 100vw, 420px"
      }
      preload={preload}
      unoptimized={media.type === "placeholder"}
    />
  );
}

function ProjectCard({
  project,
  index,
  labels,
  locale,
}: {
  project: Project;
  index: number;
  labels: ProjectLabels;
  locale: Locale;
}) {
  const title = localizeProjectText(project.title, locale);
  const description = localizeProjectText(project.description, locale);
  const className = [
    styles.card,
    project.featured ? styles.featured : "",
    project.status === "coming-soon" ? styles.comingSoon : "",
  ]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      <div className={styles.cardMedia}>
        <Media
          media={project.media[0]!}
          locale={locale}
          preload={project.featured}
        />
        <span className={styles.cardIndex} aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardHeading}>
          <h2 id={`project-card-${project.slug}`}>{title}</h2>
          <span className={styles.status}>
            {project.status === "coming-soon"
              ? labels.comingSoon
              : labels.published}
          </span>
        </div>
        <p>{description}</p>
        {project.status === "published" ? (
          <span className={styles.openLabel}>
            {labels.openProject}
            <ArrowUpRight aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </>
  );

  if (project.status === "coming-soon") {
    return (
      <article
        className={className}
        aria-labelledby={`project-card-${project.slug}`}
      >
        {content}
      </article>
    );
  }

  return (
    <ModalRouteLink
      href={`/projects/${project.slug}`}
      className={className}
    >
      {content}
    </ModalRouteLink>
  );
}

async function getLabels(): Promise<{
  labels: ProjectLabels;
  locale: Locale;
}> {
  const [rawLocale, t] = await Promise.all([
    getLocale(),
    getTranslations("projects"),
  ]);

  return {
    locale: rawLocale === "en" ? "en" : "de",
    labels: {
      eyebrow: t("eyebrow"),
      title: t("title"),
      description: t("description"),
      openProject: t("openProject"),
      comingSoon: t("comingSoon"),
      published: t("published"),
      status: t("status"),
      descriptionHeading: t("descriptionHeading"),
      mediaHeading: t("mediaHeading"),
      linksHeading: t("linksHeading"),
      noPublicLink: t("noPublicLink"),
      backToProjects: t("backToProjects"),
      links: {
        repository: t("links.repository"),
        demo: t("links.demo"),
        documentation: t("links.documentation"),
      },
    },
  };
}

export async function ProjectOverview() {
  const { labels, locale } = await getLabels();

  return (
    <div className={styles.projects}>
      <header className={styles.overviewHeader}>
        <p className={styles.eyebrow}>{labels.eyebrow}</p>
        <h1 id="detail-title-projects">{labels.title}</h1>
        <p>{labels.description}</p>
      </header>

      <section className={styles.grid} aria-label={labels.title}>
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={index}
            labels={labels}
            locale={locale}
          />
        ))}
      </section>
    </div>
  );
}

export async function ProjectDetail({ project }: { project: Project }) {
  const { labels, locale } = await getLabels();
  const title = localizeProjectText(project.title, locale);
  const description = localizeProjectText(project.description, locale);

  return (
    <div className={styles.projectDetail}>
      <Link className={styles.backLink} href="/projects">
        <ArrowLeft aria-hidden="true" />
        {labels.backToProjects}
      </Link>

      <header className={styles.detailHeader}>
        <p className={styles.eyebrow}>{labels.eyebrow}</p>
        <h1 id={projectTitleId(project.slug)}>{title}</h1>
      </header>

      <div className={styles.detailGrid}>
        <aside className={styles.metaCard}>
          <dl>
            <div>
              <dt>{labels.status}</dt>
              <dd>{labels.published}</dd>
            </div>
            <div>
              <dt>{labels.linksHeading}</dt>
              <dd>
                {project.links.length > 0 ? (
                  <span className={styles.externalLinks}>
                    {project.links.map((link) => (
                      <a
                        key={`${link.kind}-${link.href}`}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {labels.links[link.kind]}
                        <ArrowUpRight aria-hidden="true" />
                      </a>
                    ))}
                  </span>
                ) : (
                  labels.noPublicLink
                )}
              </dd>
            </div>
          </dl>
        </aside>

        <article className={styles.descriptionCard}>
          <p className={styles.cardLabel}>{labels.descriptionHeading}</p>
          <p>{description}</p>
        </article>
      </div>

      <section className={styles.mediaSection} aria-labelledby="project-media">
        <h2 id="project-media">{labels.mediaHeading}</h2>
        <div className={styles.mediaGrid}>
          {project.media.map((media, index) => (
            <figure key={`${project.slug}-media-${index}`}>
              <Media media={media} locale={locale} />
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
