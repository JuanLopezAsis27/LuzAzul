import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Argentina is UTC-3 (no DST). Returns "YYYY-MM-DD" in Argentina local time.
function getArgentinaDateStr(): string {
  const d = new Date();
  const argTime = new Date(d.getTime() - 3 * 60 * 60 * 1000);
  return argTime.toISOString().split("T")[0];
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Close all open loads from days strictly before today (Argentina time)
  const today = new Date(getArgentinaDateStr() + "T00:00:00.000Z");

  const result = await prisma.dailyLoad.updateMany({
    where: { isClosed: false, date: { lt: today } },
    data: { isClosed: true },
  });

  return NextResponse.json({ closed: result.count, date: getArgentinaDateStr() });
}
