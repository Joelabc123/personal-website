import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import ModalShell from "@/components/detail/ModalShell";
import { ProjectOverview } from "@/components/projects/ProjectContent";
import { asLocale, createLocalizedMetadata } from "@/lib/metadata";

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

export default async function ProjectsModal() {
  const [locale, t, projectsT] = await Promise.all([
    getLocale(),
    getTranslations("detailRoutes.shell"),
    getTranslations("projects"),
  ]);

  return (
    <ModalShell
      closeLabel={t("close")}
      returnFocusHref={`/${locale}/projects`}
      ariaLabel={projectsT("title")}
    >
      <ProjectOverview />
    </ModalShell>
  );
}
