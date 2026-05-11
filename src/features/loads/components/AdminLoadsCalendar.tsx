"use client";

import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthFetch } from "@/features/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, ChevronLeft, ChevronRight, Calendar, AlertTriangle, Gift, Coffee, X, Building2, User, Download, Maximize2, ChevronDown, ChevronUp, LockOpen } from "lucide-react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import * as XLSX from "xlsx";

interface LoadItem { id: string; section: string; quantity: number; unit: string; product: { id: string; name: string; code: string }; state: { id: string; name: string } | null; }
interface DailyLoadEntry { id: string; date: string; isClosed: boolean; items: LoadItem[]; user: { id: string; name: string }; branch: { id: string; name: string }; }

const sectionConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType; fill: string }> = {
  MERMA: { label: "Merma", color: "text-red-400", bg: "bg-red-500/10", icon: AlertTriangle, fill: "#f87171" },
  DONACION: { label: "Donación", color: "text-emerald-400", bg: "bg-emerald-500/10", icon: Gift, fill: "#34d399" },
  REFRIGERIO: { label: "Refrigerio", color: "text-amber-400", bg: "bg-amber-500/10", icon: Coffee, fill: "#fbbf24" },
};

const UNIT_ABBR: Record<string, string> = { GRAMOS: "g", KILOGRAMOS: "kg", LITROS: "L", UNIDAD: "u" };
const UNIT_CHART_LABEL: Record<string, string> = { g: "Gramos (g)", L: "Litros (L)", u: "Unidades (u)" };
const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// Argentina is UTC-3 (no DST)
function getArgentinaDateStr(date?: Date): string {
  const d = date ?? new Date();
  const argTime = new Date(d.getTime() - 3 * 60 * 60 * 1000);
  return argTime.toISOString().split("T")[0];
}

function getBaseUnit(unit: string): string {
  if (unit === "GRAMOS" || unit === "KILOGRAMOS") return "g";
  if (unit === "LITROS") return "L";
  return "u";
}

function normalize(qty: number, unit: string): number {
  return unit === "KILOGRAMOS" ? qty * 1000 : qty;
}

function downloadDayExcel(date: string, loads: DailyLoadEntry[]) {
  const rows: unknown[][] = [
    ["Fecha", "Sucursal", "Empleado", "Sección", "Código", "Producto", "Cantidad", "Unidad", "Estado"],
  ];
  for (const load of loads) {
    for (const item of load.items) {
      rows.push([
        new Date(date + "T12:00:00").toLocaleDateString("es-AR"),
        load.branch.name,
        load.user.name,
        sectionConfig[item.section]?.label ?? item.section,
        item.product.code,
        item.product.name,
        item.quantity,
        UNIT_ABBR[item.unit] ?? item.unit,
        item.state?.name ?? "—",
      ]);
    }
  }
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Cargas");
  XLSX.writeFile(wb, `cargas_${date}.xlsx`);
}

function CollapsibleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02]">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function DayStats({ loads }: { loads: DailyLoadEntry[] }) {
  const tooltipStyle = { backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#e2e8f0" };

  const sectionTotalsByUnit = useMemo(() => {
    const result: Record<string, Record<string, number>> = {};
    for (const load of loads) {
      for (const item of load.items) {
        const baseUnit = getBaseUnit(item.unit);
        if (!result[baseUnit]) result[baseUnit] = { MERMA: 0, DONACION: 0, REFRIGERIO: 0 };
        if (item.section in result[baseUnit]) {
          result[baseUnit][item.section] += normalize(item.quantity, item.unit);
        }
      }
    }
    return result;
  }, [loads]);

  const productStatsByUnit = useMemo(() => {
    const byUnit: Record<string, Record<string, Record<string, { name: string; code: string; total: number }>>> = {};
    for (const load of loads) {
      for (const item of load.items) {
        const baseUnit = getBaseUnit(item.unit);
        const sec = item.section;
        if (!byUnit[baseUnit]) byUnit[baseUnit] = {};
        if (!byUnit[baseUnit][sec]) byUnit[baseUnit][sec] = {};
        const key = item.product.id;
        if (!byUnit[baseUnit][sec][key]) byUnit[baseUnit][sec][key] = { name: item.product.name, code: item.product.code, total: 0 };
        byUnit[baseUnit][sec][key].total += normalize(item.quantity, item.unit);
      }
    }
    const final: Record<string, Record<string, { name: string; code: string; total: number }[]>> = {};
    for (const [unit, sections] of Object.entries(byUnit)) {
      final[unit] = {};
      for (const [sec, products] of Object.entries(sections)) {
        final[unit][sec] = Object.values(products).sort((a, b) => b.total - a.total).slice(0, 8);
      }
    }
    return final;
  }, [loads]);

  const totalItems = loads.reduce((sum, l) => sum + l.items.length, 0);
  const sectionKeys = ["MERMA", "DONACION", "REFRIGERIO"] as const;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {sectionKeys.map((sec) => {
          const cfg = sectionConfig[sec];
          const Icon = cfg.icon;
          const count = loads.reduce((sum, l) => sum + l.items.filter((i) => i.section === sec).length, 0);
          return (
            <div key={sec} className={`rounded-lg p-3 ${cfg.bg} flex flex-col gap-1`}>
              <Icon className={`w-4 h-4 ${cfg.color}`} />
              <p className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</p>
              <p className="text-sm font-bold">{count} items</p>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">{loads.length} planilla{loads.length !== 1 ? "s" : ""} · {totalItems} items totales</p>

      {/* Section totals divided by unit */}
      {Object.entries(sectionTotalsByUnit).map(([unit, sections]) => {
        const chartData = Object.entries(sections)
          .filter(([, v]) => v > 0)
          .map(([sec, total]) => ({ name: sectionConfig[sec]?.label ?? sec, total, fill: sectionConfig[sec]?.fill ?? "#888" }));
        if (chartData.length === 0) return null;
        return (
          <CollapsibleSection key={`totals-${unit}`} title={`Total por sección — ${UNIT_CHART_LABEL[unit] ?? unit}`}>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} unit={` ${unit}`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${Number(v ?? 0).toLocaleString("es-AR")} ${unit}`, "Total"]} />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CollapsibleSection>
        );
      })}

      {/* Product stats divided by unit, 2-col grid */}
      {Object.entries(productStatsByUnit).map(([unit, sections]) => {
        const hasData = Object.values(sections).some((d) => d.length > 0);
        if (!hasData) return null;
        return (
          <CollapsibleSection key={`products-${unit}`} title={`Top productos — ${UNIT_CHART_LABEL[unit] ?? unit}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sectionKeys.map((sec) => {
                const data = sections[sec] ?? [];
                if (data.length === 0) return null;
                const cfg = sectionConfig[sec];
                return (
                  <div key={sec}>
                    <p className="text-xs font-medium mb-2" style={{ color: cfg.fill }}>{cfg.label}</p>
                    <ResponsiveContainer width="100%" height={Math.max(120, data.length * 26)}>
                      <BarChart data={data} layout="vertical" margin={{ left: 4, right: 16, top: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                        <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} width={110} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${Number(v ?? 0).toLocaleString("es-AR")} ${unit}`, cfg.label]} />
                        <Bar dataKey="total" fill={cfg.fill} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                );
              })}
            </div>
          </CollapsibleSection>
        );
      })}
    </div>
  );
}

const LOADS_PAGE_SIZE = 5;

function LoadsByBranch({ loads, onReopen, todayStr }: { loads: DailyLoadEntry[]; onReopen?: (loadId: string) => void; todayStr?: string }) {
  const [loadPage, setLoadPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(loads.length / LOADS_PAGE_SIZE));
  const paginated = loads.slice((loadPage - 1) * LOADS_PAGE_SIZE, loadPage * LOADS_PAGE_SIZE);

  const byBranch = useMemo(() => {
    const map: Record<string, { branchName: string; loads: DailyLoadEntry[] }> = {};
    for (const load of paginated) {
      if (!map[load.branch.id]) map[load.branch.id] = { branchName: load.branch.name, loads: [] };
      map[load.branch.id].loads.push(load);
    }
    return Object.values(map).sort((a, b) => a.branchName.localeCompare(b.branchName));
  }, [paginated]);

  return (
    <div className="space-y-4">
      {byBranch.map((branch) => (
        <div key={branch.branchName}>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm font-semibold">{branch.branchName}</span>
          </div>
          <div className="space-y-2 pl-5">
            {branch.loads.map((load) => (
              <div key={load.id} className="rounded-lg border border-white/5 bg-white/[0.02] p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <User className="w-3 h-3 text-muted-foreground" />
                  <span className="font-medium">{load.user.name}</span>
                  <div className="ml-auto flex items-center gap-1">
                    {load.isClosed && (
                      <span className="text-xs bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded-full">Cerrada</span>
                    )}
                    {load.isClosed && onReopen && todayStr && load.date.split("T")[0] === todayStr && (
                      <button
                        onClick={() => onReopen(load.id)}
                        title="Reabrir planilla"
                        className="flex items-center gap-1 text-xs bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 px-1.5 py-0.5 rounded-full transition-colors"
                      >
                        <LockOpen className="w-3 h-3" />Reabrir
                      </button>
                    )}
                  </div>
                </div>
                {load.items.length > 0 ? (
                  <div className="space-y-1">
                    {(["MERMA", "DONACION", "REFRIGERIO"] as const).map((section) => {
                      const items = load.items.filter((i) => i.section === section);
                      if (items.length === 0) return null;
                      const cfg = sectionConfig[section];
                      const Icon = cfg.icon;
                      return (
                        <div key={section} className={`flex items-center gap-2 text-xs ${cfg.bg} rounded px-2 py-1`}>
                          <Icon className={`w-3 h-3 ${cfg.color}`} />
                          <span className={cfg.color}>{cfg.label}</span>
                          <span className="ml-auto text-muted-foreground">{items.length} items</span>
                        </div>
                      );
                    })}
                    <div className="pt-1">
                      {load.items.map((item) => (
                        <div key={item.id} className="text-xs text-muted-foreground flex justify-between py-0.5 border-b border-white/5 last:border-0">
                          <span className="truncate">{item.product.code} — {item.product.name}</span>
                          <span className="ml-2 shrink-0">{item.quantity} {UNIT_ABBR[item.unit] ?? item.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Sin items</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setLoadPage(Math.max(1, loadPage - 1))}
            disabled={loadPage === 1}
            className="p-1 rounded hover:bg-white/5 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-muted-foreground">Página {loadPage} de {totalPages}</span>
          <button
            onClick={() => setLoadPage(Math.min(totalPages, loadPage + 1))}
            disabled={loadPage === totalPages}
            className="p-1 rounded hover:bg-white/5 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export function AdminLoadsCalendar() {
  const authFetch = useAuthFetch();
  const queryClient = useQueryClient();

  // Use Argentina time for initial month/year and today
  const argNow = new Date(new Date().getTime() - 3 * 60 * 60 * 1000);
  const [year, setYear] = useState(argNow.getUTCFullYear());
  const [month, setMonth] = useState(argNow.getUTCMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [reopening, setReopening] = useState<string | null>(null);

  async function reopenLoad(loadId: string) {
    if (reopening) return;
    setReopening(loadId);
    try {
      await authFetch(`/api/daily-loads/${loadId}`, { method: "PUT", body: JSON.stringify({ isClosed: false }) });
      await queryClient.invalidateQueries({ queryKey: ["calendar-loads", year, month] });
    } finally {
      setReopening(null);
    }
  }

  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  const { data: monthData, isLoading } = useQuery<DailyLoadEntry[]>({
    queryKey: ["calendar-loads", year, month],
    queryFn: async () => {
      const params = new URLSearchParams({ startDate, endDate, pageSize: "500", page: "1" });
      const res = await authFetch(`/api/reports/history?${params}`);
      if (!res.ok) throw new Error("Error");
      const json = await res.json();
      return json.data;
    },
  });

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDate(null);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDate(null);
  }

  const loadsByDate: Record<string, DailyLoadEntry[]> = {};
  for (const load of (monthData ?? [])) {
    const dateKey = load.date.split("T")[0];
    if (!loadsByDate[dateKey]) loadsByDate[dateKey] = [];
    loadsByDate[dateKey].push(load);
  }

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarCells: Array<{ day: number; dateStr: string; isCurrentMonth: boolean }> = [];

  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    calendarCells.push({ day: d, dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({ day: d, dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`, isCurrentMonth: true });
  }
  const remaining = 42 - calendarCells.length;
  for (let d = 1; d <= remaining; d++) {
    const m = month === 11 ? 1 : month + 2;
    const y = month === 11 ? year + 1 : year;
    calendarCells.push({ day: d, dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, isCurrentMonth: false });
  }

  const selectedLoads = selectedDate ? (loadsByDate[selectedDate] ?? []) : [];
  // Use Argentina time for today highlight
  const todayStr = getArgentinaDateStr();

  const selectedDateLabel = selectedDate
    ? new Date(selectedDate + "T12:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })
    : "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Calendar className="w-5 h-5 text-blue-400" /></div>
            Cargas por Día
          </h1>
          <p className="text-muted-foreground mt-1">Visualizá las cargas diarias de todas las sucursales</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-white/5 bg-white/[0.02]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{MONTHS[month]} {year}</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {WEEKDAYS.map((d) => (
                    <div key={d} className="text-center text-xs text-muted-foreground py-2 font-medium">{d}</div>
                  ))}
                  {calendarCells.map((cell, i) => {
                    const loads = cell.isCurrentMonth ? (loadsByDate[cell.dateStr] ?? []) : [];
                    const totalItems = loads.reduce((sum, l) => sum + l.items.length, 0);
                    const isSelected = selectedDate === cell.dateStr;
                    const isToday = cell.dateStr === todayStr;
                    return (
                      <button
                        key={i}
                        onClick={() => cell.isCurrentMonth && setSelectedDate(isSelected ? null : cell.dateStr)}
                        disabled={!cell.isCurrentMonth}
                        className={`relative min-h-[60px] rounded-lg p-1.5 text-left transition-all ${
                          !cell.isCurrentMonth ? "opacity-20 cursor-default" :
                          isSelected ? "bg-primary/20 ring-1 ring-primary" :
                          isToday ? "bg-white/10 ring-1 ring-white/20" :
                          loads.length > 0 ? "bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer" :
                          "hover:bg-white/[0.03] cursor-pointer"
                        }`}
                      >
                        <span className={`text-xs font-medium ${isToday ? "text-primary font-bold" : "text-foreground"}`}>{cell.day}</span>
                        {loads.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              <span className="text-[10px] text-muted-foreground">{loads.length} carga{loads.length !== 1 ? "s" : ""}</span>
                            </div>
                            {totalItems > 0 && <span className="text-[10px] text-muted-foreground">{totalItems} items</span>}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          {selectedDate ? (
            <Card className="border-white/5 bg-white/[0.02]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base capitalize">{selectedDateLabel}</CardTitle>
                  <div className="flex items-center gap-1">
                    {selectedLoads.length > 0 && (
                      <>
                        <Button variant="ghost" size="icon" title="Ver detalle completo" onClick={() => setShowDetailDialog(true)}>
                          <Maximize2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Exportar Excel" onClick={() => downloadDayExcel(selectedDate, selectedLoads)}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => setSelectedDate(null)}><X className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                {selectedLoads.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Sin cargas registradas este día</p>
                ) : (
                  <LoadsByBranch key={selectedDate} loads={selectedLoads} onReopen={reopenLoad} todayStr={todayStr} />
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-white/5 bg-white/[0.02]">
              <CardContent className="py-12 text-center">
                <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Seleccioná un día para ver las cargas realizadas</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Diálogo de detalle completo del día */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-white/10 bg-slate-950">
          <DialogHeader>
            <div className="flex items-center justify-between pr-8">
              <DialogTitle className="capitalize">{selectedDateLabel}</DialogTitle>
              {selectedDate && selectedLoads.length > 0 && (
                <Button variant="outline" size="sm" onClick={() => downloadDayExcel(selectedDate, selectedLoads)}>
                  <Download className="w-4 h-4 mr-2" />Exportar .xlsx
                </Button>
              )}
            </div>
          </DialogHeader>
          {selectedLoads.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Sin cargas registradas este día</p>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Estadísticas del día</h3>
                <DayStats loads={selectedLoads} />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Detalle por sucursal</h3>
                <LoadsByBranch key={selectedDate} loads={selectedLoads} onReopen={reopenLoad} todayStr={todayStr} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
