import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthFetch } from "@/features/auth";
import { toast } from "@/hooks/use-toast";
import type { UserItem, UserFormData } from "../types";

const PAGE_SIZE = 10;

interface UsersResponse {
  data: UserItem[];
  pagination: { total: number; page: number; pageSize: number; totalPages: number };
}

interface Branch { id: string; name: string; }

export function useUsers(search: string, page: number) {
  const authFetch = useAuthFetch();

  const { data: response, isLoading } = useQuery<UsersResponse>({
    queryKey: ["users", "list", search, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: page.toString(), pageSize: PAGE_SIZE.toString() });
      if (search) params.set("search", search);
      const res = await authFetch(`/api/users?${params}`);
      if (!res.ok) throw new Error("Error cargando usuarios");
      return res.json();
    },
  });

  return {
    users: response?.data ?? [],
    pagination: response?.pagination,
    isLoading,
  };
}

export function useBranchesForSelect(enabled: boolean) {
  const authFetch = useAuthFetch();

  const { data: branches = [] } = useQuery<Branch[]>({
    queryKey: ["branches"],
    queryFn: async () => {
      const res = await authFetch("/api/branches");
      if (!res.ok) throw new Error("Error cargando sucursales");
      return res.json();
    },
    enabled,
  });

  return { branches };
}

export function useUserMutations() {
  const authFetch = useAuthFetch();
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["users"] });

  const createMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      const res = await authFetch("/api/users", { method: "POST", body: JSON.stringify({ ...data, branchId: data.branchId || null }) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
      return res.json();
    },
    onSuccess: () => { invalidate(); toast({ title: "Usuario creado exitosamente" }); },
    onError: (err: Error) => { toast({ title: err.message, variant: "destructive" }); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const res = await authFetch(`/api/users/${id}`, { method: "PUT", body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
      return res.json();
    },
    onSuccess: () => { invalidate(); toast({ title: "Usuario actualizado" }); },
    onError: (err: Error) => { toast({ title: err.message, variant: "destructive" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authFetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al desactivar usuario");
    },
    onSuccess: () => { invalidate(); toast({ title: "Usuario desactivado" }); },
  });

  const reactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authFetch(`/api/users/${id}`, { method: "PUT", body: JSON.stringify({ isActive: true }) });
      if (!res.ok) throw new Error("Error al reactivar usuario");
    },
    onSuccess: () => { invalidate(); toast({ title: "Usuario reactivado" }); },
  });

  return { createMutation, updateMutation, deleteMutation, reactivateMutation };
}
