import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthFetch } from "@/features/auth";
import { toast } from "@/hooks/use-toast";
import type { DailyLoadRecord, LoadSection } from "../types";

export interface PendingItem {
  section: LoadSection;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  unit: string;
  stateId: string | null;
  stateName: string;
}

type SubmitItem = Pick<PendingItem, "section" | "productId" | "quantity" | "unit" | "stateId">;

function getStorageKey(userId: string): string {
  const date = new Date(new Date().getTime() - 3 * 60 * 60 * 1000).toISOString().split("T")[0];
  return `pending-load-${date}-${userId}`;
}

export function useDailyLoad() {
  const authFetch = useAuthFetch();

  const { data: dailyLoad, isLoading } = useQuery<DailyLoadRecord | null>({
    queryKey: ["daily-load-today"],
    queryFn: async () => {
      const res = await authFetch("/api/daily-loads");
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
  });

  return { dailyLoad, isLoading };
}

export function usePendingItems(userId: string | undefined) {
  const storageKey = userId ? getStorageKey(userId) : "";
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!userId || loaded) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setPendingItems(JSON.parse(raw) as PendingItem[]);
    } catch { /* ignore */ }
    setLoaded(true);
  }, [userId, storageKey, loaded]);

  useEffect(() => {
    if (!loaded) return;
    try {
      if (pendingItems.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(pendingItems));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch { /* storage unavailable */ }
  }, [pendingItems, storageKey, loaded]);

  return { pendingItems, setPendingItems };
}

export function useLoadMutations() {
  const authFetch = useAuthFetch();
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["daily-load-today"] });
    queryClient.invalidateQueries({ queryKey: ["web-history"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
  };

  const submitMutation = useMutation({
    mutationFn: async (items: SubmitItem[]) => {
      const res = await authFetch("/api/daily-loads", {
        method: "POST",
        body: JSON.stringify({ items }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
      return res.json();
    },
    onSuccess: () => { invalidate(); toast({ title: "Carga enviada exitosamente" }); },
    onError: (err: Error) => { toast({ title: err.message, variant: "destructive" }); },
  });

  const closeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authFetch(`/api/daily-loads/${id}`, { method: "PUT" });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
    },
    onSuccess: () => { invalidate(); toast({ title: "Planilla cerrada exitosamente" }); },
    onError: (err: Error) => { toast({ title: err.message, variant: "destructive" }); },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async ({ loadId, itemId }: { loadId: string; itemId: string }) => {
      const res = await authFetch(`/api/daily-loads/${loadId}?itemId=${itemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error");
    },
    onSuccess: () => { invalidate(); toast({ title: "Item eliminado" }); },
  });

  return { submitMutation, closeMutation, deleteItemMutation };
}
