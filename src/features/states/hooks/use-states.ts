import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthFetch } from "@/features/auth";
import { toast } from "@/hooks/use-toast";
import type { ProductStateItem } from "../types";

const PAGE_SIZE = 10;

interface StatesResponse {
  data: ProductStateItem[];
  pagination: { total: number; page: number; pageSize: number; totalPages: number };
}

export function useStates(page: number) {
  const authFetch = useAuthFetch();

  const { data: response, isLoading } = useQuery<StatesResponse>({
    queryKey: ["states", "list", page],
    queryFn: async () => {
      const res = await authFetch(`/api/states?page=${page}&pageSize=${PAGE_SIZE}`);
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
  });

  return {
    states: response?.data ?? [],
    pagination: response?.pagination,
    isLoading,
  };
}

export function useActiveStates() {
  const authFetch = useAuthFetch();

  const { data: states = [] } = useQuery<ProductStateItem[]>({
    queryKey: ["states-active"],
    queryFn: async () => {
      const res = await authFetch("/api/states");
      if (!res.ok) throw new Error("Error");
      return (await res.json()).filter((s: ProductStateItem) => s.isActive !== false);
    },
  });

  return { states };
}

export function useStateMutations() {
  const authFetch = useAuthFetch();
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["states"] });

  const createMutation = useMutation({
    mutationFn: async ({ name, section }: { name: string; section: string | null }) => {
      const res = await authFetch("/api/states", { method: "POST", body: JSON.stringify({ name, section }) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
    },
    onSuccess: () => { invalidate(); toast({ title: "Estado creado" }); },
    onError: (err: Error) => { toast({ title: err.message, variant: "destructive" }); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name, section }: { id: string; name: string; section: string | null }) => {
      const res = await authFetch(`/api/states/${id}`, { method: "PUT", body: JSON.stringify({ name, section }) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
    },
    onSuccess: () => { invalidate(); toast({ title: "Estado actualizado" }); },
    onError: (err: Error) => { toast({ title: err.message, variant: "destructive" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authFetch(`/api/states/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error");
    },
    onSuccess: () => { invalidate(); toast({ title: "Estado desactivado" }); },
  });

  const reactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authFetch(`/api/states/${id}`, { method: "PUT", body: JSON.stringify({ isActive: true }) });
      if (!res.ok) throw new Error("Error al reactivar estado");
    },
    onSuccess: () => { invalidate(); toast({ title: "Estado reactivado" }); },
  });

  return { createMutation, updateMutation, deleteMutation, reactivateMutation };
}
