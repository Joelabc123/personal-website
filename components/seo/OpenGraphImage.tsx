import { ImageResponse } from "next/og";

export const openGraphImageSize = {
  width: 1200,
  height: 630,
};

export const openGraphImageContentType = "image/png";

export function renderOpenGraphImage({
  eyebrow,
  title,
  description,
  accent,
}: {
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "54px",
          color: "#111318",
          background: "#f4f4f0",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            padding: "56px",
            border: "1px solid #d4d6d2",
            borderRadius: "42px",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-180px",
              right: "-80px",
              width: "520px",
              height: "520px",
              display: "flex",
              borderRadius: "999px",
              background: accent,
              opacity: 0.26,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#62666e",
            }}
          >
            {eyebrow}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <div
              style={{
                display: "flex",
                maxWidth: "940px",
                fontSize: title.length > 34 ? 66 : 78,
                lineHeight: 1.02,
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: "820px",
                fontSize: 28,
                lineHeight: 1.35,
                color: "#62666e",
              }}
            >
              {description}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 24,
            }}
          >
            <span>Joel Bakirel</span>
            <span style={{ color: accent }}>joelbakirel.de</span>
          </div>
        </div>
      </div>
    ),
    openGraphImageSize,
  );
}
