"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface GlassLensProps {
  size?: number;
}

/**
 * Optical glass lens that follows the cursor — position: fixed so it works
 * inside GSAP pin contexts. Simulates a real convex glass lens:
 *   • Strong caustic specular highlight (top-left)
 *   • Secondary internal reflection (bottom-right)
 *   • Edge vignette — convex glass darkens toward its rim
 *   • Chromatic aberration fringe — outer ring
 *   • Ambient diffuse halo
 *   • Minimal blur — optical glass refracts, it doesn't frost
 */
export function GlassLens({ size = 200 }: GlassLensProps) {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springX = useSpring(mouseX, { stiffness: 280, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 280, damping: 30 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    const onLeave = () => {
      mouseX.set(-1000);
      mouseY.set(-1000);
    };
    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [mouseX, mouseY]);

  const shared = {
    position: "fixed" as const,
    left: springX,
    top: springY,
    x: "-50%",
    y: "-50%",
    borderRadius: "50%",
    pointerEvents: "none" as const,
  };

  return (
    <>
      {/* ── Layer 1: Ambient diffuse halo ───────────────────────────── */}
      <motion.div
        style={{
          ...shared,
          width: size + 80,
          height: size + 80,
          zIndex: 9996,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 40%, transparent 68%)",
        }}
      />

      {/* ── Layer 2: Chromatic aberration ring ──────────────────────── */}
      {/* Simulates color dispersion at the edge of a thick glass lens */}
      <motion.div
        style={{
          ...shared,
          width: size + 6,
          height: size + 6,
          zIndex: 9997,
          background:
            "conic-gradient(from 190deg, rgba(255,80,80,0.22) 0deg, rgba(80,120,255,0.2) 90deg, rgba(80,220,180,0.18) 180deg, rgba(255,200,80,0.18) 270deg, rgba(255,80,80,0.22) 360deg)",
          filter: "blur(4px)",
          opacity: 0.85,
        }}
      />

      {/* ── Layer 3: Main glass body ─────────────────────────────────── */}
      <motion.div
        style={{
          ...shared,
          width: size,
          height: size,
          zIndex: 9999,
          // Real optical glass: low blur, high brightness + saturation + contrast
          // The contrast makes edges crisper — like looking through a magnifying lens
          backdropFilter:
            "blur(1.5px) brightness(1.2) saturate(1.7) contrast(1.08)",
          WebkitBackdropFilter:
            "blur(1.5px) brightness(1.2) saturate(1.7) contrast(1.08)",
          background: [
            // Primary caustic — the defining feature of optical glass
            // Offset bright specular hotspot, simulating light convergence
            "radial-gradient(circle at 30% 28%, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.32) 14%, rgba(255,255,255,0.04) 35%, transparent 50%)",
            // Secondary reflection — smaller, dimmer, opposite corner
            "radial-gradient(circle at 72% 74%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 18%, transparent 32%)",
            // Edge vignette — convex glass refracts light inward, darkening the rim
            "radial-gradient(circle at 50% 50%, transparent 46%, rgba(0,0,0,0.1) 68%, rgba(0,0,0,0.26) 86%, rgba(0,0,0,0.36) 100%)",
            // Subtle internal tint — glass isn't perfectly neutral
            "radial-gradient(circle at 50% 60%, rgba(200,230,255,0.04) 0%, transparent 60%)",
          ].join(", "),
          border: "1px solid rgba(255,255,255,0.42)",
          boxShadow: [
            // Ground shadow
            "0 12px 48px rgba(0,0,0,0.28)",
            "0 4px 12px rgba(0,0,0,0.18)",
            // Top-left Fresnel rim (bright)
            "inset 0 2px 0 rgba(255,255,255,0.65)",
            "inset 2px 0 0 rgba(255,255,255,0.28)",
            // Bottom-right Fresnel complement (dark)
            "inset 0 -2px 0 rgba(0,0,0,0.14)",
            "inset -2px 0 0 rgba(0,0,0,0.08)",
            // Inner colored glow — cool light through glass
            "inset 0 0 28px rgba(140,190,255,0.08)",
          ].join(", "),
        }}
      />
    </>
  );
}
