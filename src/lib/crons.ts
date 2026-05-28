import cron from "node-cron";
import { prisma } from "./db";
import { getArgentinaDateStr, getArgentinaDateUTC } from "./utils";

async function closeLoads() {
  try {
    const today = getArgentinaDateUTC(getArgentinaDateStr());
    const result = await prisma.dailyLoad.updateMany({
      where: { isClosed: false, date: { lt: today } },
      data: { isClosed: true },
    });
    console.log(
      `[CRON] Closed ${result.count} loads on ${getArgentinaDateStr()}`
    );
  } catch (error) {
    console.error("[CRON] Error closing loads:", error);
  }
}

export function initializeCrons() {
  if (typeof window !== "undefined") return;

  console.log("[CRON] Initializing cron jobs");

  // Run daily at 00:00 Argentina time (03:00 UTC)
  cron.schedule("0 3 * * *", closeLoads, {
    timezone: "UTC",
  });

  console.log("[CRON] Cron jobs initialized");
}
