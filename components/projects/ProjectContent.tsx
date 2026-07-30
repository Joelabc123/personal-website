import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import ModalRouteLink from "@/components/detail/ModalRouteLink";
import {
  ProjectModalController,
  ProjectModalEntry,
  ProjectModalLink,
} from "@/components/projects/ProjectModalController";
import type { Locale } from "@/lib/cv";
import {
  localizeProjectText,
  projectPlaceholderSources,
  projects,
  publishedProjects,
  type Project,
  type ProjectLinkKind,
  type ProjectMedia,
} from "@/lib/projects";
import styles from "./ProjectContent.module.css";

type ProjectLabels = {
  title: string;
  close: string;
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

type MediaLayout = "featured-card" | "card" | "hero" | "gallery";

type ProjectMediaStyle = CSSProperties & {
  "--project-card-position"?: string;
  "--project-card-position-mobile"?: string;
  "--project-media-background"?: string;
};

const mediaSizes: Record<MediaLayout, string> = {
  "featured-card": "(max-width: 760px) 100vw, 64vw",
  card: "(max-width: 760px) 100vw, 26vw",
  hero: "(max-width: 760px) 100vw, 896px",
  gallery: "(max-width: 760px) 100vw, 448px",
};

function Media({
  media,
  locale,
  layout,
  preload = false,
}: {
  media: ProjectMedia;
  locale: Locale;
  layout: MediaLayout;
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
  const rasterProps =
    media.type === "placeholder"
      ? {
          height: 900,
          unoptimized: true,
          width: 1600,
        }
      : {
          height: media.height,
          quality: 90,
          width: media.width,
        };
  const positionStyle: ProjectMediaStyle | undefined =
    media.type === "placeholder"
      ? undefined
      : {
          "--project-card-position": media.cardPosition,
          "--project-card-position-mobile": media.cardPositionMobile,
          "--project-media-background": media.frameBackground,
        };

  return (
    <Image
      className={styles.media}
      src={src}
      alt={alt}
      sizes={mediaSizes[layout]}
      preload={preload}
      style={positionStyle}
      {...rasterProps}
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
          layout={project.featured ? "featured-card" : "card"}
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
    <ProjectModalLink
      href={`/${locale}/projects/${project.slug}`}
      slug={project.slug}
      className={className}
    >
      {content}
    </ProjectModalLink>
  );
}

async function getLabels(): Promise<{
  labels: ProjectLabels;
  locale: Locale;
}> {
  const [rawLocale, t, shellT] = await Promise.all([
    getLocale(),
    getTranslations("projects"),
    getTranslations("detailRoutes.shell"),
  ]);

  return {
    locale: rawLocale === "en" ? "en" : "de",
    labels: {
      title: t("title"),
      close: shellT("close"),
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
  const localizedProjectsPath = `/${locale}/projects`;

  return (
    <ProjectModalController>
      <div className={`${styles.projects} project-overview`}>
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

      {publishedProjects.map((project) => (
        <ProjectModalEntry
          key={project.slug}
          slug={project.slug}
          closeLabel={labels.close}
          returnFocusHref={`${localizedProjectsPath}/${project.slug}`}
          titleId={projectTitleId(project.slug)}
        >
          <ProjectDetail
            project={project}
            showBackLink={false}
            preloadMedia={false}
          />
        </ProjectModalEntry>
      ))}
    </ProjectModalController>
  );
}

export async function ProjectDetail({
  project,
  showBackLink = false,
  preloadMedia = true,
}: {
  project: Project;
  showBackLink?: boolean;
  preloadMedia?: boolean;
}) {
  const { labels, locale } = await getLabels();
  const title = localizeProjectText(project.title, locale);
  const description = localizeProjectText(project.description, locale);

  return (
    <div className={`${styles.projectDetail} project-detail-view`}>
      <section
        className={styles.heroMedia}
        aria-labelledby={`project-media-${project.slug}`}
      >
        <h2
          className={styles.visuallyHidden}
          id={`project-media-${project.slug}`}
        >
          {labels.mediaHeading}
        </h2>
        <figure>
          <Media
            media={project.media[0]!}
            locale={locale}
            layout="hero"
            preload={preloadMedia}
          />
        </figure>
      </section>

      <div className={styles.detailBody}>
        <header className={styles.detailHeader}>
          <span className={styles.detailStatus}>{labels.published}</span>
          <h1 id={projectTitleId(project.slug)}>{title}</h1>
        </header>

        <div className={styles.detailDivider} aria-hidden="true" />

        <section
          className={styles.descriptionSection}
          aria-labelledby={`project-description-${project.slug}`}
        >
          <h2
            className={styles.visuallyHidden}
            id={`project-description-${project.slug}`}
          >
            {labels.descriptionHeading}
          </h2>
          <p>{description}</p>
        </section>

        {project.media.length > 1 ? (
          <section
            className={styles.additionalMedia}
            aria-label={labels.mediaHeading}
          >
            {project.media.slice(1).map((media, index) => (
              <figure key={`${project.slug}-media-${index + 1}`}>
                <Media media={media} locale={locale} layout="gallery" />
              </figure>
            ))}
          </section>
        ) : null}

        <footer className={styles.detailFooter}>
          <p className={styles.cardLabel}>{labels.linksHeading}</p>
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
            <p className={styles.noPublicLink}>{labels.noPublicLink}</p>
          )}

          {showBackLink ? (
            <ModalRouteLink className={styles.backLink} href="/projects">
              <ArrowLeft aria-hidden="true" />
              {labels.backToProjects}
            </ModalRouteLink>
          ) : null}
        </footer>
      </div>
    </div>
  );
}
