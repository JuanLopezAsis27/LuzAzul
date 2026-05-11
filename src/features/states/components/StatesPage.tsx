"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Tags, Loader2, Trash2, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductStateItem } from "../types";
import { useStates, useStateMutations } from "../hooks/use-states";

const SECTION_OPTIONS = [
  { value: "", label: "Todas las secciones (genérico)" },
  { value: "MERMA", label: "Mermas" },
  { value: "DONACION", label: "Donaciones" },
  { value: "REFRIGERIO", label: "Refrigerio" },
];

const sectionLabel: Record<string, string> = {
  MERMA: "Mermas",
  DONACION: "Donaciones",
  REFRIGERIO: "Refrigerio",
};

const SELECT_CLASS = "w-full h-10 rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-white [color-scheme:dark]";

export function StatesPage() {
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingState, setEditingState] = useState<ProductStateItem | null>(null);
  const [name, setName] = useState("");
  const [section, setSection] = useState("");

  const { states, pagination, isLoading } = useStates(page);
  const { createMutation, updateMutation, deleteMutation, reactivateMutation } = useStateMutations();

  function openCreate() { setEditingState(null); setName(""); setSection(""); setIsDialogOpen(true); }
  function openEdit(s: ProductStateItem) { setEditingState(s); setName(s.name); setSection(s.section ?? ""); setIsDialogOpen(true); }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const sectionValue = section || null;
    if (editingState) {
      updateMutation.mutate({ id: editingState.id, name, section: sectionValue }, {
        onSuccess: () => { setIsDialogOpen(false); setEditingState(null); },
      });
    } else {
      createMutation.mutate({ name, section: sectionValue }, {
        onSuccess: () => { setIsDialogOpen(false); setName(""); setSection(""); },
      });
    }
  }
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><Tags className="w-5 h-5 text-amber-400" /></div>
            Estados de Productos
          </h1>
          <p className="text-muted-foreground mt-1">Estados personalizados para clasificar productos (ej: vencido, roto, dañado)</p>
        </div>
        <Button onClick={openCreate} variant="gradient" id="btn-create-state"><Plus className="w-4 h-4 mr-2" />Nuevo Estado</Button>
      </div>
      <Card className="border-white/5 bg-white/[0.02]">
        <CardContent className="p-0">
          {isLoading ? (<div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead>Nombre</TableHead>
                  <TableHead>Sección</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {states.length === 0 ? (<TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No hay estados registrados</TableCell></TableRow>) : states.map((s) => (
                  <TableRow key={s.id} className="border-white/5">
                    <TableCell className="font-medium"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400" />{s.name}</div></TableCell>
                    <TableCell><span className="text-sm text-muted-foreground">{s.section ? sectionLabel[s.section] ?? s.section : "Todas las secciones"}</span></TableCell>
                    <TableCell><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${s.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>{s.isActive ? "Activo" : "Inactivo"}</span></TableCell>
                    <TableCell className="text-right"><div className="flex items-center justify-end gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="w-4 h-4" /></Button>{s.isActive ? <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(s.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button> : <Button variant="ghost" size="icon" onClick={() => reactivateMutation.mutate(s.id)} className="text-emerald-400 hover:text-emerald-400" title="Reactivar estado"><RotateCcw className="w-4 h-4" /></Button>}</div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
        <DialogContent className="border-white/10 bg-slate-950">
          <DialogHeader><DialogTitle>{editingState ? "Editar Estado" : "Nuevo Estado"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="state-name">Nombre del Estado</Label>
              <Input id="state-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Vencido, Roto, Dañado..." required className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state-section">Sección</Label>
              <select id="state-section" value={section} onChange={(e) => setSection(e.target.value)} className={SELECT_CLASS}>
                {SECTION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" variant="gradient" disabled={isPending}>{isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{editingState ? "Guardar" : "Crear"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
