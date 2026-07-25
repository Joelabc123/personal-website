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
          color: "#fafbff",
          background: "#010205",
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
            border: "1px solid #2b2c2f",
            borderRadius: "42px",
            background: "#1a1a1e",
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
              color: "#d5d5d5",
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
                color: "#d5d5d5",
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
