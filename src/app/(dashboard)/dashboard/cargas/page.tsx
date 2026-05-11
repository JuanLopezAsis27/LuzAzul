"use client";

import { useAuth } from "@/features/auth";
import { LoadsPage } from "@/features/loads/components/LoadsPage";
import { AdminLoadsCalendar } from "@/features/loads/components/AdminLoadsCalendar";

export default function Page() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === "EMPLOYEE") return <LoadsPage />;
  return <AdminLoadsCalendar />;
}
