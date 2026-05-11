"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Building2, Loader2, Trash2, MapPin, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import type { BranchItem } from "../types";
import { useBranches, useBranchMutations } from "../hooks/use-branches";

const PAGE_SIZE = 10;

export function BranchesPage() {
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchItem | null>(null);
  const [formData, setFormData] = useState({ name: "", address: "" });

  const { branches, pagination, isLoading } = useBranches(page);
  const { createMutation, updateMutation, deleteMutation, reactivateMutation } = useBranchMutations();

  function openCreate() { setEditingBranch(null); setFormData({ name: "", address: "" }); setIsDialogOpen(true); }
  function openEdit(b: BranchItem) { setEditingBranch(b); setFormData({ name: b.name, address: b.address || "" }); setIsDialogOpen(true); }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingBranch) {
      updateMutation.mutate({ id: editingBranch.id, data: formData }, {
        onSuccess: () => { setIsDialogOpen(false); setEditingBranch(null); },
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => { setIsDialogOpen(false); setFormData({ name: "", address: "" }); },
      });
    }
  }
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Building2 className="w-5 h-5 text-emerald-400" /></div>
            Gestión de Sucursales
          </h1>
          <p className="text-muted-foreground mt-1">Alta y configuración de sucursales</p>
        </div>
        <Button onClick={openCreate} variant="gradient" id="btn-create-branch"><Plus className="w-4 h-4 mr-2" />Nueva Sucursal</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : branches.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">No hay sucursales registradas</div>
        ) : branches.map((b) => (
          <Card key={b.id} className="border-white/5 bg-white/[0.02] hover-lift">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20"><Building2 className="w-6 h-6 text-white" /></div>
                  <div>
                    <h3 className="font-semibold">{b.name}</h3>
                    {b.address && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{b.address}</p>}
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${b.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>{b.isActive ? "Activa" : "Inactiva"}</span>
              </div>
                <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{b._count.users} usuarios asignados</p>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="w-4 h-4" /></Button>
                  {b.isActive
                    ? <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(b.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    : <Button variant="ghost" size="icon" onClick={() => reactivateMutation.mutate(b.id)} className="text-emerald-400 hover:text-emerald-400" title="Reactivar sucursal"><RotateCcw className="w-4 h-4" /></Button>
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}><ChevronLeft className="w-4 h-4" /></Button>
          <span className="text-sm text-muted-foreground">Página {page} de {pagination.totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(Math.min(pagination.totalPages, page + 1))} disabled={page === pagination.totalPages}><ChevronRight className="w-4 h-4" /></Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-white/10 bg-slate-950">
          <DialogHeader><DialogTitle>{editingBranch ? "Editar Sucursal" : "Nueva Sucursal"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="branch-name">Nombre</Label><Input id="branch-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="bg-white/5 border-white/10" /></div>
            <div className="space-y-2"><Label htmlFor="branch-address">Dirección (opcional)</Label><Input id="branch-address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="bg-white/5 border-white/10" /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" variant="gradient" disabled={isPending}>{isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{editingBranch ? "Guardar" : "Crear"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

