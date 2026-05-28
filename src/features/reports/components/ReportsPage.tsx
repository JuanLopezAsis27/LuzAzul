"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, Download, Filter, Loader2, ChevronLeft, ChevronRight, AlertTriangle, Gift, Coffee, ChevronDown, ChevronUp, Package } from "lucide-react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from "recharts";
import * as XLSX from "xlsx";
import type { ReportDailyLoad } from "../types";
import { useReportHistory, useReportAllData, useBranchesForReports } from "../hooks/use-reports";

const UNIT_ABBR: Record<string, string> = { GRAMOS: "g", KILOGRAMOS: "kg", LITROS: "L", UNIDAD: "u" };
const UNIT_CHART_LABEL: Record<string, string> = { g: "Gramos (g)", L: "Litros (L)", u: "Unidades (u)" };

const sectionLabels: Record<string, { label: string; color: string; fill: string }> = {
  MERMA: { label: "Merma", color: "text-red-400", fill: "#f87171" },
  DONACION: { label: "Donación", color: "text-emerald-400", fill: "#34d399" },
  REFRIGERIO: { label: "Refrigerio", color: "text-amber-400", fill: "#fbbf24" },
};

const productSectionConfig = [
  { key: "MERMA" as const, label: "Mermas", fill: "#f87171" },
  { key: "DONACION" as const, label: "Donaciones", fill: "#34d399" },
  { key: "REFRIGERIO" as const, label: "Refrigerio", fill: "#fbbf24" },
];

function getLast30Days(): [string, string] {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 29);
  return [start.toISOString().split("T")[0], end.toISOString().split("T")[0]];
}

function formatUnitTotals(totals: { unit: string; total: number }[]): string {
  if (!totals.length) return "0";
  return totals.map((t) => `${t.total.toLocaleString("es-AR")} ${UNIT_ABBR[t.unit] ?? t.unit}`).join(" / ");
}

function formatDate(isoStr: string): string {
  const [y, m, d] = isoStr.split("T")[0].split("-");
  return `${d}/${m}/${y}`;
}

type ItemWithContext = {
  id: string; section: string; quantity: number; unit: string;
  product?: { code: string; name: string }; state?: { name: string } | null;
  date: string; userName?: string; branchName?: string;
};

function downloadExcel(items: ItemWithContext[], filename: string) {
  const rows: unknown[][] = [
    ["Fecha", "Empleado", "Sucursal", "Sección", "Código", "Producto", "Cantidad", "Unidad", "Estado"],
  ];
  for (const item of items) {
    rows.push([
      formatDate(item.date),
      item.userName ?? "",
      item.branchName ?? "",
      sectionLabels[item.section]?.label ?? item.section,
      item.product?.code ?? "",
      item.product?.name ?? "",
      item.quantity,
      UNIT_ABBR[item.unit] ?? item.unit,
      item.state?.name ?? "—",
    ]);
  }
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reportes");
  XLSX.writeFile(wb, filename);
}

function CollapsibleSection({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="border-white/5 bg-white/[0.02]">
      <CardHeader className="cursor-pointer select-none" onClick={() => setOpen((v) => !v)}>
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">{icon}{title}</span>
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </CardTitle>
      </CardHeader>
      {open && <CardContent>{children}</CardContent>}
    </Card>
  );
}

export function ReportsPage() {
  const { user } = useAuth();

  const [last30Start, last30End] = getLast30Days();
  const [startDate, setStartDate] = useState(last30Start);
  const [endDate, setEndDate] = useState(last30End);
  const [branchId, setBranchId] = useState("");
  const [section, setSection] = useState("");
  const [page, setPage] = useState(1);

  const { branches } = useBranchesForReports(user?.role === "SUPER_ADMIN");
  const { allData, isLoadingCharts } = useReportAllData({ startDate, endDate, branchId });
  const { dailyLoads, pagination, isLoading } = useReportHistory({ startDate, endDate, branchId, section }, page);

 const allItems = dailyLoads;

  const totalItemCount = useMemo(() =>
    (allData?.data ?? []).reduce((sum: number, dl: ReportDailyLoad) => sum + (dl.items?.length ?? 0), 0),
    [allData]
  );

  const sectionUnitTotals = useMemo(() => {
    const totals: Record<string, Record<string, number>> = { MERMA: {}, DONACION: {}, REFRIGERIO: {} };
    for (const dl of (allData?.data ?? [])) {
      for (const item of (dl.items || [])) {
        if (item.section in totals) {
          const u = item.unit ?? "GRAMOS";
          totals[item.section][u] = (totals[item.section][u] ?? 0) + item.quantity;
        }
      }
    }
    return [
      { name: "Mermas", section: "MERMA", icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", totals: Object.entries(totals.MERMA).map(([unit, total]) => ({ unit, total })) },
      { name: "Donaciones", section: "DONACION", icon: Gift, color: "text-emerald-400", bg: "bg-emerald-500/10", totals: Object.entries(totals.DONACION).map(([unit, total]) => ({ unit, total })) },
      { name: "Refrigerio", section: "REFRIGERIO", icon: Coffee, color: "text-amber-400", bg: "bg-amber-500/10", totals: Object.entries(totals.REFRIGERIO).map(([unit, total]) => ({ unit, total })) },
    ];
  }, [allData]);

  function getBaseUnit(unit: string): string {
    if (unit === "GRAMOS" || unit === "KILOGRAMOS") return "g";
    if (unit === "LITROS") return "L";
    return "u";
  }
  function normalize(qty: number, unit: string): number {
    return unit === "KILOGRAMOS" ? qty * 1000 : qty;
  }

  const barChartsByUnit = useMemo(() => {
    const byUnit: Record<string, { name: string; total: number; fill: string; section: string }[]> = {};
    for (const s of sectionUnitTotals) {
      for (const t of s.totals) {
        const baseUnit = getBaseUnit(t.unit);
        if (!byUnit[baseUnit]) byUnit[baseUnit] = [];
        const existing = byUnit[baseUnit].find((r) => r.section === s.section);
        const value = normalize(t.total, t.unit);
        if (existing) {
          existing.total += value;
        } else {
          byUnit[baseUnit].push({ name: s.name, total: value, fill: sectionLabels[s.section]?.fill ?? "#888", section: s.section });
        }
      }
    }
    return byUnit;
  }, [sectionUnitTotals]);

  const timeSeriesByUnit = useMemo(() => {
    const byUnit: Record<string, Record<string, { date: string; MERMA: number; DONACION: number; REFRIGERIO: number }>> = {};
    for (const dl of (allData?.data ?? [])) {
      const dateKey = dl.date.split("T")[0];
      for (const item of (dl.items || [])) {
        const baseUnit = getBaseUnit(item.unit);
        if (!byUnit[baseUnit]) byUnit[baseUnit] = {};
        if (!byUnit[baseUnit][dateKey]) byUnit[baseUnit][dateKey] = { date: dateKey, MERMA: 0, DONACION: 0, REFRIGERIO: 0 };
        if (item.section in byUnit[baseUnit][dateKey]) {
          byUnit[baseUnit][dateKey][item.section as "MERMA" | "DONACION" | "REFRIGERIO"] += normalize(item.quantity, item.unit);
        }
      }
    }
    const result: Record<string, { date: string; MERMA: number; DONACION: number; REFRIGERIO: number }[]> = {};
    for (const [unit, byDate] of Object.entries(byUnit)) {
      result[unit] = Object.values(byDate)
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((d) => ({ ...d, date: new Date(d.date + "T12:00:00.000Z").toLocaleDateString("es-AR", { day: "numeric", month: "short" }) }));
    }
    return result;
  }, [allData]);

  const productStatsByUnit = useMemo(() => {
    const byUnit: Record<string, Record<string, Record<string, { name: string; code: string; total: number }>>> = {};
    for (const dl of (allData?.data ?? [])) {
      for (const item of (dl.items || [])) {
        const sec = item.section as string;
        if (!["MERMA", "DONACION", "REFRIGERIO"].includes(sec)) continue;
        const baseUnit = getBaseUnit(item.unit);
        if (!byUnit[baseUnit]) byUnit[baseUnit] = {};
        if (!byUnit[baseUnit][sec]) byUnit[baseUnit][sec] = {};
        const key = (item.product as { id?: string })?.id ?? item.product?.code ?? "?";
        const map = byUnit[baseUnit][sec];
        if (!map[key]) map[key] = { name: item.product?.name ?? "?", code: item.product?.code ?? "?", total: 0 };
        map[key].total += normalize(item.quantity, item.unit);
      }
    }
    const result: Record<string, Record<string, { name: string; code: string; total: number }[]>> = {};
    for (const [unit, sections] of Object.entries(byUnit)) {
      result[unit] = {};
      for (const [sec, products] of Object.entries(sections)) {
        result[unit][sec] = Object.values(products).sort((a, b) => b.total - a.total).slice(0, 10);
      }
    }
    return result;
  }, [allData]);

  const tooltipStyle = { backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#e2e8f0" };

  const allItemsForExport: ItemWithContext[] = (allData?.data ?? []).flatMap((dl: ReportDailyLoad) =>
    (dl.items || []).map((item) => ({
      ...item,
      date: dl.date,
      userName: dl.user?.name,
      branchName: dl.branch?.name,
    }))
  );

  const hasProductStats = Object.values(productStatsByUnit).some((sections) =>
    Object.values(sections).some((d) => d.length > 0)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-indigo-400" /></div>
          Reportes e Historial
        </h1>
        <p className="text-muted-foreground mt-1">Estadísticas y detalle de registros con filtros</p>
      </div>

      {/* Filtros */}
      <Card className="border-white/5 bg-white/[0.02]">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Filter className="w-4 h-4" />Filtros</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Fecha desde</Label>
              <Input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }} className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Fecha hasta</Label>
              <Input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }} className="bg-white/5 border-white/10" />
            </div>
            {user?.role === "SUPER_ADMIN" && (
              <div className="space-y-2">
                <Label>Sucursal</Label>
                <select value={branchId} onChange={(e) => { setBranchId(e.target.value); setPage(1); }} className="w-full h-10 rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-white [color-scheme:dark]">
                  <option value="">Todas</option>
                  {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Sección</Label>
              <select value={section} onChange={(e) => { setSection(e.target.value); setPage(1); }} className="w-full h-10 rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-white [color-scheme:dark]">
                <option value="">Todas</option>
                <option value="MERMA">Mermas</option>
                <option value="DONACION">Donaciones</option>
                <option value="REFRIGERIO">Refrigerio</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoadingCharts ? (
        <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <>
          {/* Tarjetas de totales */}
          <div className="grid gap-4 md:grid-cols-3">
            {sectionUnitTotals.map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.name} className="border-white/5 bg-white/[0.02]">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${s.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{s.name}</p>
                        <p className="text-lg font-bold leading-tight">{s.totals.length > 0 ? formatUnitTotals(s.totals) : "0"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Tabla de historial */}
          <Card className="border-white/5 bg-white/[0.02]">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>{totalItemCount} items encontrados</span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={allItemsForExport.length === 0}
                  onClick={() => downloadExcel(allItemsForExport, `reportes_${startDate}_${endDate}.xlsx`)}
                >
                  <Download className="w-4 h-4 mr-2" />Exportar .xlsx
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : allItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No se encontraron registros para los filtros seleccionados</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead>Fecha</TableHead><TableHead>Empleado</TableHead><TableHead>Sucursal</TableHead><TableHead>Sección</TableHead><TableHead>Producto</TableHead><TableHead>Cantidad</TableHead><TableHead>Unidad</TableHead><TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allItems.map((item, i) => (
                      <TableRow key={i} className="border-white/5">
                        <TableCell className="text-muted-foreground">{formatDate(item.date)}</TableCell>
                        <TableCell>{item.userName}</TableCell>
                        <TableCell className="text-muted-foreground">{item.branchName}</TableCell>
                        <TableCell><span className={sectionLabels[item.section]?.color}>{sectionLabels[item.section]?.label}</span></TableCell>
                        <TableCell>{item.product?.code} — {item.product?.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{UNIT_ABBR[item.unit] ?? item.unit}</TableCell>
                        <TableCell>{item.state?.name || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}><ChevronLeft className="w-4 h-4" /></Button>
              <span className="text-sm text-muted-foreground">Página {page} de {pagination.totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(Math.min(pagination.totalPages, page + 1))} disabled={page === pagination.totalPages}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          )}

          {Object.keys(barChartsByUnit).length > 0 && (
            <CollapsibleSection title="Total por Sección" icon={<BarChart3 className="w-4 h-4 text-indigo-400" />}>
              <div className="space-y-6">
                {Object.entries(barChartsByUnit).map(([unit, data]) => (
                  <div key={unit}>
                    <p className="text-sm text-muted-foreground mb-3">{UNIT_CHART_LABEL[unit] ?? unit}</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} unit={` ${unit}`} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} formatter={(v) => [`${Number(v ?? 0).toLocaleString("es-AR")} ${unit}`, "Total"]} />
                        <Bar dataKey="total" name="Total" radius={[4, 4, 0, 0]} fill="#db8000">
                          {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {Object.entries(timeSeriesByUnit).some(([, d]) => d.length > 1) && (
            <CollapsibleSection title="Evolución" icon={<BarChart3 className="w-4 h-4 text-indigo-400" />}>
              <div className="space-y-6">
                {Object.entries(timeSeriesByUnit).map(([unit, data]) =>
                  data.length > 1 && (
                    <div key={unit}>
                      <p className="text-sm text-muted-foreground mb-3">{UNIT_CHART_LABEL[unit] ?? unit}</p>
                      <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} unit={` ${unit}`} />
                          <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${Number(v ?? 0).toLocaleString("es-AR")} ${unit}`]} />
                          <Legend wrapperStyle={{ fontSize: 12 }} formatter={(value) => <span style={{ color: "#94a3b8" }}>{value}</span>} />
                          <Line type="monotone" dataKey="MERMA" name="Mermas" stroke="#f87171" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="DONACION" name="Donaciones" stroke="#34d399" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="REFRIGERIO" name="Refrigerio" stroke="#fbbf24" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )
                )}
              </div>
            </CollapsibleSection>
          )}

          {hasProductStats && (
            <CollapsibleSection title="Estadísticas por Producto" icon={<Package className="w-4 h-4 text-violet-400" />}>
              <div className="space-y-8">
                {Object.entries(productStatsByUnit).map(([unit, sections]) => {
                  const hasData = Object.values(sections).some((d) => d.length > 0);
                  if (!hasData) return null;
                  return (
                    <div key={unit}>
                      <p className="text-sm font-semibold text-muted-foreground mb-4">{UNIT_CHART_LABEL[unit] ?? unit}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {productSectionConfig.map(({ key, label, fill }) => {
                          const data = sections[key] ?? [];
                          if (data.length === 0) return null;
                          return (
                            <div key={key}>
                              <p className="text-xs font-medium mb-2" style={{ color: fill }}>{label} — Top {data.length}</p>
                              <ResponsiveContainer width="100%" height={Math.max(180, data.length * 40)}>
                                <BarChart data={data} layout="vertical" margin={{ left: 18, right: 24, top: 0, bottom: 0 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                  <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                                  <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={130} />
                                  <Tooltip
                                    contentStyle={tooltipStyle}
                                    formatter={(v) => [`${Number(v ?? 0).toLocaleString("es-AR")} ${unit}`, label]}
                                    labelFormatter={(name) => {
                                      const item = data.find((d) => d.name === name);
                                      return item ? `${item.code} — ${item.name}` : String(name);
                                    }}
                                  />
                                  <Bar dataKey="total" name={label} fill={fill} radius={[0, 4, 4, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CollapsibleSection>
          )}
        </>
      )}
    </div>
  );
}
