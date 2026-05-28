import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "@/features/auth";
import type { ReportData } from "../types";
import { useMemo } from "react";

interface Branch { id: string; name: string; }

export interface ReportFilters {
  startDate: string;
  endDate: string;
  branchId: string;
  section: string;
}

export function useReportHistory(filters: ReportFilters, page: number) {
  const authFetch = useAuthFetch();
  const PAGE_SIZE = 10;

  const { data, isLoading } = useQuery<ReportData>({
    queryKey: ["reports-history", filters.startDate, filters.endDate, filters.branchId, filters.section, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.startDate) params.set("startDate", filters.startDate);
      if (filters.endDate) params.set("endDate", filters.endDate);
      if (filters.branchId) params.set("branchId", filters.branchId);
      if (filters.section) params.set("section", filters.section);
      const res = await authFetch(`/api/reports/history?${params}`);
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
  });

    const allItems = useMemo(() =>
    (data?.data ?? []).flatMap((dl) =>
      (dl.items ?? []).map((item) => ({
        ...item,
        date: dl.date,
        userName: dl.user?.name,
        branchName: dl.branch?.name,
      }))
    ), [data]);

    const totalItems = allItems.length;
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    const paginatedItems = allItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return {
      dailyLoads: paginatedItems,
      pagination: {
        total: totalItems,
        page,
        totalPages,
        pageSize: PAGE_SIZE,
      },
      isLoading,
  };
}

export function useReportAllData(filters: Pick<ReportFilters, "startDate" | "endDate" | "branchId">) {
  const authFetch = useAuthFetch();

  const { data, isLoading } = useQuery<ReportData>({
    queryKey: ["reports-all", filters.startDate, filters.endDate, filters.branchId],
    queryFn: async () => {
      const params = new URLSearchParams({ page: "1", pageSize: "1000", startDate: filters.startDate, endDate: filters.endDate });
      if (filters.branchId) params.set("branchId", filters.branchId);
      const res = await authFetch(`/api/reports/history?${params}`);
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
  });

  return { allData: data, isLoadingCharts: isLoading };
}

export function useBranchesForReports(enabled: boolean) {
  const authFetch = useAuthFetch();

  const { data: branches = [] } = useQuery<Branch[]>({
    queryKey: ["branches"],
    queryFn: async () => {
      const res = await authFetch("/api/branches");
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
    enabled,
  });

  return { branches };
}
