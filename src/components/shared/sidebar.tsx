"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth";
import { PWAInstallButton } from "./PWAInstallButton";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  Tags,
  ClipboardList,
  BarChart3,
  LogOut,
  ChevronRight,
  History,
  UserCircle,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutGrid,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
  mobileOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"] },
  { label: "Usuarios", href: "/dashboard/usuarios", icon: Users, roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Sucursales", href: "/dashboard/sucursales", icon: Building2, roles: ["SUPER_ADMIN"] },
  { label: "Productos", href: "/dashboard/productos", icon: Package, roles: ["SUPER_ADMIN"] },
  { label: "Estados", href: "/dashboard/estados", icon: Tags, roles: ["SUPER_ADMIN"] },
  { label: "Cargas Diarias", href: "/dashboard/cargas", icon: ClipboardList, roles: ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"] },
  { label: "Historial", href: "/dashboard/historial", icon: History, roles: ["EMPLOYEE"] },
  { label: "Reportes", href: "/dashboard/reportes", icon: BarChart3, roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Mi Perfil", href: "/dashboard/perfil", icon: UserCircle, roles: ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"], mobileOnly: true },
];

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Administrador",
  EMPLOYEE: "Empleado",
};

const mobileNavItems: NavItem[] = [
  { label: "Inicio", href: "/dashboard", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"] },
  { label: "Cargas", href: "/dashboard/cargas", icon: ClipboardList, roles: ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"] },
  { label: "Historial", href: "/dashboard/historial", icon: History, roles: ["EMPLOYEE"] },
  { label: "Reportes", href: "/dashboard/reportes", icon: BarChart3, roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Usuarios", href: "/dashboard/usuarios", icon: Users, roles: [ "ADMIN"] },
  { label: "Perfil", href: "/dashboard/perfil", icon: UserCircle, roles: ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"] },
];

const gestionLinks = [
  { label: "Productos", href: "/dashboard/productos", icon: Package },
  { label: "Sucursales", href: "/dashboard/sucursales", icon: Building2 },
  { label: "Usuarios", href: "/dashboard/usuarios", icon: Users },
  { label: "Estados", href: "/dashboard/estados", icon: Tags },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showGestion, setShowGestion] = useState(false);

  const filteredNavItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) && !item.mobileOnly : false
  );

  const filteredMobileNavItems = mobileNavItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const gestionActive = gestionLinks.some(
    (l) => pathname === l.href || pathname.startsWith(l.href)
  );

  return (
    <>
      {/* Sidebar desktop */}
      <aside className={cn(
        "hidden md:flex fixed left-0 top-0 z-40 h-screen border-r border-white/5 bg-slate-950/80 backdrop-blur-xl flex-col transition-all duration-300 overflow-hidden",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Logo */}
        <div className={cn("border-b border-white/5 flex items-center", isCollapsed ? "p-3 justify-center" : "p-4 justify-between")}>
          <Link href="/dashboard" className={cn("flex items-center gap-3 group", isCollapsed && "justify-center")}>
            <div className="w-10 h-10 shrink-0 rounded-xl gradient-primary flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
              <img src="/file.jpg" alt="Logo" className="w-10 h-10 rounded-xl" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-lg gradient-text">Luz Azul</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Control de Stock</p>
              </div>
            )}
          </Link>
          {!isCollapsed && (
            <Button variant="ghost" size="icon" onClick={onToggle} className="shrink-0 ml-1" title="Contraer sidebar">
              <PanelLeftClose className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Navegación */}
        <nav className={cn("flex-1 overflow-y-auto space-y-1", isCollapsed ? "p-2" : "p-4")}>
          {filteredNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            if (isCollapsed) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 mx-auto rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full gradient-primary" />
                )}
                <Icon className={cn("w-4 h-4 transition-colors shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="flex-1 truncate">{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 text-primary opacity-60 shrink-0" />}
              </Link>
            );
          })}
        </nav>

        {/* Usuario */}
        <div className={cn("border-t border-white/5", isCollapsed ? "p-2" : "p-4")}>
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <Button variant="ghost" size="icon" onClick={logout} className="w-9 h-9 text-muted-foreground hover:text-destructive" title="Cerrar sesión">
                <LogOut className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onToggle} className="w-9 h-9" title="Expandir sidebar">
                <PanelLeftOpen className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md shrink-0">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-[11px] text-muted-foreground">{user ? roleLabels[user.role] : ""}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-destructive" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </>
          )}
        </div>
      </aside>

      {/* Header mobile */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 border-b border-white/5 bg-slate-950/90 backdrop-blur-xl flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-md shadow-blue-500/20">
            <img src="/file.jpg" alt="Logo" className="w-8 h-8 rounded-xl" />
          </div>
          <span className="font-bold gradient-text">Luz Azul</span>
        </Link>
        <div className="flex items-center gap-2">
          <PWAInstallButton />
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Bottom navigation mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-white/5 bg-slate-950/90 backdrop-blur-xl flex items-center justify-around px-2">
        {filteredMobileNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all duration-200 min-w-[48px] relative",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 gradient-primary rounded-t-full" />
              )}
            </Link>
          );
        })}

        {/* Gestión button — SUPER_ADMIN only */}
        {isSuperAdmin && (
          <button
            onClick={() => setShowGestion((v) => !v)}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all duration-200 min-w-[48px] relative",
              showGestion || gestionActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <LayoutGrid className={cn("w-5 h-5", (showGestion || gestionActive) && "text-primary")} />
            <span className="text-[10px] font-medium">Gestión</span>
            {gestionActive && !showGestion && (
              <div className="absolute bottom-0 w-8 h-0.5 gradient-primary rounded-t-full" />
            )}
          </button>
        )}
      </nav>

      {/* Gestión overlay — SUPER_ADMIN mobile */}
      {showGestion && isSuperAdmin && (
        <div className="md:hidden fixed inset-0 z-[45] flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowGestion(false)}
          />
          {/* Panel */}
          <div className="relative z-10 bg-slate-950 border-t border-white/10 rounded-t-2xl p-6 pb-24">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Gestión del Sistema
              </h3>
              <button
                onClick={() => setShowGestion(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {gestionLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setShowGestion(false)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-5 rounded-xl border transition-colors",
                      isActive
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-white/5 bg-white/[0.02] text-muted-foreground hover:text-foreground hover:border-white/10 hover:bg-white/[0.04]"
                    )}
                  >
                    <Icon className="w-7 h-7" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
