"use client";

import { useScroll, useSpring, motion } from "framer-motion";

/**
 * Thin progress bar at the very top of the viewport.
 * Fills as the user scrolls, fades in after the first 3% to avoid
 * showing on load before any scroll happens.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[99999] origin-left"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, #B86E3F 0%, #D4882A 30%, #8A6E3D 60%, #7A4F2D 85%, #B86E3F 100%)",
        opacity: useSpring(scrollYProgress, { stiffness: 100, damping: 20 }),
      }}
    />
  );
}
