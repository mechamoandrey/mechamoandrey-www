"use client";
import { useMemo } from "react";
import { Player } from "@remotion/player";
import { InfiniteBentoPan } from "@/components/ui/infinite-bento-pan";
import { useTheme } from "next-themes";

export function BentoPlayer() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const props = useMemo(() => ({ speed: 1, accentColor: "#6366f1" }), []);

  return (
    <div className="relative">
      {isDark && (
        <div className="absolute -inset-px rounded-[28px] bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-blue-500/30 blur-xl pointer-events-none" />
      )}
      <Player
        component={InfiniteBentoPan as React.ComponentType}
        inputProps={props}
        durationInFrames={300}
        fps={30}
        compositionWidth={1280}
        compositionHeight={720}
        autoPlay
        loop
        controls={false}
        clickToPlay={false}
        acknowledgeRemotionLicense
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: "16 / 9",
          borderRadius: 24,
          overflow: "hidden",
          background: "#050505",
          boxShadow: isDark
            ? "0 40px 120px rgba(99,102,241,0.25), 0 0 0 1px rgba(99,102,241,0.15)"
            : "0 40px 120px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
          position: "relative",
        }}
      />
    </div>
  );
}
