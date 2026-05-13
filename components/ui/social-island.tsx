"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Transition } from "framer-motion";
import { X, Mail } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";
import { ThemeToggler } from "@/components/ui/theme-toggler";
import { INTRO_DONE_MS } from "@/components/ui/intro-loader";
import { cn } from "@/lib/utils";

const islandTransition: Transition = {
  type: "tween",
  ease: [0.22, 1, 0.36, 1],
  duration: 0.5,
};

export const SOCIAL_LINKS = [
  { id: "github",   name: "GitHub",   Icon: SiGithub,      href: "https://github.com/mechamoandrey" },
  { id: "linkedin", name: "LinkedIn", Icon: FaLinkedinIn,  href: "https://www.linkedin.com/in/andrey-azevedo/" },
  { id: "email",    name: "Email",    Icon: Mail,          href: "mailto:mechamoandrey@gmail.com" },
] as const;

export function SocialIsland({ className }: { className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeSocial = SOCIAL_LINKS.find((s) => s.id === hoveredId);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={islandTransition}
            className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[4px]"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Island */}
      <div className={cn("fixed bottom-[30px] left-1/2 z-[9999] -translate-x-1/2", className)}>
        {/* Entry animation */}
        <motion.div
          initial={{ y: 48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 24, delay: INTRO_DONE_MS / 1000 }}
        >
          {/* Pill shape — animated between collapsed/expanded */}
          <motion.div
            onClick={() => { if (!isExpanded) setIsExpanded(true); }}
            initial={false}
            animate={{
              width: isExpanded ? 340 : 220,
              height: isExpanded ? 216 : 52,
              borderRadius: isExpanded ? 22 : 26,
            }}
            transition={islandTransition}
            style={{ cursor: isExpanded ? "default" : "pointer" }}
            className="relative overflow-hidden border border-foreground/10 bg-background shadow-2xl"
          >

            {/* ── COLLAPSED ── */}
            <motion.div
              initial={false}
              animate={{
                opacity: isExpanded ? 0 : 1,
                scale: isExpanded ? 0.95 : 1,
                filter: isExpanded ? "blur(4px)" : "blur(0px)",
              }}
              transition={{ ...islandTransition, delay: isExpanded ? 0 : 0.12 }}
              className={cn(
                "absolute inset-0 flex items-center gap-3 px-5",
                isExpanded && "pointer-events-none",
              )}
            >
              <div className="w-2 h-2 rounded-full bg-foreground/50 shrink-0" />

              <div className="flex items-center gap-2.5 flex-1">
                {SOCIAL_LINKS.map(({ id, Icon }) => (
                  <span
                    key={id}
                    className={cn(
                      "group/icon-preview relative inline-flex items-center justify-center rounded-lg p-1",
                      "transition-[transform,color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      "motion-reduce:transition-none",
                      "md:hover:-translate-y-0.5 md:hover:scale-[1.12]",
                      "md:active:translate-y-0 md:active:scale-[0.96]",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-3.5 w-3.5 text-foreground/35 transition-colors duration-200",
                        "md:group-hover/icon-preview:text-foreground/75",
                      )}
                    />
                  </span>
                ))}
              </div>

              <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                <ThemeToggler />
              </div>
            </motion.div>

            {/* ── EXPANDED ── */}
            <motion.div
              initial={false}
              animate={{
                opacity: isExpanded ? 1 : 0,
                scale: isExpanded ? 1 : 1.04,
              }}
              transition={{ ...islandTransition, delay: isExpanded ? 0.15 : 0 }}
              className={cn(
                "absolute inset-0 flex flex-col",
                !isExpanded && "pointer-events-none",
              )}
            >
              {/* Header: HoverBrandLogo name reveal */}
              <div className="flex items-start justify-between px-5 pt-5 pb-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                    Conecte-se
                  </p>
                  <div className="relative h-7 overflow-hidden">
                    {/* ghost element keeps width stable */}
                    <p
                      aria-hidden
                      className="text-xl font-bold tracking-tight opacity-0 pointer-events-none select-none whitespace-nowrap leading-7"
                    >
                      LinkedIn
                    </p>
                    <div className="absolute inset-0">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={hoveredId ?? "default"}
                          initial={{ y: 14, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -14, opacity: 0 }}
                          transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="text-xl font-bold text-foreground tracking-tight whitespace-nowrap leading-7"
                        >
                          {activeSocial?.name ?? "abaixo"}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                  className="text-muted-foreground hover:text-foreground transition-colors mt-0.5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Social icon buttons */}
              <div className="flex items-center gap-2 px-4 pb-5">
                {SOCIAL_LINKS.map(({ id, name, Icon, href }) => {
                  const isActive = hoveredId === id;
                  const isDimmed = hoveredId !== null && !isActive;
                  return (
                    <a
                      key={id}
                      href={href}
                      target={id !== "email" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      aria-label={name}
                      onMouseEnter={() => setHoveredId(id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        "flex items-center justify-center p-3.5 rounded-xl border transition-all duration-200",
                        isActive
                          ? "border-foreground/25 text-foreground bg-foreground/[0.06]"
                          : "border-transparent text-foreground/35 hover:text-foreground/60",
                        isDimmed && "opacity-30",
                      )}
                    >
                      <Icon className="w-6 h-6" />
                    </a>
                  );
                })}
              </div>

              {/* Theme toggle footer */}
              <div
                className="mt-auto flex items-center justify-between px-5 py-3"
                style={{ borderTop: "1px solid rgba(128,128,128,0.12)" }}
              >
                <span className="text-[11px] font-medium text-muted-foreground">
                  Alternar tema
                </span>
                <div onClick={(e) => e.stopPropagation()}>
                  <ThemeToggler />
                </div>
              </div>
            </motion.div>

          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
