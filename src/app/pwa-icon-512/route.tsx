import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

function getLogoUri() {
  const svg = fs.readFileSync(path.join(process.cwd(), "public", "icon.svg"), "utf-8");
  const white = svg.replace(/fill="#000000"/g, 'fill="#ffffff"');
  return `data:image/svg+xml;base64,${Buffer.from(white).toString("base64")}`;
}

export function GET() {
  return new ImageResponse(
    (
      <div style={{ background: "#0f172a", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "14%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={getLogoUri()} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt="" />
      </div>
    ),
    { width: 512, height: 512 }
  );
}
