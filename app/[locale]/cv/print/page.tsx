import type { Metadata } from "next";
import { CvPrintContent } from "@/components/cv/CvContent";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function CvPrintPage() {
  return (
    <main className="cv-print-page">
      <CvPrintContent />
    </main>
  );
}
