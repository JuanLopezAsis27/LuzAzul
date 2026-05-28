import { prisma } from "./db";
import { getArgentinaDateStr, getArgentinaDateUTC } from "./utils";

async function closeLoads() {
  try {
    const today = getArgentinaDateUTC(getArgentinaDateStr());
    const result = await prisma.dailyLoad.updateMany({
      where: { isClosed: false, date: { lt: today } },
      data: { isClosed: true },
    });
    if (result.count > 0) {
      console.log(
        `[CRON] Closed ${result.count} loads on ${getArgentinaDateStr()}`
      );
    }
  } catch (error) {
    console.error("[CRON] Error closing loads:", error);
  }
}

function getNextCheckTime(): number {
  const now = new Date();
  const argNow = new Date(now.getTime() - 3 * 60 * 60 * 1000);

  // Next check at 00:05 Argentina time (03:05 UTC)
  const nextCheck = new Date(argNow);
  nextCheck.setUTCHours(3, 5, 0, 0);

  if (nextCheck <= now) {
    nextCheck.setUTCDate(nextCheck.getUTCDate() + 1);
  }

  return nextCheck.getTime() - now.getTime();
}

let initialized = false;

export function initializeCrons() {
  if (typeof window !== "undefined" || initialized) return;
  initialized = true;

  console.log("[CRON] Initializing cron service");

  // Run close loads check immediately on startup
  closeLoads();

  // Schedule next check
  function scheduleNextCheck() {
    const delayMs = getNextCheckTime();
    console.log(
      `[CRON] Next check scheduled in ${Math.round(delayMs / 1000 / 60)} minutes`
    );

    setTimeout(() => {
      closeLoads();
      scheduleNextCheck();
    }, delayMs);
  }

  scheduleNextCheck();
  console.log("[CRON] Cron service initialized");
}

