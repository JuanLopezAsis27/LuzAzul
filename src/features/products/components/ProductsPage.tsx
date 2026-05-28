"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search, Pencil, Package, Loader2, Trash2, Barcode, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductItem, ProductFormData } from "../types";
import { useProducts, useProductMutations } from "../hooks/use-products";

const emptyForm: ProductFormData = { code: "", name: "", description: "", label: "", barcode: "" };
const NULLABLE_FIELDS = ["description", "label", "barcode"] as const;

export function ProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);

  const { products, pagination, isLoading } = useProducts(search, page);
  const { createMutation, updateMutation, deleteMutation, reactivateMutation } = useProductMutations();

  function openCreate() { setEditingProduct(null); setFormData(emptyForm); setIsDialogOpen(true); }
  function openEdit(p: ProductItem) {
    setEditingProduct(p);
    setFormData({ code: p.code, name: p.name, description: p.description || "", label: p.label || "", barcode: p.barcode || "" });
    setIsDialogOpen(true);
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const sanitizedData = { ...formData };
    for (const field of NULLABLE_FIELDS) {
      if (sanitizedData[field] === "") {
        (sanitizedData as Record<string, unknown>)[field] = null;
      }
    }

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: sanitizedData }, {
        onSuccess: () => { setIsDialogOpen(false); setEditingProduct(null); },
      });
    } else {
      createMutation.mutate(sanitizedData, {
        onSuccess: () => { setIsDialogOpen(false); setFormData(emptyForm); },
      });
    }
  }
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Package className="w-5 h-5 text-primary" /></div>
            Base de Datos de Productos
          </h1>
          <p className="text-muted-foreground mt-1">{pagination?.total ?? 0} productos en total</p>
        </div>
        <Button onClick={openCreate} id="btn-create-product"><Plus className="w-4 h-4 mr-2" />Nuevo Producto</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, código, etiqueta o código de barras..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10"
              id="input-search-products"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden sm:table-cell">Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="hidden md:table-cell">Etiqueta</TableHead>
                    <TableHead className="hidden md:table-cell">Código de Barras</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No se encontraron productos</TableCell></TableRow>
                  ) : products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="hidden sm:table-cell">
                        <code className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">{p.code}</code>
                      </TableCell>
                      <TableCell>
                        <div>
                          <code className="sm:hidden text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono mb-1 inline-block">{p.code}</code>
                          <span className="font-medium block">{p.name}</span>
                          {p.label && <span className="sm:hidden text-xs text-muted-foreground">{p.label}</span>}
                          {p.description && <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{p.description}</p>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {p.label ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-secondary/10 text-secondary">{p.label}</span> : <span className="text-muted-foreground text-xs">—</span>}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {p.barcode ? <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-mono"><Barcode className="w-3 h-3" />{p.barcode}</span> : <span className="text-muted-foreground text-xs">—</span>}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${p.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>{p.isActive ? "Activo" : "Inactivo"}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                          {p.isActive
                            ? <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(p.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                            : <Button variant="ghost" size="icon" onClick={() => reactivateMutation.mutate(p.id)} className="text-emerald-400 hover:text-emerald-400" title="Reactivar producto"><RotateCcw className="w-4 h-4" /></Button>
                          }
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}><ChevronLeft className="w-4 h-4" /></Button>
          <span className="text-sm text-muted-foreground">Página {page} de {pagination.totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(Math.min(pagination.totalPages, page + 1))} disabled={page === pagination.totalPages}><ChevronRight className="w-4 h-4" /></Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="product-code">Código *</Label><Input id="product-code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required placeholder="LA001" /></div>
              <div className="space-y-2"><Label htmlFor="product-barcode">Código de Barras</Label><Input id="product-barcode" value={formData.barcode} onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} placeholder="7790001000011" /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="product-name">Nombre *</Label><Input id="product-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="Leche Entera 1L" /></div>
            <div className="space-y-2"><Label htmlFor="product-desc">Descripción</Label><Input id="product-desc" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="product-label">Etiqueta</Label><Input id="product-label" value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} placeholder="Lácteos, Quesos, etc." /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isPending}>{isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{editingProduct ? "Guardar" : "Crear"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
