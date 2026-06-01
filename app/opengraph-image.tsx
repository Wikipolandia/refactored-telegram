import { ImageResponse } from "next/og";

// Social share card (LinkedIn / WhatsApp / Twitter). Next auto-wires this into
// the page metadata. 1200×630 branded image, generated at request time.
export const runtime = "edge";
export const alt = "Kerbly — compliant Rightmove listings in 20 seconds";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Inverted mark (white square, green roofline + tick) so it pops on the green bg.
const MARK_SVG = `<svg width="120" height="120" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="30" height="30" rx="8" fill="#ffffff"/><path d="M8 14.5 L16 8.5 L24 14.5" stroke="#0d6e57" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5 18.5 L14.5 22.5 L22 14.8" stroke="#0d6e57" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const MARK = `data:image/svg+xml;base64,${btoa(MARK_SVG)}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0a4f3f 0%, #12936f 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MARK} width={96} height={96} alt="" />
          <div style={{ fontSize: 56, fontWeight: 800, marginLeft: 24, letterSpacing: -1 }}>
            Kerbly
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5 }}>
            Compliant Rightmove listings in 20 seconds.
          </div>
          <div style={{ fontSize: 30, marginTop: 24, opacity: 0.9 }}>
            One brief, every channel, a compliance check on every word.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            background: "rgba(255,255,255,0.15)",
            borderRadius: 999,
            padding: "12px 24px",
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          DMCC Act 2024  |  NTSELAT  |  Equality Act  —  checked automatically
        </div>
      </div>
    ),
    { ...size },
  );
}
