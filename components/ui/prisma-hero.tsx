"use client";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { useTheme } from "next-themes";
import { SOCIAL_LINKS } from "@/components/ui/social-island";

const LINKEDIN_HREF =
  SOCIAL_LINKS.find((s) => s.id === "linkedin")?.href ?? "https://www.linkedin.com/in/andrey-azevedo/";

/* ─── WordsPullUp ─────────────────────────────────── */
interface WordsPullUpProps {
  text: string;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

export const WordsPullUp = ({
  text,
  className = "",
  delay = 0,
  style,
}: WordsPullUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");
  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: "110%", opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{
            duration: 0.65,
            delay: delay + i * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
          style={{ marginRight: i < words.length - 1 ? "0.28em" : 0 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

/* ─── ShinyText ───────────────────────────────────── */
interface ShinyTextProps {
  text: string;
  delay?: number;
  color?: string;
  shineColor?: string;
  speed?: number;
  spread?: number;
}

function ShinyText({
  text,
  delay = 0.6,
  color = "#E1E0CC",
  shineColor = "#ffffff",
  speed = 3,
  spread = 120,
}: ShinyTextProps) {
  return (
    <motion.span
      initial={{ y: "110%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="inline-block pb-[0.18em] leading-[0.98]"
      style={{
        backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        // Pure-CSS sweep: reliable on SSR / Vercel builds — no JS frame timing
        animation: `shine-sweep ${speed}s linear ${delay + 0.7}s infinite`,
        // Mínimo de pb para descendentes com background-clip:text; leading alinhado ao h1 (0.9).
      }}
    >
      {text}
    </motion.span>
  );
}

/* ─── Constants ───────────────────────────────────── */
const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4";


const TECH_STACK = [
  "React",
  "Next.js",
  "TypeScript",
  "Angular",
  "Node",
  "GraphQL",
  "Tailwind",
  "AWS",
  "Datadog",
  "Docker",
];

/* ─── PortfolioHero ───────────────────────────────── */
const PortfolioHero = () => {
  const { resolvedTheme } = useTheme();
  // default dark before hydration → no flash
  const isDark = resolvedTheme !== "light";

  // Cream stays constant — bottom vignette always ensures readability
  const textColor = "#E1E0CC";
  // dim the two supporting lines less in light mode so the vignette contrast still reads well
  const dimOpacity = isDark ? 0.6 : 0.88;

  // Outer wrapper bg: blends with the rounded-corner edges of the video container
  const wrapperBg = isDark ? "#09090b" : "#a0724a";

  return (
    <section
      className="h-screen w-full p-2 sm:p-3"
      style={{ background: wrapperBg, transition: "background 1.2s ease" }}
    >
      {/*
        ── Two separate layers:
           1. Visual layer  — overflow-hidden + rounded corners clip only the video/overlays
           2. Text layer    — sibling div, no clip, descenders render freely
      */}
      <div className="relative h-full w-full">

        {/* ── 1. Visual layer (clipped) ──────────────── */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl md:rounded-[2rem]">

          {/* Video background */}
          <motion.video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            src={VIDEO_SRC}
            animate={{
              filter: isDark
                ? "brightness(1) saturate(1) hue-rotate(0deg)"
                : "brightness(1.55) saturate(0.6) hue-rotate(15deg)",
            }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />

          {/* Dark-mode gradient */}
          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/65"
            animate={{ opacity: isDark ? 1 : 0 }}
            transition={{ duration: 1.4 }}
          />

          {/* Light-mode warm overlay */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{ opacity: isDark ? 0 : 1 }}
            transition={{ duration: 1.4 }}
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,200,70,0.35) 0%, rgba(255,150,40,0.18) 35%, rgba(180,100,20,0.05) 60%, rgba(0,0,0,0.62) 100%)",
            }}
          />

          {/* Bottom vignette */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{
              background: isDark
                ? "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 40%, transparent 65%)"
                : "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 45%, transparent 70%)",
            }}
            transition={{ duration: 1.4 }}
          />

          {/* Noise grain */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.55] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: "180px 180px",
            }}
          />
        </div>

        {/* ── 2. Text layer (NOT clipped) ───────────── */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-14 sm:px-6 sm:pb-16 md:px-10 md:pb-20">
          {/* translate-y: compensa o “subir” visual do h1 quando ganhou pb na linha do ShinyText (items-end ancora a base do bloco). */}
          <div className="grid translate-y-5 grid-cols-12 items-end gap-3 sm:translate-y-7 sm:gap-4 md:translate-y-10 lg:translate-y-11">

            {/* Large headline */}
            <div className="col-span-12 lg:col-span-7 xl:col-span-8">
              <h1
                className="font-bold leading-[0.9] tracking-[-0.04em]"
                style={{
                  fontSize: "clamp(2.8rem, 8.5vw, 9rem)",
                  color: textColor,
                }}
              >
                {/* Line 1: no descenders → no pb needed */}
                <motion.span
                  className="block overflow-hidden"
                  animate={{ opacity: dimOpacity }}
                  transition={{ duration: 1.4, ease: "easeInOut" }}
                >
                  <WordsPullUp
                    text="Construo frontends"
                    delay={0}
                    style={{ color: textColor }}
                  />
                </motion.span>
                {/* Line 2: q descender — small pb so it doesn't clip on the animation */}
                <motion.span
                  className="block overflow-hidden pb-[0.18em]"
                  animate={{ opacity: dimOpacity }}
                  transition={{ duration: 1.4, ease: "easeInOut" }}
                >
                  <WordsPullUp
                    text="que aguentam"
                    delay={0.12}
                    style={{ color: textColor }}
                  />
                </motion.span>
                {/* Line 3: -mt leve mantém perto do “que aguentam”; pb/leading no ShinyText evita clip em p/ç */}
                <span className="-mt-[0.03em] block overflow-visible">
                  <ShinyText text="produção" delay={0.72} color={textColor} />
                  <motion.span
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block"
                    style={{ color: textColor }}
                  >.</motion.span>
                </span>
              </h1>
            </div>

            {/* Right column */}
            <div className="col-span-12 flex flex-col gap-3 pb-5 lg:col-span-5 xl:col-span-4 lg:pb-8">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs sm:text-sm leading-relaxed"
                style={{ color: "rgba(225,224,204,0.78)" }}
              >
                Trabalho em sistemas onde frontend não é detalhe. Fintech, banking,
                plataformas de IA. Lugares onde decisão de arquitetura no client
                custa caro errada e rende muito certa.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap gap-2"
              >
                {/* SplitButton: left icon slides in, right icon slides out */}
                <a
                  href={LINKEDIN_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center self-start rounded-full h-11 text-sm font-semibold
                    pl-5 pr-12
                    hover:pl-12 hover:pr-5
                    transition-[padding] duration-500 [transition-timing-function:cubic-bezier(0.76,0,0.24,1)]"
                  style={{ background: "#E1E0CC", color: "#111" }}
                >
                  <span
                    className="absolute left-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-black
                      scale-0 -rotate-45
                      transition-transform duration-500 [transition-timing-function:cubic-bezier(0.76,0,0.24,1)]
                      group-hover:scale-100 group-hover:rotate-0"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-[#E1E0CC]" />
                  </span>
                  Falar sobre projeto
                  <span
                    className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-black
                      scale-100 rotate-0
                      transition-transform duration-500 [transition-timing-function:cubic-bezier(0.76,0,0.24,1)]
                      group-hover:scale-0 group-hover:-rotate-45"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-[#E1E0CC]" />
                  </span>
                </a>
                <a
                  href="#trabalhos"
                  className="inline-flex items-center self-start rounded-full border border-[rgba(225,224,204,0.35)] h-11 px-6 text-sm font-medium text-[#E1E0CC] transition-all duration-300 hover:border-[rgba(225,224,204,0.7)] hover:scale-[1.02]"
                >
                  Ver trabalhos
                </a>
              </motion.div>

              {/* Tech stack badges */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap gap-1.5"
              >
                {TECH_STACK.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      color: "rgba(225,224,204,0.7)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { PortfolioHero };
