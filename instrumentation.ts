import { initializeCrons } from "@/lib/crons";

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    initializeCrons();
  }
}
