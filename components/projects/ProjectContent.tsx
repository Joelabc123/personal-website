import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import LocalizedRouteLink from "@/components/detail/LocalizedRouteLink";
import {
  ProjectModalController,
  ProjectModalEntry,
  ProjectModalLink,
} from "@/components/projects/ProjectModalController";
import ProjectVisual from "@/components/projects/ProjectVisual";
import type { Locale } from "@/lib/cv";
import {
  localizeProjectText,
  projects,
  type Project,
  type ProjectLinkKind,
} from "@/lib/projects";
import styles from "./ProjectContent.module.css";

type ProjectLabels = {
  title: string;
  close: string;
  openProject: string;
  comingSoon: string;
  published: string;
  descriptionHeading: string;
  highlightHeading: string;
  projectNumber: string;
  projectType: string;
  technologiesHeading: string;
  linksHeading: string;
  noPublicLink: string;
  backToProjects: string;
  links: Record<ProjectLinkKind, string>;
};

export function projectTitleId(slug: string) {
  return `detail-title-project-${slug}`;
}

function ProjectStatus({
  labels,
  status,
}: {
  labels: ProjectLabels;
  status: Project["status"];
}) {
  return (
    <span
      className={`${styles.status} ${status === "coming-soon" ? styles.statusUpcoming : ""}`}
    >
      <span aria-hidden="true" />
      {status === "coming-soon" ? labels.comingSoon : labels.published}
    </span>
  );
}

function TechnologyTags({ technologies }: { technologies: readonly string[] }) {
  return (
    <ul className={styles.technologies} aria-label={technologies.join(", ")}>
      {technologies.map((technology) => (
        <li key={technology}>{technology}</li>
      ))}
    </ul>
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
  const summary = localizeProjectText(project.summary, locale);
  const type = localizeProjectText(project.type, locale);
  const highlight = localizeProjectText(project.highlight, locale);
  const number = String(index + 1).padStart(2, "0");
  const className = [
    styles.card,
    project.featured ? styles.featured : "",
    project.status === "coming-soon" ? styles.comingSoon : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ProjectModalLink
      href={`/${locale}/projects/${project.slug}`}
      slug={project.slug}
      className={className}
    >
      <div className={styles.cardMedia}>
        <ProjectVisual kind={project.motif} />
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className={styles.cardIndex}>{number}</span>
          <ProjectStatus labels={labels} status={project.status} />
        </div>

        <p className={styles.projectType}>{type}</p>
        <h2 id={`project-card-${project.slug}`}>{title}</h2>
        <p className={styles.cardDescription}>{summary}</p>
        <TechnologyTags technologies={project.technologies} />

        <div className={styles.cardFooter}>
          <span className={styles.highlight}>{highlight}</span>
          <span className={styles.openLabel}>
            {labels.openProject}
            <ArrowUpRight aria-hidden="true" />
          </span>
        </div>
      </div>
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
      descriptionHeading: t("descriptionHeading"),
      highlightHeading: t("highlightHeading"),
      projectNumber: t("projectNumber"),
      projectType: t("projectType"),
      technologiesHeading: t("technologiesHeading"),
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

      {projects.map((project) => (
        <ProjectModalEntry
          key={project.slug}
          slug={project.slug}
          closeLabel={labels.close}
          returnFocusHref={`${localizedProjectsPath}/${project.slug}`}
          titleId={projectTitleId(project.slug)}
        >
          <ProjectDetail project={project} showBackLink={false} />
        </ProjectModalEntry>
      ))}
    </ProjectModalController>
  );
}

export async function ProjectDetail({
  project,
  showBackLink = false,
}: {
  project: Project;
  showBackLink?: boolean;
}) {
  const { labels, locale } = await getLabels();
  const title = localizeProjectText(project.title, locale);
  const type = localizeProjectText(project.type, locale);
  const summary = localizeProjectText(project.summary, locale);
  const description = localizeProjectText(project.description, locale);
  const highlight = localizeProjectText(project.highlight, locale);
  const number = String(projects.findIndex((item) => item.slug === project.slug) + 1).padStart(
    2,
    "0",
  );

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
          {title}
        </h2>
        <ProjectVisual kind={project.motif} detail />
      </section>

      <div className={styles.detailBody}>
        <header className={styles.detailHeader}>
          <div className={styles.detailMetaLine}>
            <span className={styles.detailIndex}>{number}</span>
            <ProjectStatus labels={labels} status={project.status} />
            <span className={styles.detailType}>{type}</span>
          </div>
          <h1 id={projectTitleId(project.slug)}>{title}</h1>
          <p>{summary}</p>
        </header>

        <div className={styles.detailGrid}>
          <aside className={styles.factCard}>
            <dl className={styles.facts}>
              <div>
                <dt>{labels.projectNumber}</dt>
                <dd>{number}</dd>
              </div>
              <div>
                <dt>{labels.projectType}</dt>
                <dd>{type}</dd>
              </div>
              <div>
                <dt>{labels.technologiesHeading}</dt>
                <dd>
                  <TechnologyTags technologies={project.technologies} />
                </dd>
              </div>
            </dl>
          </aside>

          <section
            className={styles.storyCard}
            aria-labelledby={`project-description-${project.slug}`}
          >
            <div>
              <h2 id={`project-description-${project.slug}`}>
                {labels.descriptionHeading}
              </h2>
              <p>{description}</p>
            </div>

            <div className={styles.detailHighlight}>
              <h2>{labels.highlightHeading}</h2>
              <p>{highlight}</p>
            </div>

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
                <LocalizedRouteLink className={styles.backLink} href="/projects">
                  <ArrowLeft aria-hidden="true" />
                  {labels.backToProjects}
                </LocalizedRouteLink>
              ) : null}
            </footer>
          </section>
        </div>
      </div>
    </div>
  );
}
