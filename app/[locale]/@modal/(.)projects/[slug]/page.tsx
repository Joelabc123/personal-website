import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import ModalShell from "@/components/detail/ModalShell";
import {
  ProjectDetail,
  projectTitleId,
} from "@/components/projects/ProjectContent";
import {
  getPublishedProjectBySlug,
  localizeProjectText,
  publishedProjects,
} from "@/lib/projects";
import { asLocale, createLocalizedMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = asLocale(rawLocale);
  const project = getPublishedProjectBySlug(slug);

  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: "metadata.projects" });

  return createLocalizedMetadata({
    locale,
    path: `/projects/${project.slug}`,
    title: t("detailTitle", {
      title: localizeProjectText(project.title, locale),
    }),
    description: localizeProjectText(project.description, locale),
    openGraphImagePath: "/projects",
  });
}

export default async function ProjectModal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, locale, t] = await Promise.all([
    params,
    getLocale(),
    getTranslations("detailRoutes.shell"),
  ]);
  const project = getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <ModalShell
      closeLabel={t("close")}
      returnFocusHref={`/${locale}/projects/${slug}`}
      titleId={projectTitleId(slug)}
    >
      <ProjectDetail project={project} showBackLink={false} />
    </ModalShell>
  );
}
