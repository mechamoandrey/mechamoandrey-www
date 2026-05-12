"use client";

import { useRef, useLayoutEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { ProjectMockup, MockupType } from "@/components/ui/project-mockup";
import { PerspectiveMarquee } from "@/components/ui/perspective-marquee";

gsap.registerPlugin(ScrollTrigger);

// ─── Palette ────────────────────────────────────────────────────────────────
// Fundos quase-pretos neutros — a cor vem do accent, não do background saturado.
// Isso muda o tom de "hacker" para editorial/cinematográfico.
const PROJECTS: {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  accent: string;
  bg: string;
  stat: string;
  mockup: MockupType;
}[] = [
  {
    id: "01",
    slug: "plataforma-bancaria",
    title: "Plataforma Bancária",
    category: "Fintech · Produção crítica",
    year: "2021 / 2024",
    description:
      "Plataforma financeira de alta disponibilidade onde downtime vira manchete. Conduzi migração incremental do legado com feature flag em ambiente real e observabilidade fim a fim. Quando algo quebrava, eu sabia onde antes do ticket abrir.",
    tags: ["Angular", "TypeScript", "Datadog", "Feature Flags"],
    accent: "#818cf8",
    bg: "#0d0d12",
    stat: "1M+ usuários/mês",
    mockup: "banking",
  },
  {
    id: "02",
    slug: "acquisition-platform",
    title: "Acquisition Platform",
    category: "Growth · Red Ventures",
    year: "2019 / 2021",
    description:
      "Plataforma de aquisição de alto tráfego onde cada décimo no LCP virava conversão perdida. Lighthouse saiu de 28 para 95+, LCP em produção abaixo de 1.2s. O time de growth parou de culpar o frontend nas reuniões.",
    tags: ["Next.js", "Core Web Vitals", "A/B Testing", "Edge Cache"],
    accent: "#c9963a",
    bg: "#111009",
    stat: "Lighthouse 28 → 95+",
    mockup: "performance",
  },
  {
    id: "03",
    slug: "ai-automation-flows",
    title: "AI Automation Flows",
    category: "Automação · Freelance",
    year: "2024 / presente",
    description:
      "Fluxos automatizados com LLM em produção para clientes de setores variados. Painel de monitoramento próprio, fila com retry visível, custo por execução rastreado. IA que entrega resultado sem virar caixa preta.",
    tags: ["React", "LLM Integration", "Automation", "Monitoring"],
    accent: "#3aaa78",
    bg: "#0b1010",
    stat: "Múltiplos clientes",
    mockup: "ai",
  },
  {
    id: "04",
    slug: "design-system",
    title: "Design System",
    category: "Infraestrutura · Produto",
    year: "2023",
    description:
      "Design system com tokens semânticos, componentes acessíveis por padrão e documentação que time de produto entendia sem precisar de reunião. Quando outro time precisava de Button novo, ninguém abria ticket. Abria PR.",
    tags: ["React", "WCAG 2.1", "Storybook", "Tailwind"],
    accent: "#9d8ee8",
    bg: "#0f0d14",
    stat: "WCAG 2.1 AA",
    mockup: "design",
  },
];

/* ─── TiltCard ─────────────────────────────────────────────────────── */
function TiltCard({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [4, -4]), { stiffness: 260, damping: 30 });
  const rotateY = useSpring(useTransform(rawX, [-1, 1], [-4, 4]), { stiffness: 260, damping: 30 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  }, [rawX, rawY]);

  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <motion.div
      ref={cardRef}
      className={className}
      style={{ ...style, rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  );
}

/* ─── ComingSoonOverlay ─────────────────────────────────────────────── */
function ComingSoonOverlay({ accent, bg }: { accent: string; bg: string }) {
  return (
    <div className="absolute inset-0 z-20 rounded-3xl overflow-hidden pointer-events-none">
      {/* Frosted backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-[8px]"
        style={{ background: `color-mix(in srgb, ${bg} 94%, transparent)` }}
      />

      {/* Perspective marquee — direct DOM animation, zero re-renders */}
      <PerspectiveMarquee
        items={["EM BREVE", "·", "EM BREVE", "·", "EM BREVE", "·"]}
        fontSize={62}
        color={`${accent}50`}
        fontWeight={800}
        pixelsPerFrame={1.4}
        rotateY={-22}
        rotateX={5}
        perspective={900}
        fadeColor={bg}
        background="transparent"
      />

    </div>
  );
}

/* ─── ProjectCard (layout editorial) ───────────────────────────────── */
function ProjectCard({ project }: { project: (typeof PROJECTS)[number] }) {
  return (
    <div
      className="w-full h-full rounded-3xl overflow-hidden relative flex flex-col justify-between p-10 lg:p-14"
      style={{ background: project.bg }}
    >
      {/* Atmospheric glow — accent color, very low opacity, top-right */}
      <div
        className="absolute top-0 right-0 w-[65%] h-[65%] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 80% 20%, ${project.accent}14 0%, transparent 65%)`,
        }}
      />

      {/* Mockup — large, ghosted, positioned bottom-right as decorative layer */}
      <div
        className="absolute bottom-0 right-0 w-[52%] pointer-events-none select-none"
        style={{ opacity: 0.07 }}
        aria-hidden
      >
        <ProjectMockup type={project.mockup} accent={project.accent} />
      </div>

      {/* ── Top row: meta + link ── */}
      <div className="relative flex items-start justify-between">
        <div>
          <p
            className="text-[11px] font-bold uppercase tracking-[0.22em] mb-1"
            style={{ color: project.accent }}
          >
            {project.category}
          </p>
          <span className="text-xs font-mono text-white/30">{project.year}</span>
        </div>
        <span
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold opacity-40 cursor-default select-none"
          style={{
            background: `${project.accent}14`,
            color: project.accent,
            border: `1px solid ${project.accent}28`,
          }}
        >
          Em breve <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>

      {/* ── Title — protagonista da composição ── */}
      <div className="relative">
        <h3
          className="font-bold tracking-tight leading-[0.9] text-white"
          style={{ fontSize: "clamp(2.4rem, 4.2vw, 5rem)" }}
        >
          {project.title}
        </h3>
      </div>

      {/* ── Bottom: description + tags + stat ── */}
      <div className="relative flex flex-col gap-5">
        <p className="text-sm leading-relaxed text-white/55 max-w-[46ch]">
          {project.description}
        </p>

        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                style={{
                  background: `${project.accent}0e`,
                  color: `${project.accent}cc`,
                  border: `1px solid ${project.accent}20`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <span
            className="shrink-0 text-xl font-bold font-mono"
            style={{ color: project.accent }}
          >
            {project.stat}
          </span>
        </div>
      </div>

      {/* EM BREVE overlay */}
      <ComingSoonOverlay accent={project.accent} bg={project.bg} />
    </div>
  );
}

/* ─── WorksHorizontal ──────────────────────────────────────────────── */
export function WorksHorizontal() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const getWidth = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tween = gsap.to(track, {
          x: () => -getWidth(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getWidth()}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.8,
            fastScrollEnd: true,
            anticipatePin: 0,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="trabalhos"
      className="overflow-hidden"
      style={{ overflowX: "clip" }}
    >
      {/* ══ MOBILE ══════════════════════════════════════════════════════ */}
      <div className="md:hidden px-5 py-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground mb-5">
          Trabalhos selecionados
        </p>
        <h2 className="text-4xl font-bold tracking-tight leading-[0.9] mb-4">
          Já rodou em<br />produção.
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-10">
          Projetos em fintech, growth e IA aplicada. Cada um com a decisão técnica que importou e o número que saiu.
        </p>

        <div className="flex flex-col gap-4">
          {PROJECTS.map((project) => (
            <div key={project.id} className="h-[480px]" style={{ perspective: "800px" }}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>

      {/* ══ DESKTOP — GSAP horizontal scroll ════════════════════════════ */}
      <div ref={trackRef} className="hidden md:flex h-screen relative z-10">

        {/* Intro panel */}
        <div className="w-[46vw] shrink-0 flex flex-col justify-center px-14 lg:px-20 pointer-events-none">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground mb-5">
            Trabalhos selecionados
          </p>
          <h2
            className="font-bold tracking-tight leading-[0.88]"
            style={{ fontSize: "clamp(3rem, 5.5vw, 6.5rem)" }}
          >
            Já rodou em<br />produção.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-[32ch] text-base leading-relaxed">
            Projetos em fintech, growth e IA aplicada. Cada um com a decisão técnica que importou e o número que saiu.
          </p>
          <div className="mt-10 flex items-center gap-3 text-xs text-muted-foreground/35 select-none">
            <div className="flex gap-1.5">
              {PROJECTS.map((_, i) => (
                <div key={i} className="h-[2px] w-5 rounded-full bg-foreground/12" />
              ))}
            </div>
            <span>scroll para explorar →</span>
          </div>
        </div>

        {/* Project cards */}
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            className="w-[72vw] shrink-0 flex items-center justify-center py-10 px-6 lg:px-8"
            style={{ perspective: "1000px" }}
          >
            <TiltCard className="w-full h-[82vh]">
              <ProjectCard project={project} />
            </TiltCard>
          </div>
        ))}
      </div>
    </section>
  );
}
