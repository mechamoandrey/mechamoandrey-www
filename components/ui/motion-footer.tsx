"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { SOCIAL_LINKS } from "@/components/ui/social-island";
import { SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";
import { Mail } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Styles ───────────────────────────────────────────────────────────────
const STYLES = `
.cinematic-footer-wrapper {
  -webkit-font-smoothing: antialiased;

  --pill-bg-1: color-mix(in oklch, var(--foreground) 3%, transparent);
  --pill-bg-2: color-mix(in oklch, var(--foreground) 1%, transparent);
  --pill-shadow: color-mix(in oklch, var(--background) 50%, transparent);
  --pill-highlight: color-mix(in oklch, var(--foreground) 10%, transparent);
  --pill-inset-shadow: color-mix(in oklch, var(--background) 80%, transparent);
  --pill-border: color-mix(in oklch, var(--foreground) 8%, transparent);

  --pill-bg-1-hover: color-mix(in oklch, var(--foreground) 8%, transparent);
  --pill-bg-2-hover: color-mix(in oklch, var(--foreground) 2%, transparent);
  --pill-border-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
  --pill-shadow-hover: color-mix(in oklch, var(--background) 70%, transparent);
  --pill-highlight-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
}

@keyframes footer-breathe {
  0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1.12); opacity: 0.9; }
}

@keyframes footer-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100%  { transform: scale(1);   filter: drop-shadow(0 0 5px  color-mix(in oklch, var(--destructive) 50%, transparent)); }
  15%, 45%  { transform: scale(1.25); filter: drop-shadow(0 0 10px color-mix(in oklch, var(--destructive) 80%, transparent)); }
  30%       { transform: scale(1); }
}

.animate-footer-breathe   { animation: footer-breathe  8s ease-in-out infinite alternate; }
.animate-footer-marquee   { animation: footer-marquee  38s linear infinite; }
.animate-footer-heartbeat { animation: footer-heartbeat 2s cubic-bezier(0.25,1,0.5,1) infinite; }

.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right,  color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in oklch, var(--primary) 12%, transparent) 0%,
    color-mix(in oklch, var(--secondary) 10%, transparent) 40%,
    transparent 70%
  );
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow:
    0 10px 30px -10px var(--pill-shadow),
    inset 0 1px 1px var(--pill-highlight),
    inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow:
    0 20px 40px -10px var(--pill-shadow-hover),
    inset 0 1px 1px var(--pill-highlight-hover);
  color: var(--foreground);
}

.footer-giant-bg-text {
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, var(--foreground) 5%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, var(--foreground) 8%, transparent) 0%, transparent 65%);
  -webkit-background-clip: text;
  background-clip: text;
}

.footer-text-glow {
  background: linear-gradient(180deg, var(--foreground) 0%, color-mix(in oklch, var(--foreground) 40%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px color-mix(in oklch, var(--foreground) 12%, transparent));
}
`;

// ─── MagneticButton ────────────────────────────────────────────────────────
type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const el = localRef.current;
      if (!el) return;

      const ctx = gsap.context(() => {
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          gsap.to(el, { x: x * 0.38, y: y * 0.38, rotationX: -y * 0.14, rotationY: x * 0.14, scale: 1.06, ease: "power2.out", duration: 0.4 });
        };
        const onLeave = () => {
          gsap.to(el, { x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1, ease: "elastic.out(1,0.3)", duration: 1.2 });
        };
        el.addEventListener("mousemove", onMove as EventListener);
        el.addEventListener("mouseleave", onLeave);
        return () => {
          el.removeEventListener("mousemove", onMove as EventListener);
          el.removeEventListener("mouseleave", onLeave);
        };
      }, el);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (localRef as React.MutableRefObject<HTMLElement | null>).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// ─── Marquee content ──────────────────────────────────────────────────────
function MarqueeItem() {
  const items = [
    "Fintech",
    "Sistemas Críticos",
    "Performance Web",
    "Automação com IA",
    "Zero Downtime",
    "Core Web Vitals",
    "Observabilidade",
    "Clean Architecture",
  ];
  return (
    <div className="flex items-center space-x-10 px-6">
      {items.map((item, i) => (
        <React.Fragment key={item}>
          <span>{item}</span>
          {i < items.length - 1 && (
            <span className="text-foreground/25">✦</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── CinematicFooter ──────────────────────────────────────────────────────
export function CinematicFooter() {
  const wrapperRef    = useRef<HTMLDivElement>(null);
  const giantTextRef  = useRef<HTMLDivElement>(null);
  const headingRef    = useRef<HTMLHeadingElement>(null);
  const linksRef      = useRef<HTMLDivElement>(null);

  const emailHref    = SOCIAL_LINKS.find((s) => s.id === "email")?.href    ?? "mailto:contato@email.com";
  const githubHref   = SOCIAL_LINKS.find((s) => s.id === "github")?.href   ?? "#";
  const linkedinHref = SOCIAL_LINKS.find((s) => s.id === "linkedin")?.href ?? "#";

  useEffect(() => {
    if (typeof window === "undefined" || !wrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "12vh", scale: 0.85, opacity: 0 },
        {
          y: "0vh", scale: 1, opacity: 1, ease: "power1.out",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 85%", end: "bottom bottom", scrub: 1 },
        }
      );
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 48, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.14, ease: "power3.out",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 45%", end: "bottom bottom", scrub: 1 },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/*
        Curtain reveal: clip-path mantém o conteúdo visível só dentro deste bloco.
        O footer interno fica `position: fixed` — sobe pela página conforme o scroll avança.
      */}
      <div
        ref={wrapperRef}
        className="relative h-screen w-full"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <footer
          id="contato"
          className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-background text-foreground cinematic-footer-wrapper"
        >
          {/* Aurora glow */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0" />

          {/* Grid */}
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Giant background text */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute -bottom-[4vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none"
          >
            ANDREY
          </div>

          {/* Marquee */}
          <div className="absolute top-10 left-0 w-full overflow-hidden border-y border-border/40 bg-background/50 backdrop-blur-md py-3.5 z-10 -rotate-[1.5deg] scale-110 shadow-xl">
            <div className="flex w-max animate-footer-marquee text-[11px] font-bold tracking-[0.28em] text-muted-foreground uppercase">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* Centro — CTA principal */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-16 w-full max-w-4xl mx-auto">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground mb-5">
              Disponível para novos projetos
            </p>

            <h2
              ref={headingRef}
              className="text-4xl sm:text-6xl md:text-7xl font-black footer-text-glow tracking-tight mb-12 text-center leading-[0.9]"
            >
              Vamos construir algo<br />
              <span className="text-muted-foreground font-black">que valha a pena.</span>
            </h2>

            <div ref={linksRef} className="flex flex-col items-center gap-5 w-full">
              {/* CTA email */}
              <MagneticButton
                as="a"
                href={emailHref}
                className="footer-glass-pill px-10 py-4 rounded-full text-foreground font-bold text-sm flex items-center gap-3 group"
              >
                <Mail className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                Enviar e-mail
              </MagneticButton>

              {/* Social links */}
              <div className="flex items-center gap-3 mt-1">
                <MagneticButton
                  as="a"
                  href={githubHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="footer-glass-pill w-11 h-11 rounded-full flex items-center justify-center text-muted-foreground"
                >
                  <SiGithub className="h-4 w-4" />
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href={linkedinHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="footer-glass-pill w-11 h-11 rounded-full flex items-center justify-center text-muted-foreground"
                >
                  <FaLinkedinIn className="h-4 w-4" />
                </MagneticButton>
              </div>

              <p className="text-sm text-muted-foreground max-w-[44ch] text-center leading-relaxed mt-2">
                Fintech, sistemas críticos, automação com IA — contextos onde magnitude importa.
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="relative z-20 w-full pb-7 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase order-2 md:order-1">
              © {new Date().getFullYear()} Andrey Rattes · Engenheiro Frontend
            </p>

            <div className="footer-glass-pill px-5 py-2.5 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default">
              <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Construído com</span>
              <span className="animate-footer-heartbeat text-sm">❤</span>
              <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">usando</span>
              <span className="text-foreground font-black text-xs ml-1">Next.js</span>
            </div>

            <MagneticButton
              as="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Voltar ao topo"
              className="w-11 h-11 rounded-full footer-glass-pill flex items-center justify-center text-muted-foreground hover:text-foreground group order-3"
            >
              <svg className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </MagneticButton>
          </div>
        </footer>
      </div>
    </>
  );
}
