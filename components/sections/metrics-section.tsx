"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";

// Player causes SSR/hydration mismatch (locale + Remotion frame state) → client-only
const BentoPlayer = dynamic(
  () => import("./bento-player").then((m) => m.BentoPlayer),
  { ssr: false }
);

export function MetricsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="trabalhos" className="py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-10 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div ref={ref} className="mb-12 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          >
            Performance & qualidade
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            Métricas que importam,
            <br className="hidden sm:block" /> entregues com consistência.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            LCP, CLS, FID, Lighthouse, cobertura de testes, tamanho de bundle —
            cada decisão técnica é tomada com essas métricas em mente.
          </motion.p>
        </div>

        {/* Bento Player — client-only to avoid hydration mismatch */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <BentoPlayer />
        </motion.div>

        {/* Metric badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {[
            { label: "LCP < 2.5s", color: "#7A8B5C" },     /* sage */
            { label: "CLS < 0.1", color: "#7A8B5C" },      /* sage */
            { label: "Lighthouse 95+", color: "#8A6E3D" }, /* bronze */
            { label: "Bundle otimizado", color: "#D4882A" }, /* amber */
            { label: "Testes unitários", color: "#7A4F2D" }, /* coffee */
            { label: "a11y compliant", color: "#B86E3F" }, /* terracota */
          ].map((badge) => (
            <span
              key={badge.label}
              className="rounded-full px-4 py-1.5 text-xs font-semibold"
              style={{
                background: `${badge.color}18`,
                color: badge.color,
                border: `1px solid ${badge.color}30`,
              }}
            >
              {badge.label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
