import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import StandaloneShell from "@/components/detail/StandaloneShell";
import { ProjectDetail } from "@/components/projects/ProjectContent";
import JsonLd from "@/components/seo/JsonLd";
import type { Locale } from "@/lib/cv";
import { asLocale, createLocalizedMetadata } from "@/lib/metadata";
import {
  getPublishedProjectBySlug,
  localizeProjectText,
  publishedProjects,
} from "@/lib/projects";
import { projectJsonLd } from "@/lib/structured-data";

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

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = asLocale(rawLocale);
  const project = getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const t = await getTranslations("projects");

  return (
    <StandaloneShell
      documentNavigation
      homeHref={`/${locale}/projects`}
      homeLabel={t("backToProjects")}
    >
      <JsonLd data={projectJsonLd(project, locale)} />
      <ProjectDetail project={project} showBackLink={false} />
    </StandaloneShell>
  );
}
