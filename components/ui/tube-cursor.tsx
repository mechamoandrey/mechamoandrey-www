"use client";

import { useEffect, useRef } from "react";

/* ─── Full-screen hero version (original) ───────────────────────────────────── */
type TubesCursorProps = {
  title?: string;
  subtitle?: string;
  caption?: string;
  initialColors?: string[];
  lightColors?: string[];
  lightIntensity?: number;
  titleSize?: string;
  subtitleSize?: string;
  captionSize?: string;
  enableRandomizeOnClick?: boolean;
  className?: string;
};

const TubesCursor = ({
  title = "Tubes",
  subtitle = "Cursor",
  caption = "WebGPU / WebGL",
  initialColors = ["#f967fb", "#53bc28", "#6958d5"],
  lightColors = ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"],
  lightIntensity = 200,
  titleSize = "text-[80px]",
  subtitleSize = "text-[60px]",
  captionSize = "text-base",
  enableRandomizeOnClick = true,
  className = "",
}: TubesCursorProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let removeClick: (() => void) | null = null;
    let destroyed = false;

    (async () => {
      const mod = await import(
        /* webpackIgnore: true */
        "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js" as string
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const TubesCursorCtor = (mod as any).default ?? mod;
      if (!canvasRef.current || destroyed) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const app: any = TubesCursorCtor(canvasRef.current, {
        tubes: { colors: initialColors, lights: { intensity: lightIntensity, colors: lightColors } },
      });
      appRef.current = app;
      if (enableRandomizeOnClick) {
        const handler = () => {
          app.tubes.setColors(randomColors(initialColors.length));
          app.tubes.setLightsColors(randomColors(lightColors.length));
        };
        document.body.addEventListener("click", handler);
        removeClick = () => document.body.removeEventListener("click", handler);
      }
    })();

    return () => {
      destroyed = true;
      if (removeClick) removeClick();
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (appRef.current as any)?.dispose?.();
        appRef.current = null;
      } catch { /* ignore */ }
    };
  }, [initialColors, lightColors, lightIntensity, enableRandomizeOnClick]);

  return (
    <div className={`relative h-screen w-screen overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="fixed inset-0 block h-full w-full" />
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-2 select-none">
        <h1 className={`m-0 p-0 text-white font-bold uppercase leading-none drop-shadow-[0_0_20px_rgba(0,0,0,1)] ${titleSize}`}>{title}</h1>
        <h2 className={`m-0 p-0 text-white font-medium uppercase leading-none drop-shadow-[0_0_20px_rgba(0,0,0,1)] ${subtitleSize}`}>{subtitle}</h2>
        <p className={`m-0 p-0 text-white leading-none drop-shadow-[0_0_20px_rgba(0,0,0,1)] ${captionSize}`}>{caption}</p>
      </div>
    </div>
  );
};

/* ─── Card background version (no hero text, absolute canvas) ────────────────── */
export function CardTubesBg({
  colors = ["#7a9bb5", "#4a7fa8", "#2d5f8a"],
  lightColors = ["#a0c8e8", "#4fc3f7", "#7a9bb5", "#2d9cdb"],
  lightIntensity = 160,
  opacity = 0.8,
}: {
  colors?: string[];
  lightColors?: string[];
  lightIntensity?: number;
  opacity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Re-init when palette changes (theme toggle)
  const colorsKey = colors.join("|") + "::" + lightColors.join("|");

  useEffect(() => {
    let destroyed = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let app: any = null;

    (async () => {
      const mod = await import(
        /* webpackIgnore: true */
        "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js" as string
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Ctor = (mod as any).default ?? mod;
      if (!canvasRef.current || destroyed) return;
      app = Ctor(canvasRef.current, {
        tubes: { colors, lights: { intensity: lightIntensity, colors: lightColors } },
      });
    })();

    return () => {
      destroyed = true;
      try { app?.dispose?.(); } catch { /* ignore */ }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorsKey, lightIntensity]);

  return (
    <canvas
      ref={canvasRef}
      style={{ opacity }}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

function randomColors(count: number) {
  return Array.from({ length: count }, () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")
  );
}

export { TubesCursor };
