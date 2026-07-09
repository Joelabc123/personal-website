import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { formatDateRange } from "@/lib/dates";
import Reveal from "@/components/Reveal";
import { GlowingEffect } from "@/components/ui/glowing-effect";
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
  logoScale = 1,
  icon: Icon,
  label,
}: {
  logo?: string;
  logoScale?: number;
  icon?: LucideIcon;
  label: string;
}) {
  return (
    <div className="hidden h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm sm:flex">
      {logo ? (
        <Image
          src={logo}
          alt={label}
          width={56}
          height={56}
          className="h-14 w-14 object-contain"
          style={logoScale !== 1 ? { transform: `scale(${logoScale})` } : undefined}
        />
      ) : Icon ? (
        <Icon className="h-10 w-10 text-black" strokeWidth={1.5} aria-hidden="true" />
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
    <Reveal className="relative rounded-2xl border border-white/10 p-2 md:rounded-3xl md:p-3">
      <GlowingEffect
        variant="white"
        spread={40}
        glow
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
      />
      <div className="relative flex gap-6 rounded-xl bg-white/5 p-6 backdrop-blur-sm">
        <IconTile logo={entry.logo} logoScale={entry.logoScale} icon={entry.icon} label={entry.organization} />
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
      </div>
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
    <Reveal className="relative rounded-2xl border border-white/10 p-2 md:rounded-3xl md:p-3">
      <GlowingEffect
        variant="white"
        spread={40}
        glow
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
      />
      <div className="relative flex gap-6 rounded-xl bg-white/5 p-6 backdrop-blur-sm">
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
            <div className="relative rounded-full border border-white/10 p-1">
              <GlowingEffect
                variant="white"
                spread={40}
                glow
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={2}
              />
              <a
                href="/Lebenslauf.pdf"
                target="_blank"
                rel="noopener"
                className="relative block rounded-full bg-white/5 px-5 py-2 text-sm font-medium text-primary backdrop-blur-sm transition-colors hover:text-accent"
              >
                {t("pdfButton")}
              </a>
            </div>
          </Reveal>
        </div>

        <div className="mt-16">
          <h3 className="text-sm uppercase tracking-[0.2em] text-secondary">
            {t("experience")}
          </h3>
          <div className="mt-4 space-y-4">
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
          <div className="mt-4 space-y-4">
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
          <div className="mt-4 space-y-4">
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
