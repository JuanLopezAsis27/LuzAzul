"use client";

import { useAuth } from "@/features/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Mail, ShieldCheck, MapPin, LogOut, Smartphone, Code2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Administrador",
  EMPLOYEE: "Empleado",
};

const roleColors: Record<string, string> = {
  SUPER_ADMIN: "bg-violet-500/20 text-violet-300",
  ADMIN: "bg-blue-500/20 text-blue-300",
  EMPLOYEE: "bg-emerald-500/20 text-emerald-300",
};

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

export default function PerfilPage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initial = user.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-blue-400" />
          </div>
          Mi Perfil
        </h1>
      </div>

      {/* Avatar + nombre */}
      <Card className="border-white/5 bg-white/[0.02]">
        <CardContent className="p-6 flex flex-col items-center text-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/20">
            {initial}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", roleColors[user.role] ?? "bg-white/10 text-white")}>
            {roleLabels[user.role] ?? user.role}
          </span>
        </CardContent>
      </Card>

      {/* Info personal */}
      <Card className="border-white/5 bg-white/[0.02]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground font-medium">Información de cuenta</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-4">
          <InfoRow icon={Mail} label="Email" value={user.email} />
          <InfoRow icon={ShieldCheck} label="Rol" value={roleLabels[user.role] ?? user.role} />
          <InfoRow icon={MapPin} label="Sucursal" value={(user as { branch?: { name: string } }).branch?.name ?? "Sin asignar"} />
        </CardContent>
      </Card>

      {/* Info de la app */}
      <Card className="border-white/5 bg-white/[0.02]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground font-medium">Acerca de la aplicación</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-4">
          <InfoRow icon={Smartphone} label="Aplicación" value="Luz Azul — Control de Stock" />
          <InfoRow icon={Code2} label="Versión" value="1.0.0" />
          <InfoRow icon={Info} label="Entorno" value={process.env.NODE_ENV === "production" ? "Producción" : "Desarrollo"} />
        </CardContent>
      </Card>

      {/* Cerrar sesión */}
      <Button
        variant="destructive"
        className="w-full"
        onClick={() => {
          if (window.confirm("¿Estás seguro que querés cerrar sesión?")) {
            logout();
          }
        }}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Cerrar Sesión
      </Button>

      <p className="text-center text-xs text-muted-foreground pb-4">
        © {new Date().getFullYear()} Luz Azul — Todos los derechos reservados
      </p>
    </div>
  );
}
