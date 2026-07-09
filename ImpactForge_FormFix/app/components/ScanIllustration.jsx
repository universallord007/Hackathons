"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const JARGON_LINES = [
  { w: "92%" }, { w: "68%" }, { w: "84%" }, { w: "55%" },
  { w: "77%" }, { w: "90%" }, { w: "60%" }, { w: "72%" },
];

/**
 * The signature element: a paper "form" with a highlighter bar that
 * sweeps down the page on loop. Above the bar, lines read as dense,
 * redacted bureaucratic jargon (dark ink bars). Below the bar, the
 * exact same lines are already revealed as clean, highlighted,
 * plain-language text. It's literally what the product does.
 */
export default function ScanIllustration() {
  const [scanY, setScanY] = useState(0);
  const rafRef = useRef();
  const startRef = useRef();

  useEffect(() => {
    const DURATION = 4200;
    function tick(t) {
      if (!startRef.current) startRef.current = t;
      const elapsed = (t - startRef.current) % DURATION;
      setScanY((elapsed / DURATION) * 100);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [-1, 1, -1] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      className="relative mx-auto w-full max-w-md"
    >
      {/* Ambient glow behind the paper */}
      <div className="absolute -inset-6 rounded-[2rem] bg-highlighter/10 blur-3xl" />

      <div className="relative rounded-2xl bg-paper p-6 sm:p-7 paper-shadow overflow-hidden">
        {/* Perforated top edge, like a tear-off government form */}
        <div className="absolute left-0 right-0 top-0 flex justify-between px-3 pt-1.5">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-void/70" />
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between border-b border-ink/15 pb-3">
          <span className="stamp-text text-[10px] text-ink/50">FORM NO. GS-04-B</span>
          <span className="stamp-text rotate-[-6deg] rounded border border-stamp px-2 py-0.5 text-[9px] font-semibold text-stamp">
            OFFICIAL
          </span>
        </div>

        <div className="relative">
          {/* Base layer: dense jargon (always visible above the scan line) */}
          <div className="space-y-3">
            {JARGON_LINES.map((l, i) => (
              <div
                key={i}
                style={{ width: l.w }}
                className="h-3 rounded-sm bg-ink/25"
              />
            ))}
          </div>

          {/* Revealed layer: plain-language, highlighted lines,
              clipped to only show above where the scan bar currently is */}
          <div
            className="absolute inset-0 space-y-3"
            style={{
              clipPath: `inset(0 0 ${100 - scanY}% 0)`,
            }}
          >
            {JARGON_LINES.map((l, i) => (
              <div
                key={i}
                style={{ width: `${Math.max(30, parseInt(l.w) - 15)}%` }}
                className="h-3 rounded-sm bg-highlighter"
              />
            ))}
          </div>

          {/* The scan bar itself */}
          <div
            className="pointer-events-none absolute left-[-8%] right-[-8%] h-[3px]"
            style={{
              top: `${scanY}%`,
              background:
                "linear-gradient(90deg, transparent, #F2C230 20%, #FFE07A 50%, #F2C230 80%, transparent)",
              boxShadow: "0 0 16px 3px rgba(242,194,48,0.65)",
            }}
          />
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-ink/15 pt-3">
          <span className="stamp-text text-[10px] text-ink/40">scanned · simplified · yours</span>
          <span className="h-2 w-2 animate-blink rounded-full bg-stamp" />
        </div>
      </div>
    </motion.div>
  );
}
