"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom cursor — dois elementos sobrepostos:
 *   • Dot  (5px): segue o mouse sem delay, substitui o cursor nativo
 *   • Ring (28px): segue com spring, escala suavemente em elementos interativos
 *
 * mix-blend-mode: difference → visível em fundo escuro e claro sem ajuste manual.
 * Desativado automaticamente em touch — nenhum efeito colateral no mobile.
 */

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, [data-cursor-hover]";

export function CustomCursor() {
  const [visible, setVisible]   = useState(false);
  const [hovering, setHovering] = useState(false);
  const isTouch = useRef(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Ring segue com spring suave — stiffness alto o suficiente para não parecer lagado
  const ringX = useSpring(mouseX, { stiffness: 420, damping: 30, mass: 0.4 });
  const ringY = useSpring(mouseY, { stiffness: 420, damping: 30, mass: 0.4 });

  useEffect(() => {
    // Detecta touch uma vez — se o dispositivo suporta touch, desabilita tudo
    const onTouch = () => { isTouch.current = true; };
    window.addEventListener("touchstart", onTouch, { once: true });

    const onMove = (e: MouseEvent) => {
      if (isTouch.current) return;
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => { if (!isTouch.current) setVisible(true); };

    const onOver = (e: MouseEvent) => {
      if (isTouch.current) return;
      const target = e.target as Element;
      setHovering(!!target.closest(INTERACTIVE));
    };

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    document.documentElement.addEventListener("mouseover", onOver);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.removeEventListener("mouseover", onOver);
      window.removeEventListener("touchstart", onTouch);
    };
  }, [mouseX, mouseY, visible]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* ── Ring ─────────────────────────────────────────────────────── */}
      <motion.div
        className="pointer-events-none fixed z-[99998] rounded-full"
        style={{
          left: ringX,
          top: ringY,
          x: "-50%",
          y: "-50%",
          width: 28,
          height: 28,
          border: "1.5px solid white",
          mixBlendMode: "difference",
          scale: hovering ? 1.55 : 1,
          opacity: visible ? (hovering ? 0.55 : 0.75) : 0,
        }}
        transition={{ scale: { type: "spring", stiffness: 380, damping: 24 }, opacity: { duration: 0.15 } }}
      />

      {/* ── Dot ──────────────────────────────────────────────────────── */}
      <motion.div
        className="pointer-events-none fixed z-[99999] rounded-full"
        style={{
          left: mouseX,
          top: mouseY,
          x: "-50%",
          y: "-50%",
          width: 5,
          height: 5,
          background: "white",
          mixBlendMode: "difference",
          scale: hovering ? 0 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ scale: { type: "spring", stiffness: 500, damping: 24 }, opacity: { duration: 0.1 } }}
      />
    </>
  );
}
