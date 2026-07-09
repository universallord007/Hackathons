"use client";

import { motion } from "framer-motion";
import { ScanLine, BrainCircuit, Languages, CheckCircle2, Circle, Loader2 } from "lucide-react";

const STEPS = [
  { key: "ocr", label: "Reading the document", sub: "scanning text and layout", icon: ScanLine },
  { key: "simplify", label: "Rewriting in plain language", sub: "our AI agent is evaluating the form", icon: BrainCircuit },
  { key: "translate", label: "Translating", sub: "regional language", icon: Languages },
];

/**
 * stage: "ocr" | "simplify" | "translate"
 * Steps before the current stage are shown as done, current as active,
 * later ones as pending. If stage is "translate" but translation wasn't
 * requested, callers simply won't render this stage.
 */
export default function LoadingState({ stage, activeSteps }) {
  const steps = STEPS.filter((s) => activeSteps.includes(s.key));
  const currentIndex = steps.findIndex((s) => s.key === stage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="glass-card w-full rounded-2xl border border-line px-6 py-8 sm:px-10 sm:py-10"
    >
      <div className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-highlighter">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-highlighter opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-highlighter" />
        </span>
        processing_pipeline.run()
      </div>

      <div className="space-y-5">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const done = i < currentIndex;
          const active = i === currentIndex;

          return (
            <div key={step.key} className="flex items-center gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors
                ${done ? "border-highlighter/40 bg-highlighter/10 text-highlighter" : ""}
                ${active ? "border-highlighter bg-highlighter text-ink" : ""}
                ${!done && !active ? "border-line text-mist" : ""}`}
              >
                {active ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : done ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`font-display text-sm font-medium ${
                    active ? "text-paper" : done ? "text-paper/80" : "text-mist"
                  }`}
                >
                  {step.label}
                </p>
                <p className="font-mono text-[11px] text-mist/70">{step.sub}</p>
              </div>

              {i < steps.length - 1 && (
                <div className="hidden sm:block" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-7 h-px w-full bg-line" />
      <p className="mt-4 font-mono text-[11px] text-mist">
        avg. total time: <span className="text-paper/70">6–12s</span> · nothing leaves this
        pipeline except the text needed to simplify your document
      </p>
    </motion.div>
  );
}
