"use client";
import { useTheme } from "next-themes";
import FlowArt, { FlowSection } from "@/components/ui/story-scroll";
import { SOCIAL_LINKS } from "@/components/ui/social-island";

const LINKEDIN_HREF =
  SOCIAL_LINKS.find((s) => s.id === "linkedin")?.href ?? "https://www.linkedin.com/in/andrey-azevedo/";

interface Step {
  label: string;
  lines: string[];
  body: string;
  tags: string[];
  dark: { bg: string; color: string; accent: string };
  light: { bg: string; color: string; accent: string };
  isCta?: boolean;
}

const STEPS: Step[] = [
  {
    label: "Descoberta sem ruído",
    lines: ["Entendo", "antes de", "construir."],
    body: "Código mais caro é o que resolve problema errado. Começo entendendo o fluxo de verdade, levantando requisito com pergunta, registrando decisão arquitetural em ADR. Não abro editor antes de saber por quê. Refactor evitado custa menos que refactor planejado.",
    tags: ["Fluxo mapeado", "Requisito validado", "ADRs", "Decisão registrada"],
    dark:  { bg: "#0a0f1e", color: "#e2e8f0", accent: "#818cf8" },
    light: { bg: "#F2DCC0", color: "#3D2114", accent: "#B86E3F" },
  },
  {
    label: "Código como conversa",
    lines: ["PR", "não é", "só diff."],
    body: "PR não é só diff. É contexto sobre por que aquela escolha foi feita, qual alternativa foi descartada e o que vai dar errado se alguém mexer sem entender. Reviso com critério em performance, segurança e legibilidade. Recebo feedback sobre padrão que ainda não conheço. Conversa assíncrona por padrão, síncrona quando custa mais explicar do que fazer.",
    tags: ["PR com contexto", "Code review com critério", "Docs que sobrevivem", "Conversa assíncrona"],
    dark:  { bg: "#0f0a1e", color: "#ede9fe", accent: "#a78bfa" },
    light: { bg: "#F0E2B6", color: "#3D2A05", accent: "#C89530" },
  },
  {
    label: "Produção é o padrão",
    lines: ["Local", "mente.", "Produção não."],
    body: "Local é onde tudo funciona. Produção é onde a verdade aparece. Por isso escrevo pensando em produção desde o começo: TypeScript strict, teste no caminho que não pode quebrar, feature flag em mudança grande. Runbook escrito antes do deploy. Observabilidade que deixa debug sem precisar pedir acesso a log no meio da madrugada.",
    tags: ["TypeScript strict", "Feature flags", "Observabilidade", "Zero-downtime"],
    dark:  { bg: "#0a1628", color: "#dbeafe", accent: "#60a5fa" },
    light: { bg: "#DDE2C4", color: "#2E3A1F", accent: "#7A8B5C" },
  },
  {
    label: "Arquitetura resiliente",
    lines: ["Penso no", "time que", "herda."],
    body: "Código não envelhece por ser velho. Envelhece por ser frágil. Construo em camadas: apresentação separada de regra de negócio, inversão de dependência onde faz sentido, teste que protege contrato em vez de testar mock. Já vi time inteiro travado por acoplamento que ninguém mais ousava mexer. Evito chegar nesse ponto.",
    tags: ["Clean architecture", "Teste de contrato", "Co-location", "Domínios isolados"],
    dark:  { bg: "#071a0e", color: "#dcfce7", accent: "#4ade80" },
    light: { bg: "#E6CFAE", color: "#2A1810", accent: "#9C5D2E" },
  },
  {
    label: "Colaboração em escala",
    lines: ["Documento", "antes do", "esquecimento."],
    body: "Quanto mais gente no time, mais o que não está escrito vira gargalo. Trabalhei em time de três e em time de cinquenta no mesmo ano. A diferença que sustenta o segundo: documentação que viaja com o código, decisão registrada antes do esquecimento, onboarding que não depende de uma pessoa específica estar acordada. Junior cresce sem virar deadweight. Sênior para de ser bottleneck.",
    tags: [],
    dark:  { bg: "#09090b", color: "#fafafa", accent: "#fbbf24" },
    light: { bg: "#F0CD8C", color: "#3D2A05", accent: "#D4882A" },
    isCta: true,
  },
];

export function HowWorkSection() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  return (
    <section id="processo">
      <FlowArt aria-label="Como eu trabalho">
        {STEPS.map((step, i) => {
          const t = isDark ? step.dark : step.light;
          return (
            <FlowSection
              key={i}
              aria-label={step.lines.join(" ")}
              style={{ backgroundColor: t.bg, color: t.color }}
            >
              {/* Label */}
              <p
                className="text-[11px] font-bold uppercase tracking-[0.22em]"
                style={{ color: t.accent, opacity: 0.9 }}
              >
                Como eu trabalho · {step.label}
              </p>

              {/* Headline + top divider grouped — removes the flex-1 void on mobile */}
              <div className="flex flex-col">
                <hr style={{ borderTop: `1px solid ${t.color}1a`, margin: "clamp(0.6rem,1.5vw,1.2rem) 0" }} />
                <h2
                  className="font-bold leading-[1] uppercase tracking-tight pb-[0.08em]"
                  style={{ fontSize: "clamp(2.6rem, 8vw, 9.5rem)", color: t.color }}
                >
                  {step.lines.map((line, li) => (
                    <span key={li} className="block">{line}</span>
                  ))}
                </h2>
              </div>

              <hr style={{ borderTop: `1px solid ${t.color}1a`, margin: "clamp(0.6rem,1.5vw,1.2rem) 0" }} />

              {/* Body + tags + optional CTA */}
              <div className={`flex items-end justify-between gap-6 pb-2 ${step.isCta ? "flex-col sm:flex-row sm:flex-wrap" : "flex-wrap"}`}>
                <div className="w-full sm:flex-1 sm:min-w-0 space-y-4">
                  <p
                    className="max-w-[52ch] leading-relaxed"
                    style={{
                      fontSize: "clamp(0.88rem, 1.7vw, 1.35rem)",
                      color: t.color,
                      opacity: 0.75,
                    }}
                  >
                    {step.body}
                  </p>

                  {step.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full px-3 py-1 text-[11px] font-semibold transition-transform duration-150 hover:scale-105 cursor-default"
                          style={{
                            background: `${t.accent}1a`,
                            color: t.accent,
                            border: `1px solid ${t.accent}35`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {step.isCta && (
                  <a
                    href={LINKEDIN_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 rounded-full px-8 py-3.5 text-base font-bold transition-all duration-300 hover:opacity-95 hover:scale-[1.04] active:scale-[0.98] w-full sm:w-auto sm:shrink-0"
                    style={{ background: t.accent, color: isDark ? "#0f172a" : "#431407" }}
                  >
                    Falar sobre projeto →
                  </a>
                )}
              </div>
            </FlowSection>
          );
        })}
      </FlowArt>
    </section>
  );
}
