import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";

export default async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <h1 className="text-[clamp(3.5rem,10vw,9rem)] font-semibold leading-none tracking-tight text-primary [text-shadow:0_0_60px_rgba(255,255,255,0.25)]">
            {t("greeting")}
          </h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-6 text-lg text-secondary md:text-xl">{t("subtitle")}</p>
        </Reveal>
      </div>

      <a
        href="#ueber-mich"
        className="group absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-secondary transition-colors hover:text-accent"
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
      </a>
    </section>
  );
}
