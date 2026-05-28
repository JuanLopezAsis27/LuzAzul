"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth, useAuthFetch } from "@/features/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Calendar, Loader2, AlertTriangle, Gift, Coffee, Lock } from "lucide-react";
import { cn, getArgentinaDate, getArgentinaDateStr } from "@/lib/utils";

interface LoadItem {
  id: string;
  section: string;
  quantity: number;
  unit: string;
  product: { id: string; name: string; code: string };
  state: { id: string; name: string } | null;
}

interface DailyLoad {
  id: string;
  date: string;
  isClosed: boolean;
  items: LoadItem[];
  user: { id: string; name: string };
  branch: { id: string; name: string };
}

const sectionConfig = {
  MERMA: { label: "Merma", icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", badgeBg: "bg-red-500/20 text-red-300" },
  DONACION: { label: "Donación", icon: Gift, color: "text-emerald-400", bg: "bg-emerald-500/10", badgeBg: "bg-emerald-500/20 text-emerald-300" },
  REFRIGERIO: { label: "Refrigerio", icon: Coffee, color: "text-amber-400", bg: "bg-amber-500/10", badgeBg: "bg-amber-500/20 text-amber-300" },
} as const;

const UNIT_ABBR: Record<string, string> = { GRAMOS: "g", KILOGRAMOS: "kg", LITROS: "L", UNIDAD: "u" };

type Section = keyof typeof sectionConfig;

export default function HistorialPage() {
  const { user } = useAuth();
  const authFetch = useAuthFetch();

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = getArgentinaDate();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  });

  const [selectedDate, setSelectedDate] = useState<string>(last7Days[0]);

  const { data: dailyLoad, isLoading } = useQuery<DailyLoad | null>({
    queryKey: ["web-history", selectedDate],
    queryFn: async () => {
      const res = await authFetch(`/api/daily-loads?date=${selectedDate}`);
      if (!res.ok) return null;
      const data = await res.json();
      return Array.isArray(data) ? (data[0] ?? null) : data;
    },
  });

  const items = dailyLoad?.items ?? [];

  return (
    <div className="space-y-6 overflow-x-hidden pb-6 md:pb-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <History className="w-5 h-5 text-blue-400" />
          </div>
          Historial de Cargas
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {user?.branch ? `${user.branch.name} — ` : ""}Tus registros de los últimos 7 días
        </p>
      </div>

      {/* Selector de fecha */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {last7Days.map((date) => {
          const d = new Date(date + "T12:00:00Z");
          const isActive = date === selectedDate;
          const isToday = date === last7Days[0];

          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border transition-all duration-200 min-w-[56px] shrink-0",
                isActive
                  ? "bg-primary/15 border-primary/40 text-primary"
                  : "border-white/5 bg-white/[0.02] text-muted-foreground hover:bg-white/5"
              )}
            >
              <span className="text-[10px] font-medium uppercase">
                {d.toLocaleDateString("es-AR", { weekday: "short" })}
              </span>
              <span className={cn("text-lg font-bold leading-none", isActive && "text-primary")}>
                {d.getDate()}
              </span>
              {isToday && (
                <div className={cn("w-1.5 h-1.5 rounded-full mt-0.5", isActive ? "bg-primary" : "bg-muted-foreground")} />
              )}
            </button>
          );
        })}
      </div>

      {/* Contenido */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No hay registros para esta fecha</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header de la planilla */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{items.length} registro{items.length !== 1 ? "s" : ""}</p>
            {dailyLoad?.isClosed ? (
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-medium">
                <Lock className="w-3.5 h-3.5" />Planilla cerrada
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />Planilla abierta
              </div>
            )}
          </div>

          {/* Resumen por sección */}
          <div className="grid grid-cols-3 gap-2">
            {(["MERMA", "DONACION", "REFRIGERIO"] as Section[]).map((sec) => {
              const secItems = items.filter((i) => i.section === sec);
              const config = sectionConfig[sec];
              const Icon = config.icon;
              if (secItems.length === 0) return (
                <div key={sec} className={cn("rounded-xl p-3 flex flex-col gap-1 opacity-30", config.bg)}>
                  <Icon className={cn("w-4 h-4", config.color)} />
                  <p className="text-xs text-muted-foreground">{config.label}</p>
                  <p className="text-sm font-bold">0</p>
                </div>
              );
              return (
                <div key={sec} className={cn("rounded-xl p-3 flex flex-col gap-1", config.bg)}>
                  <Icon className={cn("w-4 h-4", config.color)} />
                  <p className={cn("text-xs font-medium", config.color)}>{config.label}</p>
                  <p className="text-sm font-bold">{secItems.length} ítem{secItems.length !== 1 ? "s" : ""}</p>
                </div>
              );
            })}
          </div>

          {/* Lista de items */}
          <Card className="border-white/5 bg-white/[0.02]">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm text-muted-foreground font-normal">Detalle de registros</CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-2">
              <div className="divide-y divide-white/5">
                {items.map((item) => {
                  const sec = item.section as Section;
                  const config = sectionConfig[sec];
                  return (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-md", config?.badgeBg)}>
                            {config?.label ?? item.section}
                          </span>
                          {item.state && (
                            <span className="text-xs text-muted-foreground">{item.state.name}</span>
                          )}
                        </div>
                        <p className="text-sm font-medium truncate">
                          <code className="text-xs text-muted-foreground mr-1">{item.product.code}</code>
                          {item.product.name}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold">
                          {item.quantity} {UNIT_ABBR[item.unit] ?? item.unit}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
