"use client";

import React, {
  useState, useEffect, useRef, useCallback, useMemo,
} from "react";
import * as THREE from "three";

/* ─── ASCII helpers ──────────────────────────────────────────────────────────── */
const ASCII_CHARS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/\"'`~?";

const generateCode = (cols: number, rows: number): string => {
  let text = "";
  for (let i = 0; i < cols * rows; i++) {
    text += ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
  }
  let out = "";
  for (let i = 0; i < rows; i++) {
    out += text.substring(i * cols, (i + 1) * cols) + "\n";
  }
  return out;
};

/* ─── Default card images ────────────────────────────────────────────────────── */
const DEFAULT_IMAGES = [
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b55e654d1341fb06f8_4.1.png",
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5a080a31ee7154b19_1.png",
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5c1e4919fd69672b8_3.png",
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5f6a5e232e7beb4be_2.png",
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5bea2f1b07392d936_4.png",
];

/* ─── Props ──────────────────────────────────────────────────────────────────── */
type ScannerCardStreamProps = {
  cardImages?: string[];
  repeat?: number;
  cardGap?: number;
  initialSpeed?: number;
  direction?: -1 | 1;
  friction?: number;
  scanEffect?: "clip" | "scramble";
  /** Called when the user clicks the close / exit button */
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
};

/* ─── Component ──────────────────────────────────────────────────────────────── */
export function ScannerCardStream({
  cardImages = DEFAULT_IMAGES,
  repeat = 6,
  cardGap = 60,
  initialSpeed = 150,
  direction = -1,
  friction = 0.95,
  scanEffect = "scramble",
  onClose,
  className = "",
  style,
}: ScannerCardStreamProps) {
  const [isScanning, setIsScanning] = useState(false);

  const CARD_W = 400;
  const CARD_H = 250;

  const cards = useMemo(() => {
    const total = cardImages.length * repeat;
    return Array.from({ length: total }, (_, i) => ({
      id: i,
      image: cardImages[i % cardImages.length],
      ascii: generateCode(Math.floor(CARD_W / 6.5), Math.floor(CARD_H / 13)),
    }));
  }, [cardImages, repeat]);

  /* ─── Refs ─────────────────────────────────────────────────────────────────── */
  const wrapperRef      = useRef<HTMLDivElement>(null);
  const cardLineRef     = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const scannerCanvasRef  = useRef<HTMLCanvasElement>(null);
  const originalAscii   = useRef(new Map<number, string>());
  const isScanningRef   = useRef(false);

  const state = useRef({
    position:      0,
    velocity:      initialSpeed,
    direction:     direction as -1 | 1,
    isDragging:    false,
    lastMouseX:    0,
    lastTime:      performance.now(),
    cardLineWidth: (CARD_W + cardGap) * cards.length,
    friction,
    minVelocity:   30,
  });

  /* ─── Main effect ────────────────────────────────────────────────────────────*/
  useEffect(() => {
    const wrapper       = wrapperRef.current;
    const cardLine      = cardLineRef.current;
    const particleCanvas = particleCanvasRef.current;
    const scannerCanvas  = scannerCanvasRef.current;
    if (!wrapper || !cardLine || !particleCanvas || !scannerCanvas) return;

    cards.forEach((c) => originalAscii.current.set(c.id, c.ascii));

    /* ── Container dimensions ────────────────────────────────────────────────── */
    const cw = () => wrapper.clientWidth  || window.innerWidth;
    const ch = () => wrapper.clientHeight || 500;

    /* ── Three.js particle layer ─────────────────────────────────────────────── */
    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -cw() / 2, cw() / 2, 125, -125, 1, 1000,
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({
      canvas: particleCanvas, alpha: true, antialias: true,
    });
    renderer.setSize(cw(), CARD_H);
    renderer.setClearColor(0x000000, 0);

    const PARTICLE_COUNT = 400;
    const geo  = new THREE.BufferGeometry();
    const pos  = new Float32Array(PARTICLE_COUNT * 3);
    const vel  = new Float32Array(PARTICLE_COUNT);
    const alph = new Float32Array(PARTICLE_COUNT);

    const texC   = document.createElement("canvas");
    texC.width   = texC.height = 100;
    const tc     = texC.getContext("2d")!;
    const grad   = tc.createRadialGradient(50, 50, 0, 50, 50, 50);
    grad.addColorStop(0.025, "#fff");
    grad.addColorStop(0.1,   "hsl(217,61%,33%)");
    grad.addColorStop(0.25,  "hsl(217,64%,6%)");
    grad.addColorStop(1,     "transparent");
    tc.fillStyle = grad;
    tc.arc(50, 50, 50, 0, Math.PI * 2);
    tc.fill();
    const tex = new THREE.CanvasTexture(texC);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * cw() * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 250;
      vel[i]         = Math.random() * 60 + 30;
      alph[i]        = (Math.random() * 8 + 2) / 10;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos,  3));
    geo.setAttribute("alpha",    new THREE.BufferAttribute(alph, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: { pointTexture: { value: tex } },
      vertexShader: `
        attribute float alpha; varying float vAlpha;
        void main() {
          vAlpha = alpha;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 15.0;
          gl_Position  = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform sampler2D pointTexture; varying float vAlpha;
        void main() {
          gl_FragColor = vec4(1.0,1.0,1.0,vAlpha) * texture2D(pointTexture, gl_PointCoord);
        }`,
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    /* ── Scanner particle canvas ─────────────────────────────────────────────── */
    scannerCanvas.width  = cw();
    scannerCanvas.height = ch();
    const ctx = scannerCanvas.getContext("2d")!;

    const BASE_MAX   = 800;
    const SCAN_MAX   = 2500;
    let curMax       = BASE_MAX;

    type SP = { x:number; y:number; vx:number; vy:number; radius:number; alpha:number; life:number; decay:number };
    const mkP = (): SP => ({
      x:      cw() / 2 + (Math.random() - 0.5) * 3,
      y:      Math.random() * ch(),
      vx:     Math.random() * 0.8 + 0.2,
      vy:     (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 0.6 + 0.4,
      alpha:  Math.random() * 0.4 + 0.6,
      life:   1.0,
      decay:  Math.random() * 0.02 + 0.005,
    });
    let sParticles: SP[] = Array.from({ length: BASE_MAX }, mkP);

    /* ── Scramble effect ─────────────────────────────────────────────────────── */
    const runScramble = (el: HTMLElement, id: number) => {
      if (el.dataset.scrambling === "true") return;
      el.dataset.scrambling = "true";
      const orig = originalAscii.current.get(id) ?? "";
      let n = 0;
      const iv = setInterval(() => {
        el.textContent = generateCode(
          Math.floor(CARD_W / 6.5),
          Math.floor(CARD_H / 13),
        );
        if (++n >= 10) {
          clearInterval(iv);
          el.textContent = orig;
          delete el.dataset.scrambling;
        }
      }, 30);
    };

    /* ── Card intersection + clip ────────────────────────────────────────────── */
    const updateCards = () => {
      const sx    = cw() / 2;
      const sw    = 8;
      const sL    = sx - sw / 2;
      const sR    = sx + sw / 2;
      let scanning = false;

      cardLine.querySelectorAll<HTMLElement>(".sc-card-wrap").forEach((wrap, idx) => {
        const rect  = wrap.getBoundingClientRect();
        const wRect = wrapper.getBoundingClientRect();
        // Use wrapper-relative left
        const relL  = rect.left - wRect.left;
        const relR  = relL + rect.width;

        const norm  = wrap.querySelector<HTMLElement>(".sc-normal")!;
        const ascii = wrap.querySelector<HTMLElement>(".sc-ascii")!;
        const pre   = ascii.querySelector<HTMLElement>("pre")!;

        if (relL < sR && relR > sL) {
          scanning = true;
          if (scanEffect === "scramble" && wrap.dataset.scanned !== "true") {
            runScramble(pre, idx);
          }
          wrap.dataset.scanned = "true";
          const iL = Math.max(sL - relL, 0);
          const iR = Math.min(sR - relL, rect.width);
          norm.style.setProperty("--cr",  `${(iL / rect.width) * 100}%`);
          ascii.style.setProperty("--cl", `${(iR / rect.width) * 100}%`);
        } else {
          delete wrap.dataset.scanned;
          if (relR < sL) {
            norm.style.setProperty("--cr",  "100%");
            ascii.style.setProperty("--cl", "100%");
          } else {
            norm.style.setProperty("--cr",  "0%");
            ascii.style.setProperty("--cl", "0%");
          }
        }
      });

      isScanningRef.current = scanning;
      setIsScanning(scanning);
    };

    /* ── Drag / wheel handlers ───────────────────────────────────────────────── */
    const onDown = (e: MouseEvent | TouchEvent) => {
      state.current.isDragging = true;
      state.current.lastMouseX = "touches" in e ? e.touches[0].clientX : e.clientX;
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!state.current.isDragging) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      const d = x - state.current.lastMouseX;
      state.current.position  += d;
      state.current.velocity   = Math.abs(d) / 0.016;
      state.current.direction  = d > 0 ? 1 : -1;
      state.current.lastMouseX = x;
    };
    const onUp = () => { state.current.isDragging = false; };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const d = e.deltaX || e.deltaY;
      state.current.position  -= d;
      state.current.velocity   = Math.abs(d) * 2;
      state.current.direction  = d > 0 ? -1 : 1;
    };

    cardLine.addEventListener("mousedown",  onDown);
    window.addEventListener("mousemove",    onMove);
    window.addEventListener("mouseup",      onUp);
    cardLine.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("touchmove",    onMove, { passive: true });
    window.addEventListener("touchend",     onUp);
    cardLine.addEventListener("wheel",      onWheel, { passive: false });

    /* ── Animation loop ──────────────────────────────────────────────────────── */
    let raf: number;

    const loop = (t: number) => {
      const dt = (t - state.current.lastTime) / 1000;
      state.current.lastTime = t;

      if (!state.current.isDragging) {
        if (state.current.velocity > state.current.minVelocity) {
          state.current.velocity *= state.current.friction;
        }
        state.current.position +=
          state.current.velocity * state.current.direction * dt;
      }

      const { position, cardLineWidth } = state.current;
      const containerW = cw();
      if (position < -cardLineWidth)  state.current.position = containerW;
      else if (position > containerW) state.current.position = -cardLineWidth;

      cardLine.style.transform = `translateX(${state.current.position}px)`;
      updateCards();

      /* three.js particles */
      const time = t * 0.001;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3]     += vel[i] * 0.016;
        if (pos[i * 3] > cw() / 2 + 100) pos[i * 3] = -cw() / 2 - 100;
        pos[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.5;
        alph[i]         = Math.max(0.1, Math.min(1, alph[i] + (Math.random() - 0.5) * 0.05));
      }
      geo.attributes.position.needsUpdate = true;
      geo.attributes.alpha.needsUpdate    = true;
      renderer.render(scene, camera);

      /* scanner particles */
      ctx.clearRect(0, 0, cw(), ch());
      const tgt = isScanningRef.current ? SCAN_MAX : BASE_MAX;
      curMax += (tgt - curMax) * 0.05;
      while (sParticles.length < curMax) sParticles.push(mkP());
      while (sParticles.length > curMax) sParticles.pop();

      sParticles.forEach((p) => {
        p.x   += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0 || p.x > cw()) Object.assign(p, mkP());
        ctx.globalAlpha = p.alpha * p.life;
        ctx.fillStyle   = "white";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    /* ── Resize ──────────────────────────────────────────────────────────────── */
    const onResize = () => {
      renderer.setSize(cw(), CARD_H);
      camera.left  = -cw() / 2;
      camera.right =  cw() / 2;
      camera.updateProjectionMatrix();
      scannerCanvas.width  = cw();
      scannerCanvas.height = ch();
    };
    window.addEventListener("resize", onResize);

    /* ── Cleanup ─────────────────────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(raf);
      cardLine.removeEventListener("mousedown",  onDown);
      window.removeEventListener("mousemove",    onMove);
      window.removeEventListener("mouseup",      onUp);
      cardLine.removeEventListener("touchstart", onDown);
      window.removeEventListener("touchmove",    onMove);
      window.removeEventListener("touchend",     onUp);
      cardLine.removeEventListener("wheel",      onWheel);
      window.removeEventListener("resize",       onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      tex.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, cardGap, friction, scanEffect]);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full overflow-hidden bg-black ${className}`}
      style={{ minHeight: 500, ...style }}
    >
      <style>{`
        @keyframes glitch {
          0%,16%,50%,100% { opacity:1; }
          15%,99%         { opacity:.9; }
          49%             { opacity:.8; }
        }
        .sc-glitch { animation: glitch .1s infinite linear alternate-reverse; }
        @keyframes scanPulse {
          0%   { opacity:.75; transform:scaleY(1); }
          100% { opacity:1;   transform:scaleY(1.03); }
        }
        .sc-pulse { animation: scanPulse 1.5s infinite alternate ease-in-out; }
      `}</style>

      {/* Three.js particles */}
      <canvas
        ref={particleCanvasRef}
        className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[250px] z-0 pointer-events-none"
      />
      {/* Scanner edge particles */}
      <canvas
        ref={scannerCanvasRef}
        className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-full z-10 pointer-events-none"
      />

      {/* Scanner line */}
      <div
        className={`sc-pulse absolute top-1/2 left-1/2 h-[280px] w-0.5 -translate-x-1/2 -translate-y-1/2
          bg-gradient-to-b from-transparent via-violet-500 to-transparent rounded-full
          transition-opacity duration-300 z-20 pointer-events-none
          ${isScanning ? "opacity-100" : "opacity-0"}`}
        style={{
          boxShadow:
            "0 0 10px #a78bfa, 0 0 20px #a78bfa, 0 0 30px #8b5cf6, 0 0 50px #6366f1",
        }}
      />

      {/* Card stream */}
      <div className="absolute w-full h-full flex items-center">
        <div
          ref={cardLineRef}
          className="flex items-center whitespace-nowrap cursor-grab select-none will-change-transform"
          style={{ gap: `${cardGap}px` }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="sc-card-wrap relative shrink-0"
              style={{ width: CARD_W, height: CARD_H }}
            >
              {/* Normal image layer */}
              <div
                className="sc-normal absolute inset-0 rounded-[15px] overflow-hidden z-[2]"
                style={{ clipPath: "inset(0 0 0 var(--cr,0%))" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt=""
                  className="w-full h-full object-cover brightness-110 contrast-110"
                />
              </div>
              {/* ASCII layer */}
              <div
                className="sc-ascii absolute inset-0 rounded-[15px] overflow-hidden z-[1]"
                style={{ clipPath: "inset(0 calc(100% - var(--cl,0%)) 0 0)" }}
              >
                <pre
                  className="sc-glitch absolute inset-0 text-[rgba(220,210,255,0.6)] font-mono text-[11px] leading-[13px] overflow-hidden whitespace-pre m-0 p-0"
                  style={{
                    maskImage:
                      "linear-gradient(to right,rgba(0,0,0,1) 0%,rgba(0,0,0,.8) 30%,rgba(0,0,0,.6) 50%,rgba(0,0,0,.4) 80%,rgba(0,0,0,.2) 100%)",
                  }}
                >
                  {card.ascii}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 text-[11px] font-mono px-3 py-1.5 rounded-lg border border-white/20 bg-black/40 text-white/60 hover:text-white hover:border-white/50 transition-all cursor-pointer"
        >
          ✕ exit
        </button>
      )}
    </div>
  );
}
