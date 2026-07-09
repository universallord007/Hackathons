"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ChevronDown, RotateCcw, Gauge, AlertCircle } from "lucide-react";
import LanguageSelector from "./LanguageSelector";

export default function ResultCard({
  summary,
  rawText,
  confidence,
  ocrWarning,
  lang,
  onLangChange,
  translating,
  onReset,
}) {
  const [showRaw, setShowRaw] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card w-full rounded-2xl border border-line p-5 sm:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-mist">
          <FileText className="h-3.5 w-3.5 text-highlighter" />
          Plain-language result
          {typeof confidence === "number" && (
            <span className="ml-2 flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[10px] normal-case text-mist">
              <Gauge className="h-3 w-3" />
              {Math.round(confidence)}% scan confidence
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector value={lang} onChange={onLangChange} loading={translating} />
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-full border border-line px-3 py-2 font-mono text-xs text-mist hover:text-paper hover:border-mist/60 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            New form
          </button>
        </div>
      </div>

      {ocrWarning && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-highlighter/30 bg-highlighter/[0.07] px-3.5 py-2.5 font-mono text-xs text-highlighter">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {ocrWarning}
        </div>
      )}

      <motion.p
        key={summary}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="mt-5 rounded-xl bg-highlighter/[0.08] p-4 font-body text-[15px] leading-relaxed text-paper border-l-2 border-highlighter"
      >
        {summary}
      </motion.p>

      <button
        onClick={() => setShowRaw((s) => !s)}
        className="mt-4 flex items-center gap-1.5 font-mono text-[11px] text-mist hover:text-paper transition-colors"
      >
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showRaw ? "rotate-180" : ""}`} />
        {showRaw ? "Hide" : "Show"} original scanned text
      </button>

      <AnimatePresence>
        {showRaw && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <pre className="mt-3 max-h-52 overflow-y-auto whitespace-pre-wrap rounded-xl border border-line bg-void p-4 font-mono text-[12px] leading-relaxed text-mist">
              {rawText}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
