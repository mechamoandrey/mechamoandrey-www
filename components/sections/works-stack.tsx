"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const PROJECTS = [
  {
    id: "01",
    title: "Plataforma Bancária",
    category: "Fintech · Produção Crítica",
    year: "2021 — 2024",
    description:
      "Sistema frontend para plataforma financeira de alta disponibilidade. Migração incremental com zero-downtime, feature flags em produção e observabilidade end-to-end.",
    tags: ["Angular", "TypeScript", "Datadog", "Feature Flags"],
    accent: "#6366f1",
    bg: "linear-gradient(160deg, #0a0f1e 0%, #131b35 100%)",
    color: "#e2e8f0",
    stat: "1M+ usuários/mês",
  },
  {
    id: "02",
    title: "Acquisition Platform",
    category: "Growth · Red Ventures",
    year: "2019 — 2021",
    description:
      "Plataforma de aquisição de alto tráfego com foco extremo em performance. Lighthouse de 28 para 95+. LCP abaixo de 1.2s em produção real.",
    tags: ["Next.js", "Core Web Vitals", "A/B Testing", "Edge Cache"],
    accent: "#f59e0b",
    bg: "linear-gradient(160deg, #1a0f00 0%, #2d1a00 100%)",
    color: "#fef3c7",
    stat: "Lighthouse 95+",
  },
  {
    id: "03",
    title: "AI Automation Flows",
    category: "Automação · Freelance",
    year: "2024 — presente",
    description:
      "Fluxos automatizados com IA para clientes de diferentes setores. Interfaces de monitoramento, pipelines de processamento e integração de LLMs em produção.",
    tags: ["React", "LLM Integration", "Automation", "Monitoring"],
    accent: "#10b981",
    bg: "linear-gradient(160deg, #071a0e 0%, #0d2b18 100%)",
    color: "#d1fae5",
    stat: "Múltiplos clientes",
  },
  {
    id: "04",
    title: "Design System",
    category: "Infraestrutura · Produto",
    year: "2023",
    description:
      "Sistema de design completo com componentes acessíveis, tokens semânticos e documentação viva. Adotado por múltiplos times em paralelo.",
    tags: ["React", "WCAG 2.1", "Storybook", "Tailwind"],
    accent: "#a78bfa",
    bg: "linear-gradient(160deg, #0f0a1e 0%, #1a1235 100%)",
    color: "#ede9fe",
    stat: "WCAG 2.1 AA",
  },
];

/* ─── Progress Dot ─────────────────────────────────────────────────── */
function ProgressDot({
  index,
  total,
  scrollYProgress,
}: {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const w = useTransform(
    scrollYProgress,
    [
      Math.max(0, index * seg - 0.01),
      index * seg,
      (index + 0.5) * seg,
      (index + 1) * seg,
    ],
    ["6px", "24px", "24px", "6px"],
  );
  const op = useTransform(
    scrollYProgress,
    [Math.max(0, index * seg - 0.01), index * seg, (index + 1) * seg],
    [0.25, 1, 0.25],
  );

  return (
    <motion.div
      style={{ width: w, opacity: op }}
      className="h-[3px] rounded-full bg-foreground/70"
    />
  );
}

/* ─── Stack Card ───────────────────────────────────────────────────── */
function StackCard({
  project,
  index,
  total,
  scrollYProgress,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = index * seg;
  const end = (index + 1) * seg;

  // Para o primeiro card: começa visível desde scroll 0
  // Para os demais: fade in antes do start
  const fadeStart = index === 0 ? 0 : Math.max(0.001, start - seg * 0.45);
  const fadeEnd   = index === 0 ? Math.min(0.001, start + 0.001) : start;

  const y = useTransform(
    scrollYProgress,
    [fadeStart, fadeEnd, end - seg * 0.12, end],
    [index === 0 ? "0px" : "70px", "0px", "0px", "-60vh"],
  );
  const opacity = useTransform(
    scrollYProgress,
    [fadeStart, fadeEnd, end - seg * 0.12, end],
    [index === 0 ? 1 : 0, 1, 1, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    [start, end - seg * 0.12, end],
    [1, 1, 0.97],
  );

  return (
    <motion.div
      style={{ y, opacity, scale, background: project.bg }}
      className="absolute inset-x-4 sm:inset-x-8 lg:inset-x-16 top-16 bottom-16 rounded-3xl overflow-hidden"
    >
      <div
        className="h-full flex flex-col p-8 sm:p-10 lg:p-16"
        style={{ color: project.color }}
      >
        {/* Top */}
        <div className="flex items-start justify-between">
          <div>
            <p
              className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3"
              style={{ color: project.accent, opacity: 0.9 }}
            >
              {project.category}
            </p>
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.9]">
              {project.title}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-3 shrink-0 ml-4">
            <span className="text-sm font-mono" style={{ opacity: 0.5 }}>
              {project.year}
            </span>
            <div
              className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                background: `${project.accent}20`,
                color: project.accent,
                border: `1px solid ${project.accent}40`,
              }}
            >
              Ver projeto <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-auto">
          <p
            className="text-base sm:text-lg leading-relaxed max-w-[58ch] mb-6"
            style={{ opacity: 0.75 }}
          >
            {project.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    background: `${project.accent}18`,
                    color: project.accent,
                    border: `1px solid ${project.accent}35`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <span
              className="text-xl sm:text-2xl font-bold font-mono shrink-0"
              style={{ color: project.accent }}
            >
              {project.stat}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── WorksStack ───────────────────────────────────────────────────── */
export function WorksStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={containerRef}
      id="trabalhos"
      style={{ height: `${PROJECTS.length * 100 + 50}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Label */}
        <div className="absolute top-6 left-6 sm:left-10 lg:left-16 z-50">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            Trabalhos selecionados
          </p>
        </div>

        {/* Progress dots */}
        <div className="absolute top-6 right-6 sm:right-10 lg:right-16 z-50 flex items-center gap-1.5">
          {PROJECTS.map((_, i) => (
            <ProgressDot
              key={i}
              index={i}
              total={PROJECTS.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Cards */}
        {PROJECTS.map((project, i) => (
          <StackCard
            key={project.id}
            project={project}
            index={i}
            total={PROJECTS.length}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}
