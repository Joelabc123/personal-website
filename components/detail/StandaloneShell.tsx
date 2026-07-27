import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

type StandaloneShellProps = {
  children: React.ReactNode;
  homeLabel: string;
  homeHref?: string;
  documentNavigation?: boolean;
};

export default function StandaloneShell({
  children,
  homeLabel,
  homeHref = "/",
  documentNavigation = false,
}: StandaloneShellProps) {
  const homeLinkContent = (
    <>
      <ArrowLeft aria-hidden="true" />
      <span>{homeLabel}</span>
    </>
  );

  return (
    <main className="detail-page">
      <article className="detail-surface">
        <div className="detail-surface__topbar">
          {documentNavigation ? (
            <a href={homeHref} className="detail-home-link">
              {homeLinkContent}
            </a>
          ) : (
            <Link href={homeHref} className="detail-home-link">
              {homeLinkContent}
            </Link>
          )}
        </div>
        <div className="detail-surface__content">{children}</div>
      </article>
    </main>
  );
}
