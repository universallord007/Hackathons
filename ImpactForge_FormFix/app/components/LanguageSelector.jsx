"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, ChevronDown, Check, Loader2 } from "lucide-react";

const GROUPS = [
  {
    label: "Indian languages",
    items: [
      { code: "hi", label: "Hindi" },
      { code: "bn", label: "Bengali" },
      { code: "ta", label: "Tamil" },
      { code: "te", label: "Telugu" },
      { code: "mr", label: "Marathi" },
      { code: "gu", label: "Gujarati" },
      { code: "kn", label: "Kannada" },
      { code: "ml", label: "Malayalam" },
      { code: "pa", label: "Punjabi" },
      { code: "ur", label: "Urdu" },
    ],
  },
  {
    label: "Global",
    items: [
      { code: "es", label: "Spanish" },
      { code: "fr", label: "French" },
      { code: "it", label: "Italian" },
      { code: "de", label: "German" },
      { code: "pt", label: "Portuguese" },
      { code: "ar", label: "Arabic" },
      { code: "zh", label: "Chinese (Simplified)" },
      { code: "ja", label: "Japanese" },
      { code: "ko", label: "Korean" },
      { code: "ru", label: "Russian" },
    ],
  },
];

const ALL_LANGUAGES = [{ code: "en", label: "English" }, ...GROUPS.flatMap((g) => g.items)];

export default function LanguageSelector({ value, onChange, loading }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = ALL_LANGUAGES.find((l) => l.code === value) || ALL_LANGUAGES[0];

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        className="glass-card flex items-center gap-2 rounded-full border border-line px-3.5 py-2 font-mono text-xs text-paper/90 hover:border-mist/60 transition-colors disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-highlighter" />
        ) : (
          <Languages className="h-3.5 w-3.5 text-highlighter" />
        )}
        {current.label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="glass-card absolute right-0 z-20 mt-2 max-h-80 w-52 overflow-y-auto rounded-xl border border-line p-1.5 paper-shadow"
          >
            <button
              onClick={() => {
                onChange("en");
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-mono text-xs text-paper/80 hover:bg-void/60"
            >
              English
              {value === "en" && <Check className="h-3.5 w-3.5 text-highlighter" />}
            </button>

            {GROUPS.map((group) => (
              <div key={group.label} className="mt-1">
                <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-widest text-mist/60">
                  {group.label}
                </p>
                {group.items.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onChange(l.code);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-mono text-xs text-paper/80 hover:bg-void/60"
                  >
                    {l.label}
                    {l.code === value && <Check className="h-3.5 w-3.5 text-highlighter" />}
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}