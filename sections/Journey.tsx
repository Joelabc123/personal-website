import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { formatDateRange } from "@/lib/dates";
import Reveal from "@/components/Reveal";
import {
  experience,
  education,
  projects,
  languages,
  type CvEntry,
  type ProjectEntry,
} from "@/lib/cv";

function IconTile({
  logo,
  icon: Icon,
  label,
}: {
  logo?: string;
  icon?: LucideIcon;
  label: string;
}) {
  return (
    <div className="hidden h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm sm:flex">
      {logo ? (
        <Image
          src={logo}
          alt={label}
          width={44}
          height={44}
          className="h-11 w-11 object-contain"
        />
      ) : Icon ? (
        <Icon className="h-8 w-8 text-sky-600" strokeWidth={1.5} aria-hidden="true" />
      ) : null}
    </div>
  );
}

function EntryCard({
  entry,
  presentLabel,
  locale,
}: {
  entry: CvEntry;
  presentLabel: string;
  locale: string;
}) {
  return (
    <Reveal className="flex gap-6 rounded-xl border-b border-tertiary px-4 py-8 transition-colors duration-300 last:border-b-0 hover:bg-white/[0.03]">
      <IconTile logo={entry.logo} icon={entry.icon} label={entry.organization} />
      <div className="min-w-0 flex-1">
        <h4 className="text-lg font-semibold text-primary">{entry.organization}</h4>
        <p className="mt-1 text-sm text-secondary">{entry.role}</p>
        {entry.bullets && (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-secondary">
            {entry.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}
      </div>
      <span className="w-24 shrink-0 text-right text-sm text-secondary md:w-40">
        {formatDateRange(entry.from, entry.to, locale, presentLabel)}
      </span>
    </Reveal>
  );
}

function ProjectCard({
  project,
  projectLinkLabel,
}: {
  project: ProjectEntry;
  projectLinkLabel: string;
}) {
  return (
    <Reveal className="flex gap-6 rounded-xl border-b border-tertiary px-4 py-8 transition-colors duration-300 last:border-b-0 hover:bg-white/[0.03]">
      <IconTile icon={project.icon} label={project.name} />
      <div>
        <h4 className="text-lg font-semibold text-primary">{project.name}</h4>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-secondary">
          {project.description}
        </p>
        {project.link && (
          <a
            href={project.link}
            className="mt-3 inline-block text-sm font-medium text-primary underline underline-offset-4 transition-colors hover:text-secondary"
          >
            {projectLinkLabel}
          </a>
        )}
      </div>
    </Reveal>
  );
}

export default async function Journey() {
  const t = await getTranslations("journey");
  const locale = await getLocale();
  const presentLabel = t("present");

  return (
    <section
      id="werdegang"
      className="border-b border-tertiary px-6 py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
              {t("heading")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <a
              href="/Lebenslauf.pdf"
              target="_blank"
              rel="noopener"
              className="inline-block rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-primary backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:bg-accent/10 hover:text-accent hover:shadow-[0_0_24px_rgba(56,189,248,0.25)]"
            >
              {t("pdfButton")}
            </a>
          </Reveal>
        </div>

        <div className="mt-16">
          <h3 className="text-sm uppercase tracking-[0.2em] text-secondary">
            {t("experience")}
          </h3>
          <div className="mt-4">
            {experience.map((entry) => (
              <EntryCard
                key={`${entry.organization}-${entry.from}`}
                entry={entry}
                presentLabel={presentLabel}
                locale={locale}
              />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-sm uppercase tracking-[0.2em] text-secondary">
            {t("education")}
          </h3>
          <div className="mt-4">
            {education.map((entry) => (
              <EntryCard
                key={`${entry.organization}-${entry.from}`}
                entry={entry}
                presentLabel={presentLabel}
                locale={locale}
              />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-sm uppercase tracking-[0.2em] text-secondary">
            {t("projects")}
          </h3>
          <div className="mt-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.name}
                project={project}
                projectLinkLabel={t("projectLink")}
              />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-sm uppercase tracking-[0.2em] text-secondary">
            {t("languages")}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-3">
            {languages.map((lang, index) => (
              <Reveal key={lang.name} as="li" delay={index * 0.05}>
                <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-primary backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60">
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-secondary"> — {lang.level}</span>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
