import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { formatDateRange } from "@/lib/dates";
import Reveal from "@/components/Reveal";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import {
  experience,
  education,
  languages,
  localize,
  type CvEntry,
  type Locale,
} from "@/lib/cv";
import { projects, type Project } from "@/lib/projects";

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
  locale: Locale;
}) {
  const bullets = entry.bullets ? localize(entry.bullets, locale) : [];

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
        <IconTile
          logo={entry.logo.src}
          logoScale={entry.logo.scale}
          label={entry.organization}
        />
        <div className="min-w-0 flex-1">
          <h4 className="text-lg font-semibold text-primary">{entry.organization}</h4>
          <p className="mt-1 text-sm text-secondary">
            {localize(entry.role, locale)}
          </p>
          {bullets.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-secondary">
              {bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
        <span className="w-24 shrink-0 text-right text-sm text-secondary md:w-40">
          {formatDateRange(entry.from, entry.to, locale, {
            present: presentLabel,
            from: locale === "de" ? "ab" : "from",
          })}
        </span>
      </div>
    </Reveal>
  );
}

function EntryGroup({
  entries,
  presentLabel,
  locale,
}: {
  entries: readonly CvEntry[];
  presentLabel: string;
  locale: Locale;
}) {
  return (
    <div className="relative rounded-2xl border border-white/10 p-2 md:rounded-3xl md:p-3">
      <GlowingEffect
        variant="white"
        spread={40}
        glow
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
      />
      <div className="relative divide-y divide-white/10 rounded-xl bg-white/5 px-6 backdrop-blur-sm">
        {entries.map((entry, index) => {
          const bullets = entry.bullets ? localize(entry.bullets, locale) : [];

          return (
            <Reveal
              key={entry.id}
              delay={index * 0.05}
              className="flex gap-6 py-6"
            >
            <IconTile
              logo={entry.logo.src}
              logoScale={entry.logo.scale}
              label={entry.organization}
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-lg font-semibold text-primary">{entry.organization}</h4>
              <p className="mt-1 text-sm text-secondary">
                {localize(entry.role, locale)}
              </p>
              {bullets.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-secondary">
                  {bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
            <span className="w-24 shrink-0 text-right text-sm text-secondary md:w-40">
              {formatDateRange(entry.from, entry.to, locale, {
                present: presentLabel,
                from: locale === "de" ? "ab" : "from",
              })}
            </span>
          </Reveal>
          );
        })}
      </div>
    </div>
  );
}

function ProjectGroup({
  projects: projectEntries,
  projectLinkLabel,
  locale,
}: {
  projects: readonly Project[];
  projectLinkLabel: string;
  locale: Locale;
}) {
  return (
    <div className="relative rounded-2xl border border-white/10 p-2 md:rounded-3xl md:p-3">
      <GlowingEffect
        variant="white"
        spread={40}
        glow
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
      />
      <div className="relative divide-y divide-white/10 rounded-xl bg-white/5 px-6 backdrop-blur-sm">
        {projectEntries.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.05} className="py-6">
            <h4 className="text-lg font-semibold text-primary">
              {localize(project.title, locale)}
            </h4>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-secondary">
              {localize(project.description, locale)}
            </p>
            {project.links[0] ? (
              <a
                href={project.links[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-medium text-primary underline underline-offset-4 transition-colors hover:text-secondary"
              >
                {projectLinkLabel}
              </a>
            ) : null}
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default async function Journey() {
  const t = await getTranslations("journey");
  const locale: Locale = (await getLocale()) === "en" ? "en" : "de";
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
          <div className="mt-4">
            <EntryGroup entries={education} presentLabel={presentLabel} locale={locale} />
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-sm uppercase tracking-[0.2em] text-secondary">
            {t("projects")}
          </h3>
          <div className="mt-4">
            <ProjectGroup
              projects={projects}
              projectLinkLabel={t("projectLink")}
              locale={locale}
            />
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-sm uppercase tracking-[0.2em] text-secondary">
            {t("languages")}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-3">
            {languages.map((lang, index) => (
              <Reveal key={lang.id} as="li" delay={index * 0.05}>
                <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-primary backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60">
                  <span className="font-medium">{localize(lang.name, locale)}</span>
                  <span className="text-secondary">
                    {" "}
                    — {localize(lang.level, locale)}
                  </span>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
