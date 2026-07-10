import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";
import GlowButton from "@/components/ui/glow-button";
import AnchorLink from "@/components/AnchorLink";

export default async function Hero() {
  const t = await getTranslations("hero");
  const nameLines = t("greeting").split(" ");

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <div className="mx-auto w-full max-w-5xl">
        <Reveal>
          <h1 className="text-[clamp(3rem,12vw,8.5rem)] font-semibold uppercase leading-[0.95] tracking-tight text-primary [text-shadow:0_0_60px_rgba(255,255,255,0.3)]">
            {nameLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <GlowButton
              targetId="werdegang"
              label={t("ctaJourney")}
              appearance="light"
              textColor="#0A0A0A"
              tint="#FFFFFF"
              borderColor="#000000"
              glowColor="rgba(0,0,0,0.25)"
              flashColor="rgba(0,0,0,0.35)"
            />
            <GlowButton targetId="kontakt" label={t("ctaContact")} />
          </div>
        </Reveal>
      </div>

      <Reveal
        delay={0.45}
        className="absolute bottom-6 left-6 max-w-[10rem] text-left text-[10px] uppercase tracking-[0.2em] text-secondary sm:bottom-10 sm:left-10 sm:max-w-none sm:text-xs"
      >
        {t("basedIn")}
      </Reveal>
      <Reveal
        delay={0.45}
        className="absolute bottom-6 right-6 max-w-[10rem] text-right text-[10px] uppercase tracking-[0.2em] text-secondary sm:bottom-10 sm:right-10 sm:max-w-none sm:text-xs"
      >
        {t("subtitle")}
      </Reveal>

      <AnchorLink
        targetId="werdegang"
        className="group absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-secondary transition-colors hover:text-accent sm:flex md:bottom-10"
      >
        <span>{t("scrollDown")}</span>
        <svg
          className="h-4 w-4 animate-bounce transition-[filter] group-hover:[filter:drop-shadow(0_0_8px_rgba(255,255,255,0.7))]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0l-6-6m6 6l6-6" />
        </svg>
      </AnchorLink>
    </section>
  );
}
