"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";
import { SOCIAL_LINKS } from "@/components/ui/social-island";

export function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const emailHref = SOCIAL_LINKS.find((s) => s.id === "email")?.href ?? "mailto:contato@andrey.dev";
  const githubHref = SOCIAL_LINKS.find((s) => s.id === "github")?.href ?? "#";
  const linkedinHref = SOCIAL_LINKS.find((s) => s.id === "linkedin")?.href ?? "#";

  return (
    <section
      id="contato"
      className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-10"
    >
      <div ref={ref} className="mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Disponível para novos projetos
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
        >
          Vamos construir algo{" "}
          <span className="text-muted-foreground">que valha a pena.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 text-lg text-muted-foreground max-w-xl mx-auto"
        >
          Procuro contextos onde magnitude importa. Fintech, sistemas críticos,
          automação de IA, produtos que atendem escala. Freelancer para projetos
          pontuais ou CLT para construir longo prazo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <motion.a
            href={emailHref}
            className="group inline-flex items-center gap-2 rounded-full bg-foreground py-3 pl-6 pr-2 text-sm font-semibold text-background"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            Enviar e-mail
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:scale-110">
              <ArrowRight className="h-4 w-4" />
            </span>
          </motion.a>

          <div className="flex items-center gap-3">
            <motion.a
              href={githubHref}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground"
              whileHover={{ scale: 1.1, borderColor: "rgba(255,255,255,0.4)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              <SiGithub className="h-4 w-4" />
            </motion.a>
            <motion.a
              href={linkedinHref}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              <FaLinkedinIn className="h-4 w-4" />
            </motion.a>
            <motion.a
              href={emailHref}
              aria-label="Email"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              <Mail className="h-4 w-4" />
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-20 flex flex-col items-center gap-2 text-center text-xs text-muted-foreground"
      >
        <p>© {new Date().getFullYear()} Andrey Rattes · Engenheiro Frontend</p>
        <p className="opacity-60">Construído com Next.js, Tailwind CSS e Framer Motion</p>
      </motion.footer>
    </section>
  );
}
