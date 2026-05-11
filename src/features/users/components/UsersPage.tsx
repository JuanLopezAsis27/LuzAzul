"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Search, Pencil, Trash2, Users as UsersIcon, Loader2, UserPlus, RotateCcw, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import type { UserItem, UserFormData } from "../types";
import { useUsers, useBranchesForSelect, useUserMutations } from "../hooks/use-users";

const roleLabels: Record<string, string> = { SUPER_ADMIN: "Super Admin", ADMIN: "Administrador", EMPLOYEE: "Empleado" };
const roleBadgeColors: Record<string, string> = {
  SUPER_ADMIN: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  ADMIN: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  EMPLOYEE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const SELECT_CLASS = "w-full h-10 rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-white [color-scheme:dark]";

interface FormState extends UserFormData {
  confirmPassword: string;
}

function PasswordInput({ id, value, onChange, required, minLength }: {
  id: string; value: string; onChange: (v: string) => void;
  required?: boolean; minLength?: number;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        className="bg-white/5 border-white/10 pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        tabIndex={-1}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [formData, setFormData] = useState<FormState>({
    name: "", email: "", password: "", confirmPassword: "", role: "EMPLOYEE", branchId: "",
  });

  const { users, pagination, isLoading } = useUsers(search, page);
  const { branches } = useBranchesForSelect(isSuperAdmin);
  const { createMutation, updateMutation, deleteMutation, reactivateMutation } = useUserMutations();

  function resetForm() {
    setFormData({
      name: "", email: "", password: "", confirmPassword: "",
      role: "EMPLOYEE",
      branchId: isSuperAdmin ? "" : (currentUser?.branch?.id ?? ""),
    });
  }

  function openCreate() { resetForm(); setEditingUser(null); setIsDialogOpen(true); }
  function openEdit(user: UserItem) {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: "", confirmPassword: "", role: user.role, branchId: user.branch?.id || "" });
    setIsDialogOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formData.password || !editingUser) {
      if (formData.password !== formData.confirmPassword) {
        toast({ title: "Las contraseñas no coinciden", variant: "destructive" });
        return;
      }
    }
    if (editingUser) {
      const data: Record<string, unknown> = { name: formData.name, email: formData.email };
      if (isSuperAdmin) { data.role = formData.role; data.branchId = formData.branchId || null; }
      if (formData.password) data.password = formData.password;
      updateMutation.mutate({ id: editingUser.id, data }, {
        onSuccess: () => { setIsDialogOpen(false); setEditingUser(null); resetForm(); },
      });
    } else {
      const { confirmPassword: _c, ...payload } = formData;
      createMutation.mutate(payload, {
        onSuccess: () => { setIsDialogOpen(false); resetForm(); },
      });
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isEditing = !!editingUser;
  const showConfirmField = !isEditing || !!formData.password;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><UsersIcon className="w-5 h-5 text-blue-400" /></div>
            {isSuperAdmin ? "Gestión de Usuarios" : "Usuarios de mi Sucursal"}
          </h1>
          <p className="text-muted-foreground mt-1">{pagination?.total ?? 0} usuarios en total</p>
        </div>
        <Button onClick={openCreate} variant="gradient" id="btn-create-user"><UserPlus className="w-4 h-4 mr-2" />Nuevo Usuario</Button>
      </div>

      <Card className="border-white/5 bg-white/[0.02]">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar por nombre o email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-10 bg-white/5 border-white/10" id="input-search-users" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/5 bg-white/[0.02]">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead>Nombre</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Rol</TableHead>
                    {isSuperAdmin && <TableHead className="hidden sm:table-cell">Sucursal</TableHead>}
                    <TableHead className="hidden sm:table-cell">Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow><TableCell colSpan={isSuperAdmin ? 6 : 5} className="text-center py-8 text-muted-foreground">No se encontraron usuarios</TableCell></TableRow>
                  ) : users.map((user) => (
                    <TableRow key={user.id} className="border-white/5">
                      <TableCell>
                        <div>
                          <span className="font-medium">{user.name}</span>
                          <p className="text-xs text-muted-foreground md:hidden mt-0.5">{user.email}</p>
                          {isSuperAdmin && <p className="text-xs text-muted-foreground sm:hidden">{user.branch?.name || "Sin sucursal"}</p>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleBadgeColors[user.role]}`}>{roleLabels[user.role]}</span>
                      </TableCell>
                      {isSuperAdmin && <TableCell className="hidden sm:table-cell text-muted-foreground">{user.branch?.name || "—"}</TableCell>}
                      <TableCell className="hidden sm:table-cell">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${user.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>{user.isActive ? "Activo" : "Inactivo"}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(user)} id={`btn-edit-user-${user.id}`}><Pencil className="w-4 h-4" /></Button>
                          {user.isActive
                            ? <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(user.id)} className="text-destructive hover:text-destructive" id={`btn-delete-user-${user.id}`}><Trash2 className="w-4 h-4" /></Button>
                            : <Button variant="ghost" size="icon" onClick={() => reactivateMutation.mutate(user.id)} className="text-emerald-400 hover:text-emerald-400" title="Reactivar usuario" id={`btn-reactivate-user-${user.id}`}><RotateCcw className="w-4 h-4" /></Button>
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
        <DialogContent className="border-white/10 bg-slate-950">
          <DialogHeader><DialogTitle>{isEditing ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="form-name">Nombre</Label>
              <Input id="form-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form-email">Email</Label>
              <Input id="form-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form-password">
                {isEditing ? "Nueva contraseña (dejar vacío para mantener)" : "Contraseña"}
              </Label>
              <PasswordInput
                id="form-password"
                value={formData.password}
                onChange={(v) => setFormData({ ...formData, password: v, confirmPassword: "" })}
                required={!isEditing}
                minLength={6}
              />
            </div>
            {showConfirmField && (
              <div className="space-y-2">
                <Label htmlFor="form-confirm-password">Confirmar contraseña</Label>
                <PasswordInput
                  id="form-confirm-password"
                  value={formData.confirmPassword}
                  onChange={(v) => setFormData({ ...formData, confirmPassword: v })}
                  required={!isEditing || !!formData.password}
                  minLength={6}
                />
              </div>
            )}
            {isSuperAdmin && (
              <div className="space-y-2">
                <Label htmlFor="form-role">Rol</Label>
                <select id="form-role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className={SELECT_CLASS}>
                  <option value="EMPLOYEE">Empleado</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
            )}
            {isSuperAdmin ? (
              <div className="space-y-2">
                <Label htmlFor="form-branch">Sucursal</Label>
                <select id="form-branch" value={formData.branchId} onChange={(e) => setFormData({ ...formData, branchId: e.target.value })} className={SELECT_CLASS}>
                  <option value="">Sin asignar</option>
                  {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Sucursal</Label>
                <p className="text-sm text-muted-foreground px-3 py-2 rounded-md border border-white/10 bg-white/[0.02]">
                  {currentUser?.branch?.name ?? "Sin asignar"}
                </p>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" variant="gradient" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEditing ? "Guardar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
