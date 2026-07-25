import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import StandaloneShell from "@/components/detail/StandaloneShell";
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

export default async function ProjectsPage() {
  const t = await getTranslations("detailRoutes.shell");

  return (
    <StandaloneShell homeLabel={t("backHome")}>
      <ProjectOverview />
    </StandaloneShell>
  );
}
