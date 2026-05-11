"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ScanLine } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

type ScannerState = "loading" | "scanning" | "error";

const NATIVE_FORMATS = ["ean_13", "ean_8", "code_128", "code_39", "qr_code", "upc_a", "upc_e"];
const VIDEO_CONSTRAINTS: MediaStreamConstraints = {
  video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
};

export function BarcodeScannerModal({ open, onClose, onScan }: Props) {
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const [state, setState] = useState<ScannerState>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!open || !videoEl) return;

    setState("loading");
    setErrorMsg("");
    let active = true;
    const video = videoEl;

    const usesNative = "BarcodeDetector" in window;
    usesNative ? startNative() : startZXing();

    // ── Native BarcodeDetector (Chrome 83+ Android) ──────────────────────────────
    async function startNative() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(VIDEO_CONSTRAINTS);
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        video.srcObject = stream;
        video.setAttribute("playsinline", "true");
        video.muted = true;
        await video.play();
        if (!active) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const detector = new (window as any).BarcodeDetector({ formats: NATIVE_FORMATS });
        setState("scanning");

        async function tick() {
          if (!active) return;
          if (video.readyState < 2 || !video.videoWidth) {
            rafRef.current = requestAnimationFrame(tick);
            return;
          }
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const results: any[] = await detector.detect(video);
            if (results.length > 0 && active) {
              active = false;
              onScan(results[0].rawValue);
              return;
            }
          } catch { /* no barcode in this frame */ }
          if (active) rafRef.current = requestAnimationFrame(tick);
        }
        rafRef.current = requestAnimationFrame(tick);
      } catch (err) {
        if (!active) return;
        handleError(err);
      }
    }

    // ── ZXing fallback — manual canvas loop, both binarizers per frame ───────────
    async function startZXing() {
      try {
        const [
          { HTMLCanvasElementLuminanceSource },
          { MultiFormatReader, BinaryBitmap, HybridBinarizer, GlobalHistogramBinarizer, DecodeHintType, BarcodeFormat },
        ] = await Promise.all([
          import("@zxing/browser"),
          import("@zxing/library"),
        ]);
        if (!active) return;

        const stream = await navigator.mediaDevices.getUserMedia(VIDEO_CONSTRAINTS);
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        video.srcObject = stream;
        video.setAttribute("playsinline", "true");
        video.muted = true;
        await video.play();
        if (!active) return;

        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
          BarcodeFormat.EAN_13, BarcodeFormat.EAN_8,
          BarcodeFormat.CODE_128, BarcodeFormat.CODE_39,
          BarcodeFormat.QR_CODE, BarcodeFormat.UPC_A, BarcodeFormat.UPC_E,
        ]);
        hints.set(DecodeHintType.TRY_HARDER, true);

        const reader = new MultiFormatReader();
        reader.setHints(hints);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

        setState("scanning");

        let lastScan = 0;

        function tick(now: number) {
          if (!active) return;
          if (video.readyState < 2 || !video.videoWidth) {
            rafRef.current = requestAnimationFrame(tick);
            return;
          }

          // Throttle to ~10fps to let camera autofocus between attempts
          if (now - lastScan < 100) {
            rafRef.current = requestAnimationFrame(tick);
            return;
          }
          lastScan = now;

          // Crop to center 80% width × 40% height (where the targeting brackets are)
          const srcW = video.videoWidth;
          const srcH = video.videoHeight;
          const cropW = Math.floor(srcW * 0.8);
          const cropH = Math.floor(srcH * 0.4);
          const cropX = Math.floor((srcW - cropW) / 2);
          const cropY = Math.floor((srcH - cropH) / 2);
          canvas.width = cropW;
          canvas.height = cropH;
          ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

          const source = new HTMLCanvasElementLuminanceSource(canvas);

          // Try HybridBinarizer (best for normal lighting)
          try {
            const result = reader.decodeWithState(new BinaryBitmap(new HybridBinarizer(source)));
            if (result && active) {
              active = false;
              onScan(result.getText());
              return;
            }
          } catch { /* no barcode */ }

          // Try GlobalHistogramBinarizer (better for low contrast / harsh lighting)
          try {
            const result = reader.decodeWithState(new BinaryBitmap(new GlobalHistogramBinarizer(source)));
            if (result && active) {
              active = false;
              onScan(result.getText());
              return;
            }
          } catch { /* no barcode */ }

          if (active) rafRef.current = requestAnimationFrame(tick);
        }

        rafRef.current = requestAnimationFrame(tick);
      } catch (err) {
        if (!active) return;
        handleError(err);
      }
    }

    function handleError(err: unknown) {
      const msg = err instanceof Error ? err.message.toLowerCase() : "";
      if (msg.includes("notallowed") || msg.includes("permission") || msg.includes("denied")) {
        setErrorMsg("Permiso de cámara denegado. Habilitalo en la configuración del navegador.");
      } else if (msg.includes("notfound") || msg.includes("devicenotfound")) {
        setErrorMsg("No se encontró ninguna cámara en el dispositivo.");
      } else {
        setErrorMsg("No se pudo inicializar la cámara. Verificá los permisos del navegador.");
      }
      setState("error");
    }

    return () => {
      active = false;
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [open, videoEl]);

  function handleClose() {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-sm p-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-primary" />
            Escanear código de barras
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full aspect-[4/3] bg-black rounded-lg overflow-hidden">
          <video ref={setVideoEl} muted playsInline autoPlay className="w-full h-full object-cover" />

          {state === "loading" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <Loader2 className="w-8 h-8 animate-spin text-white/50" />
            </div>
          )}
          {state === "error" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black p-6">
              <p className="text-sm text-red-400 text-center">{errorMsg}</p>
            </div>
          )}
          {state === "scanning" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative w-4/5 h-1/3 z-10">
                <span className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-primary" />
                <span className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-primary" />
                <span className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-primary" />
                <span className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-primary" />
              </div>
            </div>
          )}
        </div>

        {state === "scanning" && (
          <p className="text-xs text-muted-foreground text-center">
            Apuntá la cámara al código de barras del producto
          </p>
        )}

        <Button variant="outline" className="w-full" onClick={handleClose}>
          Cancelar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
