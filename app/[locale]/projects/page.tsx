import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import StandaloneShell from "@/components/detail/StandaloneShell";
import { ProjectOverview } from "@/components/projects/ProjectContent";
import JsonLd from "@/components/seo/JsonLd";
import { asLocale, createLocalizedMetadata } from "@/lib/metadata";
import { projects } from "@/lib/projects";
import { projectsPageJsonLd } from "@/lib/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);
  const t = await getTranslations({ locale, namespace: "metadata.projects" });

  return createLocalizedMetadata({
    locale,
    path: "/projects",
    title: t("title"),
    description: t("description"),
    openGraphImagePath: "/projects",
  });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);
  const [shell, metadata] = await Promise.all([
    getTranslations("detailRoutes.shell"),
    getTranslations({ locale, namespace: "metadata.projects" }),
  ]);

  return (
    <StandaloneShell homeLabel={shell("backHome")}>
      <JsonLd
        data={projectsPageJsonLd(
          {
            locale,
            path: "/projects",
            name: metadata("title"),
            description: metadata("description"),
          },
          projects,
        )}
      />
      <ProjectOverview />
    </StandaloneShell>
  );
}
