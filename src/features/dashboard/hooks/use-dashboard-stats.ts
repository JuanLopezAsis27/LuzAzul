import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "@/features/auth";

interface UnitTotal { unit: string; total: number; }

export interface DashboardStats {
  usersCount: number | null;
  branchesCount: number | null;
  productsCount: number | null;
  todayLoadsCount: number;
  sections: { MERMA: UnitTotal[]; DONACION: UnitTotal[]; REFRIGERIO: UnitTotal[] };
}

export function useDashboardStats() {
  const authFetch = useAuthFetch();

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await authFetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
    refetchInterval: 60_000,
  });

  return { stats, isLoading };
}
