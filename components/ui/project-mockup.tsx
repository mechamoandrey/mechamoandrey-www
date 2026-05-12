"use client";

/* ─── Mockup 01 — Plataforma Bancária ───────────────────────────────── */
function BankingMockup({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Dashboard card */}
      <rect x="20" y="20" width="170" height="90" rx="12" fill={`${accent}18`} stroke={`${accent}30`} strokeWidth="1" />
      <rect x="36" y="36" width="60" height="8" rx="4" fill={`${accent}40`} />
      <rect x="36" y="52" width="100" height="20" rx="4" fill={`${accent}25`} />
      <rect x="36" y="80" width="44" height="6" rx="3" fill={`${accent}30`} />

      {/* Chart card */}
      <rect x="210" y="20" width="170" height="90" rx="12" fill={`${accent}18`} stroke={`${accent}30`} strokeWidth="1" />
      <polyline
        points="224,90 248,72 272,78 296,55 320,62 344,42 368,50"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.9"
      />
      <polyline
        points="224,90 248,72 272,78 296,55 320,62 344,42 368,50 368,95 224,95"
        fill={`${accent}15`}
        stroke="none"
      />
      {[248, 272, 296, 320, 344].map((x, i) => (
        <circle key={i} cx={x} cy={[72, 78, 55, 62, 42][i]} r="3" fill={accent} opacity="0.8" />
      ))}

      {/* Transaction list */}
      <rect x="20" y="130" width="360" height="145" rx="12" fill={`${accent}10`} stroke={`${accent}20`} strokeWidth="1" />
      <rect x="36" y="146" width="80" height="6" rx="3" fill={`${accent}35`} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx="52" cy={174 + i * 26} r="10" fill={`${accent}20`} />
          <rect x="70" y={168 + i * 26} width={60 + (i % 3) * 20} height="6" rx="3" fill={`${accent}30`} />
          <rect x="70" y={178 + i * 26} width={40 + (i % 2) * 15} height="4" rx="2" fill={`${accent}18`} />
          <rect x="320" y={168 + i * 26} width={50 - i * 5} height="6" rx="3" fill={`${accent}35`} />
        </g>
      ))}
    </svg>
  );
}

/* ─── Mockup 02 — Acquisition Platform ─────────────────────────────── */
function PerformanceMockup({ accent }: { accent: string }) {
  const score = 95;
  const r = 70;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ * 0.75; // 270° arc

  return (
    <svg viewBox="0 0 400 300" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Lighthouse ring */}
      <g transform="translate(130, 150)">
        <circle cx="0" cy="0" r={r} stroke={`${accent}20`} strokeWidth="10" fill="none" />
        <circle
          cx="0" cy="0" r={r}
          stroke={accent}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`}
          transform="rotate(-225)"
          opacity="0.9"
        />
        <text x="0" y="-10" textAnchor="middle" fill={accent} fontSize="32" fontWeight="bold" fontFamily="monospace">{score}</text>
        <text x="0" y="14" textAnchor="middle" fill={accent} fontSize="10" opacity="0.6" fontFamily="monospace">LIGHTHOUSE</text>
      </g>

      {/* Vitals bars */}
      <g transform="translate(240, 60)">
        {[
          { label: "LCP", value: "1.1s", pct: 0.88 },
          { label: "INP", value: "58ms", pct: 0.72 },
          { label: "CLS", value: "0.01", pct: 0.96 },
        ].map((v, i) => (
          <g key={v.label} transform={`translate(0, ${i * 64})`}>
            <text x="0" y="14" fill={accent} fontSize="10" fontWeight="bold" opacity="0.6" fontFamily="monospace">{v.label}</text>
            <text x="110" y="14" fill={accent} fontSize="12" fontWeight="bold" fontFamily="monospace">{v.value}</text>
            <rect x="0" y="22" width="140" height="6" rx="3" fill={`${accent}18`} />
            <rect x="0" y="22" width={140 * v.pct} height="6" rx="3" fill={accent} opacity="0.8" />
          </g>
        ))}
      </g>

      {/* Bottom label */}
      <rect x="20" y="245" width="360" height="32" rx="8" fill={`${accent}12`} stroke={`${accent}20`} strokeWidth="1" />
      <rect x="36" y="257" width="80" height="6" rx="3" fill={`${accent}35`} />
      <rect x="200" y="257" width="60" height="6" rx="3" fill={`${accent}25`} />
      <rect x="276" y="257" width="44" height="6" rx="3" fill={`${accent}18`} />
    </svg>
  );
}

/* ─── Mockup 03 — AI Automation ─────────────────────────────────────── */
function AIMockup({ accent }: { accent: string }) {
  const nodes = [
    { x: 200, y: 60, label: "Input" },
    { x: 90,  y: 150, label: "LLM" },
    { x: 200, y: 150, label: "Router" },
    { x: 310, y: 150, label: "Tools" },
    { x: 140, y: 250, label: "Output" },
    { x: 260, y: 250, label: "Store" },
  ];
  const edges = [
    [0, 2], [2, 1], [2, 3], [1, 4], [3, 5], [2, 4],
  ];

  return (
    <svg viewBox="0 0 400 300" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Edges */}
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke={accent}
          strokeWidth="1.5"
          opacity="0.3"
          strokeDasharray="4 3"
        />
      ))}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <g key={i}>
          <circle cx={node.x} cy={node.y} r="26" fill={`${accent}18`} stroke={accent} strokeWidth="1.5" opacity="0.9" />
          <circle cx={node.x} cy={node.y} r="18" fill={`${accent}25`} />
          <text
            x={node.x} y={node.y + 4}
            textAnchor="middle"
            fill={accent}
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
            opacity="0.9"
          >
            {node.label}
          </text>
        </g>
      ))}

      {/* Status bar */}
      <rect x="20" y="272" width="360" height="16" rx="4" fill={`${accent}12`} />
      <rect x="20" y="272" width="290" height="16" rx="4" fill={`${accent}28`} />
      <text x="32" y="283" fill={accent} fontSize="8" fontFamily="monospace" opacity="0.7">running pipeline · 3 tasks active</text>
    </svg>
  );
}

/* ─── Mockup 04 — Design System ─────────────────────────────────────── */
function DesignSystemMockup({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Button components */}
      <rect x="20" y="20" width="110" height="36" rx="18" fill={accent} opacity="0.85" />
      <rect x="140" y="20" width="110" height="36" rx="18" fill={`${accent}20`} stroke={accent} strokeWidth="1.5" opacity="0.85" />
      <rect x="260" y="20" width="110" height="36" rx="18" fill="none" stroke={`${accent}50`} strokeWidth="1.5" opacity="0.85" />
      {[20, 140, 260].map((x, i) => (
        <rect key={i} x={x + 28} y={34} width={55} height={7} rx="3.5" fill={i === 0 ? "rgba(0,0,0,0.5)" : accent} opacity={i === 0 ? 1 : 0.5} />
      ))}

      {/* Input component */}
      <rect x="20" y="80" width="360" height="44" rx="10" fill={`${accent}10`} stroke={`${accent}30`} strokeWidth="1.5" />
      <rect x="36" y="98" width="100" height="7" rx="3.5" fill={`${accent}30`} />
      <rect x="340" y="93" width="18" height="18" rx="4" fill={`${accent}20`} />

      {/* Color tokens */}
      <text x="20" y="158" fill={accent} fontSize="10" opacity="0.5" fontFamily="monospace" fontWeight="bold">COLOR TOKENS</text>
      {[accent, `${accent}cc`, `${accent}88`, `${accent}44`, `${accent}22`].map((c, i) => (
        <g key={i}>
          <rect x={20 + i * 72} y="166" width="58" height="58" rx="10" fill={c} />
          <rect x={20 + i * 72} y="230" width="58" height="7" rx="3.5" fill={`${accent}25`} />
        </g>
      ))}

      {/* Badge row */}
      {["sm", "md", "lg", "xl"].map((s, i) => (
        <rect key={s} x={20 + i * 90} y="260" width={70} height="26" rx="13"
          fill={`${accent}${i === 1 ? "35" : "18"}`}
          stroke={`${accent}${i === 1 ? "60" : "30"}`}
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

/* ─── Export ─────────────────────────────────────────────────────────── */
export type MockupType = "banking" | "performance" | "ai" | "design";

export function ProjectMockup({ type, accent }: { type: MockupType; accent: string }) {
  if (type === "banking")     return <BankingMockup accent={accent} />;
  if (type === "performance") return <PerformanceMockup accent={accent} />;
  if (type === "ai")          return <AIMockup accent={accent} />;
  if (type === "design")      return <DesignSystemMockup accent={accent} />;
  return null;
}
