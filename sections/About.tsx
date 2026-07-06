import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";

const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Java",
  "SAP Logon",
  "Coupa",
  "Tailwind CSS",
  "Git",
];

export default async function About() {
  const t = await getTranslations("about");

  return (
    <section
      id="ueber-mich"
      className="border-b border-tertiary px-6 py-24 md:py-32"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
              {t("heading")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-prose text-base leading-relaxed text-secondary md:text-lg">
              {t("body")}
            </p>
          </Reveal>

          <Reveal
            delay={0.2}
            className="mt-10 inline-flex flex-col gap-1 rounded-lg border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_0_28px_rgba(56,189,248,0.2)]"
          >
            <span className="text-3xl font-semibold text-primary">
              {t("statValue")}
            </span>
            <span className="text-sm uppercase tracking-wide text-secondary">
              {t("statLabel")}
            </span>
          </Reveal>
        </div>

        <div>
          <Reveal className="relative mx-auto hidden aspect-video w-full max-w-sm md:block">
            <div
              className="absolute -inset-4 rounded-[1.75rem] bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.22),transparent_70%)] blur-2xl"
              aria-hidden="true"
            />
            <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-[0_18px_50px_-20px_rgba(56,189,248,0.4)] backdrop-blur-md">
              <div
                className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(148,197,255,0.07)_0px,rgba(148,197,255,0.07)_1px,transparent_1px,transparent_18px)]"
                aria-hidden="true"
              />
              <div
                className="absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-xl"
                aria-hidden="true"
              />
            </div>
          </Reveal>

          <h3 className="mt-10 text-sm uppercase tracking-[0.2em] text-secondary md:mt-12">
            {t("skillsHeading")}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <Reveal key={skill} as="li" delay={index * 0.05}>
                <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-primary backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:text-accent">
                  {skill}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
