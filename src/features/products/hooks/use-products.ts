import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthFetch } from "@/features/auth";
import { toast } from "@/hooks/use-toast";
import type { ProductItem, ProductFormData } from "../types";

const PAGE_SIZE = 10;

interface ProductsResponse {
  data: ProductItem[];
  pagination: { total: number; page: number; pageSize: number; totalPages: number };
}

export interface ActiveProduct { id: string; name: string; code: string; }

export function useProducts(search: string, page: number) {
  const authFetch = useAuthFetch();

  const { data: response, isLoading } = useQuery<ProductsResponse>({
    queryKey: ["products", "list", search, page],
    queryFn: async () => {
      const params = new URLSearchParams({ active: "false", page: page.toString(), pageSize: PAGE_SIZE.toString() });
      if (search) params.set("search", search);
      const res = await authFetch(`/api/products?${params}`);
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
  });

  return {
    products: response?.data ?? [],
    pagination: response?.pagination,
    isLoading,
  };
}

export function useActiveProducts(search: string) {
  const authFetch = useAuthFetch();

  const { data: products = [] } = useQuery<ActiveProduct[]>({
    queryKey: ["products-active", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await authFetch(`/api/products?${params}`);
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
  });

  return { products };
}

export function useProductMutations() {
  const authFetch = useAuthFetch();
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["products"] });

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const res = await authFetch("/api/products", { method: "POST", body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
      return res.json();
    },
    onSuccess: () => { invalidate(); toast({ title: "Producto creado" }); },
    onError: (err: Error) => { toast({ title: err.message, variant: "destructive" }); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const res = await authFetch(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
      return res.json();
    },
    onSuccess: () => { invalidate(); toast({ title: "Producto actualizado" }); },
    onError: (err: Error) => { toast({ title: err.message, variant: "destructive" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authFetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error");
    },
    onSuccess: () => { invalidate(); toast({ title: "Producto desactivado" }); },
  });

  const reactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authFetch(`/api/products/${id}`, { method: "PUT", body: JSON.stringify({ isActive: true }) });
      if (!res.ok) throw new Error("Error al reactivar producto");
    },
    onSuccess: () => { invalidate(); toast({ title: "Producto reactivado" }); },
  });

  return { createMutation, updateMutation, deleteMutation, reactivateMutation };
}
