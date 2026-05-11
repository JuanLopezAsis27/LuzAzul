import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest, context: { params: Promise<{ size: string }> }) {
  const { size } = await context.params;
  const dim = parseInt(size, 10) || 192;
  const radius = Math.round(dim * 0.2);
  const circleOuter = Math.round(dim * 0.33);
  const circleInner = Math.round(dim * 0.155);
  const fontSize = Math.round(dim * 0.178);

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f172a",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: radius,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: Math.round(dim * 0.022),
          }}
        >
          <div
            style={{
              width: circleOuter,
              height: circleOuter,
              borderRadius: "50%",
              background: "rgba(96,165,250,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: circleInner,
                height: circleInner,
                background: "#60a5fa",
                borderRadius: "50%",
              }}
            />
          </div>
          <span style={{ color: "#60a5fa", fontSize, fontWeight: 700, letterSpacing: -2 }}>LA</span>
        </div>
      </div>
    ),
    { width: dim, height: dim }
  );
}
