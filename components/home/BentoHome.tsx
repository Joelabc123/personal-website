import { ArrowUpRight, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import CvBentoLink from "@/components/cv/CvBentoLink";
import ModalRouteLink from "@/components/detail/ModalRouteLink";
import EarthGlobe from "@/components/home/EarthGlobe";
import HomeUtilityGrid from "@/components/home/HomeUtilityGrid";
import ProjectCodeLoop from "@/components/home/ProjectCodeLoop";
import { cvEntries } from "@/lib/cv";
import styles from "./BentoHome.module.css";

export default async function BentoHome() {
  const t = await getTranslations("homeBento");

  return (
    <main className={styles.home}>
      <section className={styles.grid} aria-label={t("gridLabel")}>
        <article className={`${styles.card} ${styles.intro}`}>
          <div className={styles.introCopy}>
            <h1>
              {t.rich("intro.title", {
                br: () => <br />,
              })}
            </h1>
            <p className={styles.location}>
              <MapPin aria-hidden="true" />
              {t("intro.location")}
            </p>
          </div>
        </article>

        <CvBentoLink
          className={`${styles.card} ${styles.linkCard} ${styles.cv}`}
          title={t("cv.title")}
          description={t("cv.description")}
          logos={cvEntries.map((entry) => ({
            id: entry.id,
            src: entry.logo.src,
            alt: entry.logo.alt,
          }))}
        />

        <ModalRouteLink
          href="/projects"
          className={`${styles.card} ${styles.linkCard} ${styles.projects}`}
        >
          <div className={styles.cardTopline}>
            <ArrowUpRight aria-hidden="true" />
          </div>
          <ProjectCodeLoop label={t("projects.codeLabel")} />
          <div>
            <h2>{t("projects.title")}</h2>
            <p>{t("projects.description")}</p>
          </div>
        </ModalRouteLink>

        <ModalRouteLink
          href="/travel"
          className={`${styles.card} ${styles.linkCard} ${styles.travel}`}
        >
          <div className={styles.cardTopline}>
            <ArrowUpRight aria-hidden="true" />
          </div>
          <div className={styles.travelVisual} aria-hidden="true">
            <EarthGlobe className={styles.travelGlobe} slowOnHover />
          </div>
          <div>
            <h2>{t("travel.title")}</h2>
            <p>{t("travel.description")}</p>
          </div>
        </ModalRouteLink>

        <HomeUtilityGrid />
      </section>
    </main>
  );
}
