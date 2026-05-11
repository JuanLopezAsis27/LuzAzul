import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthFetch } from "@/features/auth";
import { toast } from "@/hooks/use-toast";
import type { BranchItem } from "../types";

const PAGE_SIZE = 10;

interface BranchesResponse {
  data: BranchItem[];
  pagination: { total: number; page: number; pageSize: number; totalPages: number };
}

export function useBranches(page: number) {
  const authFetch = useAuthFetch();

  const { data: response, isLoading } = useQuery<BranchesResponse>({
    queryKey: ["branches", "list", page],
    queryFn: async () => {
      const res = await authFetch(`/api/branches?page=${page}&pageSize=${PAGE_SIZE}`);
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
  });

  return {
    branches: response?.data ?? [],
    pagination: response?.pagination,
    isLoading,
  };
}

export function useBranchMutations() {
  const authFetch = useAuthFetch();
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["branches"] });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; address: string }) => {
      const res = await authFetch("/api/branches", { method: "POST", body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
      return res.json();
    },
    onSuccess: () => { invalidate(); toast({ title: "Sucursal creada" }); },
    onError: (err: Error) => { toast({ title: err.message, variant: "destructive" }); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const res = await authFetch(`/api/branches/${id}`, { method: "PUT", body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
    },
    onSuccess: () => { invalidate(); toast({ title: "Sucursal actualizada" }); },
    onError: (err: Error) => { toast({ title: err.message, variant: "destructive" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authFetch(`/api/branches/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error");
    },
    onSuccess: () => { invalidate(); toast({ title: "Sucursal desactivada" }); },
  });

  const reactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authFetch(`/api/branches/${id}`, { method: "PUT", body: JSON.stringify({ isActive: true }) });
      if (!res.ok) throw new Error("Error al reactivar sucursal");
    },
    onSuccess: () => { invalidate(); toast({ title: "Sucursal reactivada" }); },
  });

  return { createMutation, updateMutation, deleteMutation, reactivateMutation };
}
