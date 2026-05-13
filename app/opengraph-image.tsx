import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Andrey Rattes — Engenheiro Frontend";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Cream / dark palette espelhando o hero
const CREAM = "#E1E0CC";
const BG    = "#09090b";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width:  "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: BG,
          padding: "72px 80px",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Atmospheric radial glow (canto superior direito) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 700,
            height: 700,
            background:
              "radial-gradient(circle at 80% 20%, rgba(225,224,204,0.10) 0%, transparent 60%)",
            display: "flex",
          }}
        />

        {/* Top bar — eyebrow + dot */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "rgba(225,224,204,0.55)",
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: CREAM,
            }}
          />
          andrey.dev.br
        </div>

        {/* Headline — espelha o hero do site */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            color: CREAM,
            fontSize: 120,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
          }}
        >
          <div style={{ opacity: 0.6 }}>Construo frontends</div>
          <div style={{ opacity: 0.6 }}>que aguentam</div>
          <div>produção.</div>
        </div>

        {/* Footer row — name + role */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 56,
            paddingTop: 28,
            borderTop: "1px solid rgba(225,224,204,0.18)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <span style={{ color: CREAM, fontSize: 32, fontWeight: 700 }}>
              Andrey Rattes
            </span>
            <span style={{ color: "rgba(225,224,204,0.55)", fontSize: 22 }}>
              Engenheiro Frontend · Fintech · IA
            </span>
          </div>

          {/* 8-bit glasses lockup */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <svg width="56" height="56" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <rect x="3"  y="12" width="11" height="9" fill="none" stroke={CREAM} strokeWidth="2.5"/>
              <rect x="18" y="12" width="11" height="9" fill="none" stroke={CREAM} strokeWidth="2.5"/>
              <line x1="14" y1="16.5" x2="18" y2="16.5" stroke={CREAM} strokeWidth="2.5"/>
              <line x1="3"  y1="14" x2="1"  y2="12"   stroke={CREAM} strokeWidth="2.5"/>
              <line x1="29" y1="14" x2="31" y2="12"   stroke={CREAM} strokeWidth="2.5"/>
            </svg>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
