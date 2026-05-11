"use client";

import { useAuth } from "@/features/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Package, ClipboardList, TrendingUp, AlertTriangle, Gift, Coffee, Loader2 } from "lucide-react";
import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-stats";

const UNIT_ABBR: Record<string, string> = { GRAMOS: "g", KILOGRAMOS: "kg", LITROS: "L", UNIDAD: "u" };

interface UnitTotal { unit: string; total: number; }

function formatSectionTotals(totals: UnitTotal[]): string {
  if (!totals || totals.length === 0) return "0";
  return totals.map((t) => `${t.total.toLocaleString("es-AR")} ${UNIT_ABBR[t.unit] ?? t.unit}`).join(" / ");
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, isLoading } = useDashboardStats();

  const statCards = [
    { label: "Usuarios Activos", value: stats?.usersCount, icon: Users, color: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/20", roles: ["SUPER_ADMIN"] },
    { label: "Sucursales", value: stats?.branchesCount, icon: Building2, color: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/20", roles: ["SUPER_ADMIN"] },
    { label: "Productos", value: stats?.productsCount, icon: Package, color: "from-violet-500 to-violet-600", shadow: "shadow-violet-500/20", roles: ["SUPER_ADMIN"] },
    { label: "Cargas de Hoy", value: stats?.todayLoadsCount, icon: ClipboardList, color: "from-amber-500 to-amber-600", shadow: "shadow-amber-500/20", roles: ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"] },
  ].filter((s) => user && s.roles.includes(user.role) && s.value !== null && s.value !== undefined);

  const sectionCards = [
    { label: "Mermas", description: "Productos con pérdida registrados hoy", icon: AlertTriangle, key: "MERMA" as const, color: "text-red-400", bg: "bg-red-500/10" },
    { label: "Donaciones", description: "Productos destinados a donación hoy", icon: Gift, key: "DONACION" as const, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Refrigerio", description: "Consumo interno del personal hoy", icon: Coffee, key: "REFRIGERIO" as const, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-8 pb-6 md:pb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Bienvenido, <span className="gradient-text">{user?.name}</span>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {user?.branch ? `${user.branch.name} — ` : ""}
          Resumen del día{" "}
          {new Date().toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="hover-lift border-white/5 bg-white/[0.02]">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl md:text-3xl font-bold mt-1">{stat.value ?? "—"}</p>
                      </div>
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.color} ${stat.shadow} shadow-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      <span>Actualizado en tiempo real</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div>
            <h2 className="text-base md:text-xl font-semibold mb-3">Registros del Día</h2>
            <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
              {sectionCards.map((section) => {
                const Icon = section.icon;
                const totals = stats?.sections[section.key] ?? [];
                return (
                  <Card key={section.label} className="hover-lift border-white/5 bg-white/[0.02]">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${section.bg} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${section.color}`} />
                        </div>
                        <CardTitle className="text-base">{section.label}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold leading-tight">{formatSectionTotals(totals)}</p>
                      <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
