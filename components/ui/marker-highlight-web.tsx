"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface MarkerHighlightWebProps {
  before?: string;
  highlight: string;
  after?: string;
  markerColor?: string;
  className?: string;
  delay?: number;
}

export function MarkerHighlightWeb({
  before = "",
  highlight,
  after = "",
  markerColor = "#facc15",
  className,
  delay = 0.6,
}: MarkerHighlightWebProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <span className={className}>
      {before}
      <span ref={ref} style={{ position: "relative", display: "inline" }}>
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 14,
            delay,
          }}
          style={{
            position: "absolute",
            inset: "0 -0.08em",
            background: markerColor,
            transformOrigin: "left center",
            zIndex: 0,
            borderRadius: "0.1em",
          }}
        />
        <motion.span
          initial={{ color: "inherit" }}
          animate={isInView ? { color: "#171717" } : {}}
          transition={{ delay: delay + 0.25, duration: 0.2 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          {highlight}
        </motion.span>
      </span>
      {after}
    </span>
  );
}
