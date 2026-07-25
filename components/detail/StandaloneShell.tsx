import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

type StandaloneShellProps = {
  children: React.ReactNode;
  homeLabel: string;
};

export default function StandaloneShell({
  children,
  homeLabel,
}: StandaloneShellProps) {
  return (
    <main className="detail-page">
      <article className="detail-surface">
        <div className="detail-surface__topbar">
          <Link href="/" className="detail-home-link">
            <ArrowLeft aria-hidden="true" />
            <span>{homeLabel}</span>
          </Link>
        </div>
        <div className="detail-surface__content">{children}</div>
      </article>
    </main>
  );
}
