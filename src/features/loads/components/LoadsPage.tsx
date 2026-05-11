"use client";

import { useState } from "react";
import { useAuth, useAuthFetch } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { ClipboardList, Plus, Trash2, Loader2, Lock, Search, AlertTriangle, Gift, Coffee, Send, ScanLine } from "lucide-react";
import type { LoadItemRecord } from "../types";
import { BarcodeScannerModal } from "./BarcodeScannerModal";
import { useDailyLoad, usePendingItems, useLoadMutations, type PendingItem } from "../hooks/use-loads";
import { useActiveProducts } from "@/features/products/hooks/use-products";
import { useActiveStates } from "@/features/states/hooks/use-states";

interface Product { id: string; name: string; code: string; }

const sectionConfig = {
  MERMA: { label: "Mermas", icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
  DONACION: { label: "Donaciones", icon: Gift, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  REFRIGERIO: { label: "Refrigerio", icon: Coffee, color: "text-amber-400", bg: "bg-amber-500/10" },
};

const UNIT_OPTIONS = [
  { value: "GRAMOS", label: "Gramos (g)" },
  { value: "KILOGRAMOS", label: "Kilogramos (kg)" },
  { value: "LITROS", label: "Litros (L)" },
  { value: "UNIDAD", label: "Unidades (u)" },
];

const UNIT_ABBR: Record<string, string> = { GRAMOS: "g", KILOGRAMOS: "kg", LITROS: "L", UNIDAD: "u" };
const SELECT_CLASS = "w-full h-10 rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-white [color-scheme:dark]";
type Section = keyof typeof sectionConfig;

export function LoadsPage() {
  const { user } = useAuth();
  const authFetch = useAuthFetch();

  const [activeSection, setActiveSection] = useState<Section>("MERMA");
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedState, setSelectedState] = useState("");
  const [unit, setUnit] = useState("GRAMOS");
  const [quantity, setQuantity] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const { dailyLoad, isLoading: loadingDailyLoad } = useDailyLoad();
  const { pendingItems, setPendingItems } = usePendingItems(user?.id);
  const { products } = useActiveProducts(searchProduct);
  const { states } = useActiveStates();
  const { submitMutation, closeMutation, deleteItemMutation } = useLoadMutations();

  async function handleBarcodeScan(barcode: string) {
    setShowScanner(false);
    setScanLoading(true);
    try {
      const params = new URLSearchParams({ barcode });
      const res = await authFetch(`/api/products?${params}`);
      if (!res.ok) throw new Error();
      const found: Product[] = await res.json();
      if (found.length === 0) {
        toast({ title: "Producto no encontrado para ese código de barras", variant: "destructive" });
      } else {
        setSelectedProduct(found[0]);
        setSearchProduct("");
      }
    } catch {
      toast({ title: "Error al buscar el producto", variant: "destructive" });
    } finally {
      setScanLoading(false);
    }
  }

  function addPendingItem() {
    if (!selectedProduct) return;
    const qty = parseFloat(quantity);
    if (!quantity || isNaN(qty) || qty <= 0) {
      toast({ title: "La cantidad debe ser mayor a 0", variant: "destructive" });
      return;
    }
    if ((activeSection === "MERMA" || activeSection === "DONACION") && !selectedState) {
      toast({ title: "Seleccioná un estado para el producto", variant: "destructive" });
      return;
    }
    const newItem: PendingItem = {
      section: activeSection,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productCode: selectedProduct.code,
      quantity: parseFloat(quantity),
      unit,
      stateId: activeSection === "REFRIGERIO" ? null : selectedState,
      stateName: activeSection === "REFRIGERIO" ? "—" : states.find((s) => s.id === selectedState)?.name || "",
    };
    setPendingItems([...pendingItems, newItem]);
    setSelectedProduct(null);
    setSelectedState("");
    setQuantity("");
    setSearchProduct("");
  }

  const isClosed = dailyLoad?.isClosed ?? false;
  const existingItems: LoadItemRecord[] = dailyLoad?.items ?? [];

  return (
    <div className="space-y-6 pb-6 md:pb-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><ClipboardList className="w-5 h-5 text-blue-400" /></div>
          Carga Diaria de Stock
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          {user?.branch ? ` — ${user.branch.name}` : ""}
        </p>
      </div>

      {isClosed && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-4 flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-sm text-amber-400 font-medium">La planilla del día ya fue cerrada. No se pueden agregar más registros.</p>
          </CardContent>
        </Card>
      )}

      {!isClosed && (
        <div className="flex gap-1.5 md:gap-2 flex-wrap">
          {(Object.entries(sectionConfig) as [Section, typeof sectionConfig[Section]][]).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <button key={key} onClick={() => { setActiveSection(key); setSelectedState(""); }} className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-sm font-medium transition-all ${activeSection === key ? `${config.bg} ${config.color} shadow-sm` : "text-muted-foreground hover:bg-white/5"}`}>
                <Icon className="w-4 h-4" />{config.label}
              </button>
            );
          })}
        </div>
      )}

      {!isClosed && (
        <Card className="border-white/5 bg-white/[0.02]">
          <CardHeader><CardTitle className="text-base">Agregar {sectionConfig[activeSection].label}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2 md:col-span-2 lg:col-span-2">
                <Label>Producto</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Buscar producto..." value={selectedProduct ? `${selectedProduct.code} — ${selectedProduct.name}` : searchProduct} onChange={(e) => { setSearchProduct(e.target.value); setSelectedProduct(null); }} className="pl-10 bg-white/5 border-white/10" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="md:hidden shrink-0 border-white/10 bg-white/5"
                    onClick={() => setShowScanner(true)}
                    disabled={scanLoading}
                    title="Escanear código de barras"
                  >
                    {scanLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
                  </Button>
                </div>
                {searchProduct && !selectedProduct && products.length > 0 && (
                  <div className="border border-white/10 rounded-lg bg-slate-950 max-h-48 overflow-y-auto">
                    {products.map((p) => (
                      <button key={p.id} onClick={() => { setSelectedProduct(p); setSearchProduct(""); }} className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors flex items-center gap-2">
                        <code className="text-xs text-muted-foreground">{p.code}</code><span>{p.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Cantidad</Label>
                <Input type="number" min="1" step="0.1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Unidad</Label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)} className={SELECT_CLASS}>
                  {UNIT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              {activeSection !== "REFRIGERIO" && (
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className={SELECT_CLASS}>
                    <option value="">Seleccionar...</option>
                    {states.filter((s) => !s.section || s.section === activeSection).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              )}
            </div>
            <Button onClick={addPendingItem} disabled={!selectedProduct || !quantity} className="w-full md:w-auto"><Plus className="w-4 h-4 mr-2" />Agregar a la lista</Button>
          </CardContent>
        </Card>
      )}

      {pendingItems.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span>Items pendientes de envío ({pendingItems.length})</span>
              <Button
                onClick={() => submitMutation.mutate(
                  pendingItems.map((i) => ({ section: i.section, productId: i.productId, quantity: i.quantity, unit: i.unit, stateId: i.stateId })),
                  { onSuccess: () => setPendingItems([]) }
                )}
                variant="gradient"
                disabled={submitMutation.isPending}
                className="w-full sm:w-auto"
              >
                {submitMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}Enviar Carga
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Vista tabla (md+) */}
            <div className="hidden md:block">
              <Table>
                <TableHeader><TableRow className="border-white/5"><TableHead>Sección</TableHead><TableHead>Producto</TableHead><TableHead>Cantidad</TableHead><TableHead>Estado</TableHead><TableHead className="text-right">Quitar</TableHead></TableRow></TableHeader>
                <TableBody>
                  {pendingItems.map((item, i) => (
                    <TableRow key={i} className="border-white/5">
                      <TableCell><span className={sectionConfig[item.section]?.color}>{sectionConfig[item.section]?.label}</span></TableCell>
                      <TableCell>{item.productCode} — {item.productName}</TableCell>
                      <TableCell>{item.quantity} {UNIT_ABBR[item.unit] ?? item.unit}</TableCell>
                      <TableCell>{item.stateName}</TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => setPendingItems(pendingItems.filter((_, j) => j !== i))} className="text-destructive"><Trash2 className="w-4 h-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Vista cards (mobile) */}
            <div className="md:hidden divide-y divide-white/5">
              {pendingItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs font-medium ${sectionConfig[item.section]?.color}`}>{sectionConfig[item.section]?.label}</span>
                      <span className="text-xs text-muted-foreground">{item.stateName}</span>
                    </div>
                    <p className="text-sm font-medium truncate">{item.productCode} — {item.productName}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity} {UNIT_ABBR[item.unit] ?? item.unit}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setPendingItems(pendingItems.filter((_, j) => j !== i))} className="text-destructive shrink-0"><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {existingItems.length > 0 && (
        <Card className="border-white/5 bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="text-base flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span>Registros del día ({existingItems.length})</span>
              {!isClosed && dailyLoad && (
                <Button onClick={() => setShowCloseConfirm(true)} variant="outline" size="sm" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 w-full sm:w-auto">
                  <Lock className="w-4 h-4 mr-2" />Cerrar Planilla
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Vista tabla (md+) */}
            <div className="hidden md:block">
              <Table>
                <TableHeader><TableRow className="border-white/5"><TableHead>Sección</TableHead><TableHead>Producto</TableHead><TableHead>Cantidad</TableHead><TableHead>Estado</TableHead>{!isClosed && <TableHead className="text-right">Quitar</TableHead>}</TableRow></TableHeader>
                <TableBody>
                  {existingItems.map((item) => (
                    <TableRow key={item.id} className="border-white/5">
                      <TableCell><span className={sectionConfig[item.section as Section]?.color}>{sectionConfig[item.section as Section]?.label}</span></TableCell>
                      <TableCell>{item.product.code} — {item.product.name}</TableCell>
                      <TableCell>{item.quantity} {UNIT_ABBR[item.unit] ?? item.unit}</TableCell>
                      <TableCell>{item.state?.name || "—"}</TableCell>
                      {!isClosed && dailyLoad && (
                        <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => deleteItemMutation.mutate({ loadId: dailyLoad.id, itemId: item.id })} className="text-destructive"><Trash2 className="w-4 h-4" /></Button></TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Vista cards (mobile) */}
            <div className="md:hidden divide-y divide-white/5">
              {existingItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-4 py-3 gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs font-medium ${sectionConfig[item.section as Section]?.color}`}>{sectionConfig[item.section as Section]?.label}</span>
                      <span className="text-xs text-muted-foreground">{item.state?.name || "—"}</span>
                    </div>
                    <p className="text-sm font-medium truncate">{item.product.code} — {item.product.name}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity} {UNIT_ABBR[item.unit] ?? item.unit}</p>
                  </div>
                  {!isClosed && dailyLoad && (
                    <Button variant="ghost" size="icon" onClick={() => deleteItemMutation.mutate({ loadId: dailyLoad.id, itemId: item.id })} className="text-destructive shrink-0"><Trash2 className="w-4 h-4" /></Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {loadingDailyLoad && <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}

      <BarcodeScannerModal open={showScanner} onClose={() => setShowScanner(false)} onScan={handleBarcodeScan} />

      <Dialog open={showCloseConfirm} onOpenChange={(v) => { if (!closeMutation.isPending) setShowCloseConfirm(v); }}>
        <DialogContent className="border-white/10 bg-slate-950 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />Cerrar Planilla
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Una vez cerrada, no podrás agregar ni quitar registros del día. ¿Confirmás el cierre?
          </p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setShowCloseConfirm(false)} disabled={closeMutation.isPending}>
              Cancelar
            </Button>
            <Button
              onClick={() => dailyLoad && closeMutation.mutate(dailyLoad.id, { onSuccess: () => setShowCloseConfirm(false) })}
              disabled={closeMutation.isPending}
              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 bg-amber-500/5"
              variant="outline"
            >
              {closeMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
              {closeMutation.isPending ? "Cerrando..." : "Cerrar Planilla"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
