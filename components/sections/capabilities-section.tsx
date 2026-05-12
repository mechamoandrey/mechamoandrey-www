"use client";
import {
  useRef, useEffect, useState, useCallback,
} from "react";
import {
  motion, animate,
} from "framer-motion";
import {
  SiReact, SiNextdotjs, SiAngular, SiTypescript,
  SiGreensock, SiFramer, SiDatadog,
  SiTailwindcss, SiGithubactions,
} from "react-icons/si";
import BlurText from "@/components/ui/blur-text";
import { TiltCard } from "@/components/ui/tilt-card";
import { CardTubesBg } from "@/components/ui/tube-cursor";

/* ─── Tech icon map ──────────────────────────────────────────────────────────── */
const TECH_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "React 19":          SiReact,
  "Next.js 15":        SiNextdotjs,
  "Angular 18":        SiAngular,
  "TypeScript strict": SiTypescript,
  "Tailwind v4":       SiTailwindcss,
  "Framer Motion":     SiFramer,
  "GSAP":              SiGreensock,
  "Datadog":           SiDatadog,
  "GitHub Actions":    SiGithubactions,
};

/* ─── Content ────────────────────────────────────────────────────────────────── */
const CAPABILITIES = [
  {
    number: "01",
    title:    "Engenharia Frontend",
    subtitle: "Arquitetura que escala junto com o time",
    body:     "Frontend escalável começa antes da primeira linha de componente. Modelagem de estado, fronteiras claras entre domínios, testes que protegem comportamento de negócio. Conduzi migração ao vivo em plataforma financeira com feature flag em produção e deploy sem downtime. O usuário não soube que aconteceu.",
    tags:     ["React 19", "Next.js 15", "Angular 18", "TypeScript strict", "Clean Architecture"],
    accent:   "#c07840",
  },
  {
    number: "02",
    title:    "Performance & Observabilidade",
    subtitle: "Performance tratada como decisão, não como ajuste de última semana",
    body:     "Bundle de 800KB que ninguém quer abrir vira bundle de 180KB que carrega em 3G. Lighthouse de 28 para 95+, LCP em produção abaixo de 1.2s, CLS perto de zero. Depois vem o que sustenta: logs estruturados, distributed tracing, dashboard que o on-call abre sem reclamar.",
    tags:     ["Core Web Vitals", "Lighthouse 95+", "Edge Runtime", "Bundle Analysis", "next/image"],
    accent:   "#c9a86a",
  },
  {
    number: "03",
    title:    "Motion & Interação",
    subtitle: "Movimento que conta o que a interface está fazendo",
    body:     "Animação boa some. Aparece quando precisa orientar a próxima ação, marcar o que mudou ou dar tempo para o sistema confirmar uma operação. Tudo a 60fps, só transform e opacity, nunca layout. Em checkout e onboarding isso reduz a fricção que aparece no funil.",
    tags:     ["Framer Motion", "GSAP", "ScrollTrigger", "Spring Physics", "prefers-reduced-motion"],
    accent:   "#7a9bb5",
  },
  {
    number: "04",
    title:    "Pensamento de Produto",
    subtitle: "Código é metade do trabalho. A outra metade é a conversa.",
    body:     "Pergunto por que antes de implementar. Aponto trade-off quando ninguém quer falar. Acessibilidade entra no início, não na revisão de QA. Construo dashboard que o on-call usa de verdade e escrevo decisão técnica de um jeito que liderança consegue defender em comitê.",
    tags:     ["WCAG 2.1 AA", "Datadog", "GitHub Actions", "SEO Técnico", "Product Thinking"],
    accent:   "#9c7558",
  },
] as const;

/* ─── TagList ────────────────────────────────────────────────────────────────── */
function TagList({ tags, accent, max }: {
  tags: readonly string[]; accent: string; max?: number;
}) {
  const list = max ? tags.slice(0, max) : tags;
  return (
    <div className="flex flex-wrap gap-1.5">
      {list.map((tag) => {
        const Icon = TECH_ICONS[tag];
        return (
          <motion.span
            key={tag}
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: `${accent}12`, color: accent, border: `1px solid ${accent}28` }}
            whileHover={{ scale: 1.06, y: -1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {Icon && <Icon className="w-3 h-3 shrink-0" />}
            {tag}
          </motion.span>
        );
      })}
    </div>
  );
}

/* ─── CardBase ───────────────────────────────────────────────────────────────── */
function CardBase({ accent, className = "", children }: {
  accent: string; className?: string; children: React.ReactNode;
}) {
  return (
    <div
      className={`relative rounded-3xl overflow-hidden flex flex-col gap-5 p-8 md:p-9 h-full ${className}`}
      style={{
        background: "color-mix(in oklch, var(--foreground) 3%, transparent)",
        border: `1px solid ${accent}22`,
      }}
    >
      <div className="absolute -top-14 -right-14 w-52 h-52 rounded-full blur-3xl pointer-events-none"
        style={{ background: `${accent}14` }} />
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════
   CARD 01 — Frontend
   ════════════════════════════════════════════════════════════════════════════════ */
function FrontendCard({ cap }: { cap: typeof CAPABILITIES[0] }) {
  return (
    <motion.div
      className="cursor-default h-full"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div className="h-full" whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}>
        <CardBase accent={cap.accent}>
          <span className="text-[11px] font-mono font-bold tracking-widest" style={{ color: `${cap.accent}80` }}>{cap.number}</span>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-foreground">{cap.title}</h3>
          <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: cap.accent }}>{cap.subtitle}</p>
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4 flex-1">{cap.body}</p>
          <TagList tags={cap.tags} accent={cap.accent} max={3} />
        </CardBase>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════
   CARD 02 — Performance · MiniGauge
   ════════════════════════════════════════════════════════════════════════════════ */
function MiniGauge({ accent, active }: { accent: string; active: boolean }) {
  const [score, setScore] = useState(0);
  const r = 28; const circ = 2 * Math.PI * r;

  useEffect(() => {
    if (!active) { setScore(0); return; }
    const ctrl = animate(0, 95, {
      duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setScore(Math.round(v)),
    });
    return ctrl.stop;
  }, [active]);

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0">
        <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          <motion.circle cx="32" cy="32" r={r} fill="none"
            stroke={accent} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: active ? circ - (95 / 100) * circ : circ }}
            transition={{ delay: 0.3, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold font-mono" style={{ color: accent }}>{score}</span>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Lighthouse</p>
        <div className="mt-2 flex flex-col gap-1">
          {[["LCP", "1.1s"], ["INP", "58ms"], ["CLS", "0.01"]].map(([label, val]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-muted-foreground/50 w-7">{label}</span>
              <motion.span className="text-[11px] font-mono font-bold" style={{ color: accent }}
                initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >{val}</motion.span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PerformanceCard({ cap }: { cap: typeof CAPABILITIES[1] }) {
  const [active, setActive] = useState(false);
  return (
    <motion.div
      className="cursor-default h-full"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      onViewportEnter={() => setActive(true)}
    >
      <motion.div className="h-full" whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}>
        <CardBase accent={cap.accent}>
          <span className="text-[11px] font-mono font-bold tracking-widest" style={{ color: `${cap.accent}80` }}>{cap.number}</span>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-foreground">{cap.title}</h3>
          <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: cap.accent }}>{cap.subtitle}</p>
          <MiniGauge accent={cap.accent} active={active} />
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3 flex-1">{cap.body}</p>
          <TagList tags={cap.tags} accent={cap.accent} max={3} />
        </CardBase>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════
   CARD 03 — Motion · TiltCard + WebGL tubes
   ════════════════════════════════════════════════════════════════════════════════ */
function MotionFeaturedCard({ cap }: { cap: typeof CAPABILITIES[2] }) {
  const [active, setActive] = useState(false);

  return (
    <motion.div
      className="cursor-default h-full"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      onViewportEnter={() => setActive(true)}
    >
      <TiltCard
        tiltLimit={10} scale={1.02} perspective={1000}
        effect="gravitate" spotlight={true}
        className="h-full rounded-3xl"
        style={{
          background: "color-mix(in oklch, var(--foreground) 4%, transparent)",
          border: `1px solid ${cap.accent}30`,
        }}
      >
        {active && <CardTubesBg />}

        {/* readability gradient */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 90% 70% at 50% 110%, transparent 0%, color-mix(in oklch, var(--background) 55%, transparent) 80%)" }} />

        <div className="relative z-10 h-full flex flex-col gap-5 p-8 md:p-9">
          <span className="text-[11px] font-mono font-bold tracking-widest" style={{ color: `${cap.accent}80` }}>{cap.number}</span>

          <BlurText text={cap.title} as="h3" animateBy="words" direction="top"
            delay={110} stepDuration={0.38}
            className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-foreground" />

          <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: cap.accent }}>{cap.subtitle}</p>
          <p className="text-sm leading-relaxed text-muted-foreground flex-1">{cap.body}</p>
          <TagList tags={cap.tags} accent={cap.accent} />
        </div>
      </TiltCard>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════
   CARD 04 — Produto
   ════════════════════════════════════════════════════════════════════════════════ */
const CRITERIA = [
  "Acessibilidade WCAG 2.1 AA",
  "Core Web Vitals no verde",
  "SEO técnico configurado",
  "Observabilidade pronta",
];

function ProductCard({ cap }: { cap: typeof CAPABILITIES[3] }) {
  return (
    <motion.div
      className="cursor-default h-full"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div className="h-full" whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}>
        <CardBase accent={cap.accent}>
          <span className="text-[11px] font-mono font-bold tracking-widest" style={{ color: `${cap.accent}80` }}>{cap.number}</span>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-foreground">{cap.title}</h3>
          <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: cap.accent }}>{cap.subtitle}</p>
          <div className="flex flex-col gap-2.5 flex-1">
            {CRITERIA.map((item, i) => (
              <motion.div key={item} className="flex items-center gap-2.5"
                initial={{ opacity: 0, x: 14 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ x: 3 }}
              >
                <motion.div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                  style={{ background: cap.accent }}
                  initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 380, damping: 22 }}
                >
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="black" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
                <span className="text-xs text-muted-foreground">{item}</span>
              </motion.div>
            ))}
          </div>
          <TagList tags={cap.tags} accent={cap.accent} max={3} />
        </CardBase>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════
   Section header
   ════════════════════════════════════════════════════════════════════════════════ */
function SectionHeader() {
  return (
    <motion.div className="mb-16 md:mb-20"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">O que entrego</p>
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] max-w-xl">
        Frontend que pesa em decisão de produto, não só em design review.
      </h2>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════
   CapabilitiesBento
   ════════════════════════════════════════════════════════════════════════════════ */
export function CapabilitiesBento() {
  return (
    <section id="capacidades" className="px-6 md:px-12 lg:px-20 py-28 md:py-36">
      <div className="max-w-[1400px] mx-auto">
        <SectionHeader />

        {/* ── Desktop: asymmetric grid ── */}
        <div
          className="hidden md:grid gap-4"
          style={{
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateAreas: `"c01 c01 c03" "c02 c04 c03"`,
          }}
        >
          <div className="[grid-area:c01]"><FrontendCard cap={CAPABILITIES[0]} /></div>
          <div className="[grid-area:c02]"><PerformanceCard cap={CAPABILITIES[1]} /></div>
          <div className="[grid-area:c03]"><MotionFeaturedCard cap={CAPABILITIES[2]} /></div>
          <div className="[grid-area:c04]"><ProductCard cap={CAPABILITIES[3]} /></div>
        </div>

        {/* ── Mobile: stacked ── */}
        <div className="md:hidden flex flex-col gap-4">
          <FrontendCard cap={CAPABILITIES[0]} />
          <PerformanceCard cap={CAPABILITIES[1]} />
          <MotionFeaturedCard cap={CAPABILITIES[2]} />
          <ProductCard cap={CAPABILITIES[3]} />
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════
   CapabilitiesSimplified — editorial fallback
   ════════════════════════════════════════════════════════════════════════════════ */
export function CapabilitiesSimplified() {
  return (
    <section id="capacidades" className="px-6 md:px-12 lg:px-20 py-28 md:py-36 max-w-[1400px] mx-auto">
      <SectionHeader />
      <div className="flex flex-col">
        {CAPABILITIES.map((cap, i) => (
          <motion.div key={cap.number}
            className="grid md:grid-cols-[2fr_3fr] gap-8 md:gap-16 py-14 md:py-16 border-t border-border/20"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col justify-between gap-6">
              <div>
                <span className="text-[11px] font-mono font-bold tracking-widest mb-4 block" style={{ color: cap.accent }}>{cap.number}</span>
                {cap.number === "03"
                  ? <BlurText text={cap.title} as="h3" animateBy="words" direction="top"
                      delay={110} stepDuration={0.38}
                      className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight text-foreground" />
                  : <h3 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight text-foreground">{cap.title}</h3>
                }
              </div>
              <div className="w-10 h-0.5 rounded-full hidden md:block" style={{ background: cap.accent }} />
            </div>
            <div className="flex flex-col gap-5">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: cap.accent }}>{cap.subtitle}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{cap.body}</p>
              <TagList tags={cap.tags} accent={cap.accent} />
            </div>
          </motion.div>
        ))}
        <div className="border-t border-border/20" />
      </div>
    </section>
  );
}

export { CapabilitiesBento as CapabilitiesSection };
