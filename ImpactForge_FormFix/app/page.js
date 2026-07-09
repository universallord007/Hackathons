"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ScanLine,
  BrainCircuit,
  ListChecks,
  ArrowDown,
  ShieldCheck,
  Type,
  Globe2,
  Home as HomeIcon,
  UploadCloud,
} from "lucide-react";

import UploadBox from "./components/UploadBox";
import LoadingState from "./components/LoadingState";
import ResultCard from "./components/ResultCard";
import ChecklistPanel from "./components/ChecklistPanel";
import ScanIllustration from "./components/ScanIllustration";
import AmbientBackground from "./components/AmbientBackground";

const TIMELINE = [
  {
    icon: ScanLine,
    title: "Snap",
    body: "Upload a photo of the confusing form — a phone camera shot is enough, no scanner needed.",
  },
  {
    icon: BrainCircuit,
    title: "Simplify",
    body: "Our AI agent rewrites it at a grade-8 reading level and separates what's mandatory from optional.",
  },
  {
    icon: ListChecks,
    title: "Solve",
    body: "Get a concrete document checklist and every deadline or trap flagged, in the language you're comfortable in.",
  },
];

export default function Home() {
  const heroRef = useRef(null);
  const howRef = useRef(null);
  const appRef = useRef(null);

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const [stage, setStage] = useState("idle"); // idle | ocr | simplify | done
  const [error, setError] = useState(null);

  const [ocr, setOcr] = useState(null);
  const [result, setResult] = useState(null);
  const [displayResult, setDisplayResult] = useState(null);
  const [lang, setLang] = useState("en");
  const [translating, setTranslating] = useState(false);

  async function handleUpload(file) {
    setError(null);
    setOcr(null);
    setResult(null);
    setDisplayResult(null);
    setLang("en");
    setStage("ocr");

    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("lang", "eng");

      const ocrRes = await fetch("/api/ocr", { method: "POST", body: fd });
      const ocrJson = await ocrRes.json();

      if (!ocrRes.ok) {
        setError(ocrJson.message || "We couldn't read this image.");
        setStage("idle");
        return;
      }
      setOcr(ocrJson);
      setStage("simplify");

      const simRes = await fetch("/api/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ocrJson.text }),
      });
      const simJson = await simRes.json();

      if (!simRes.ok) {
        setError(simJson.message || "We couldn't simplify this document.");
        setStage("idle");
        return;
      }

      setResult(simJson);
      setDisplayResult(simJson);
      setStage("done");
    } catch (e) {
      console.error(e);
      setError("Something went wrong talking to the server. Please try again.");
      setStage("idle");
    }
  }

  async function handleLangChange(code) {
    setLang(code);
    if (!result) return;

    if (code === "en") {
      setDisplayResult(result);
      return;
    }

    setTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result, targetLang: code }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Translation failed, showing English instead.");
        setDisplayResult(result);
      } else {
        setDisplayResult(json);
      }
    } catch {
      setDisplayResult(result);
    } finally {
      setTranslating(false);
    }
  }

  function reset() {
    setStage("idle");
    setError(null);
    setOcr(null);
    setResult(null);
    setDisplayResult(null);
    setLang("en");
  }

  const activeSteps = ["ocr", "simplify"];

  return (
    <main ref={heroRef} className="relative min-h-screen text-paper">
      <AmbientBackground />

      {/* ============ TOP APP BAR ============ */}
      <header className="glass-nav sticky top-0 z-40 border-b border-line/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
          <button
            onClick={() => scrollTo(heroRef)}
            className="flex items-baseline gap-0.5 font-display text-lg font-bold"
          >
            <span className="text-paper">Form</span>
            <span className="rounded bg-highlighter px-1.5 text-ink">Fix</span>
          </button>

          <nav className="hidden items-center gap-7 font-mono text-xs uppercase tracking-widest text-mist sm:flex">
            <button onClick={() => scrollTo(howRef)} className="hover:text-paper transition-colors">
              How it works
            </button>
            <button onClick={() => scrollTo(appRef)} className="hover:text-paper transition-colors">
              Fix a form
            </button>
          </nav>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => scrollTo(appRef)}
            className="glow-highlighter rounded-full bg-highlighter px-4 py-2 font-display text-xs font-semibold text-ink transition-transform hover:scale-[1.04]"
          >
            Try it
          </motion.button>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 pb-24 pt-16 sm:px-10 sm:pb-32 sm:pt-24 lg:grid-cols-2 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-4xl font-semibold leading-[1.15] text-paper sm:text-5xl lg:text-[3.1rem]">
              <span className="block font-normal text-mist/80">
                Bureaucracy writes in jargon.
              </span>
              <span className="mt-3 inline-block rounded-lg bg-highlighter px-3 py-1 text-ink">
                FormFix rewrites it in human.
              </span>
            </h1>

            <p className="mt-7 max-w-lg font-body text-base leading-relaxed text-mist sm:text-lg">
              Photograph any confusing government notice, scholarship application, or college
              form. FormFix reads it, explains it at a grade-8 level, and tells you exactly
              what's mandatory, what's optional, and what to bring — in your own language.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo(appRef)}
                className="glow-highlighter flex items-center gap-2 rounded-full bg-highlighter px-6 py-3.5 font-display text-sm font-semibold text-ink hover:scale-[1.03] transition-transform"
              >
                Fix a form now
                <ArrowDown className="h-4 w-4" />
              </motion.button>
              <span className="flex items-center gap-1.5 font-mono text-xs text-mist">
                <ShieldCheck className="h-3.5 w-3.5 text-teal" />
                no login · nothing saved
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <ScanIllustration />
          </motion.div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section ref={howRef} className="relative border-t border-line/60 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
          <div className="mb-16 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-highlighter">
              the pipeline
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-paper sm:text-3xl">
              How it works
            </h2>
          </div>

          <div className="relative">
            <div className="glowing-line absolute left-8 top-3 bottom-3 w-px sm:left-1/2 sm:-translate-x-1/2" />

            <div className="flex flex-col gap-14">
              {TIMELINE.map((step, i) => {
                const Icon = step.icon;
                const flip = i % 2 === 1;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className={`flex items-center gap-6 sm:gap-10 ${
                      flip ? "sm:flex-row-reverse" : ""
                    }`}
                  >
                    <div className={`hidden flex-1 sm:block ${flip ? "text-left" : "text-right"}`}>
                      <h3 className="font-display text-lg font-semibold text-paper">
                        {String(i + 1).padStart(2, "0")} — {step.title}
                      </h3>
                      <p className="mt-2 font-body text-sm leading-relaxed text-mist">{step.body}</p>
                    </div>

                    <div className="glow-highlighter glass-card relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-highlighter/30">
                      <Icon className="h-6 w-6 text-highlighter" strokeWidth={1.75} />
                    </div>

                    <div className="flex-1 sm:hidden">
                      <h3 className="font-display text-lg font-semibold text-paper">
                        {String(i + 1).padStart(2, "0")} — {step.title}
                      </h3>
                      <p className="mt-2 font-body text-sm leading-relaxed text-mist">{step.body}</p>
                    </div>

                    <div className="hidden flex-1 sm:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHAT IT DOES (bento) ============ */}
      <section className="relative border-t border-line/60 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <div className="mb-12 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-highlighter">
              what it does
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-paper sm:text-3xl">
              Three features, one honest goal
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              className="glass-card group relative min-h-[240px] overflow-hidden rounded-2xl border border-line/60 p-7 md:col-span-2"
            >
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-highlighter/10 blur-3xl transition-colors group-hover:bg-highlighter/20" />
              <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-highlighter/20 bg-highlighter/10 text-highlighter">
                <Type className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="relative z-10 font-display text-lg font-semibold text-paper">
                Grade-8 clarity
              </h3>
              <p className="relative z-10 mt-2 max-w-md font-body text-sm leading-relaxed text-mist">
                FormFix doesn't just summarize — it rewrites. Dense legal and bureaucratic phrasing
                gets restructured into plain sentences a first-time reader can act on immediately.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.08 }}
              className="glass-card group relative min-h-[240px] overflow-hidden rounded-2xl border border-line/60 p-7"
            >
              <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-teal/10 blur-2xl transition-colors group-hover:bg-teal/20" />
              <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-teal/20 bg-teal/10 text-teal">
                <ListChecks className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="relative z-10 font-display text-lg font-semibold text-paper">
                Smart checklists
              </h3>
              <p className="relative z-10 mt-2 font-body text-sm leading-relaxed text-mist">
                A concrete, step-by-step list of documents and actions, extracted straight from
                what the form actually asks for.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.16 }}
              className="glass-card group relative flex min-h-[180px] items-center gap-6 overflow-hidden rounded-2xl border border-line/60 p-7 md:col-span-3"
            >
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-stamp/[0.08] blur-3xl" />
              <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-stamp/25 bg-stamp/10 text-[#ff9d87]">
                <Globe2 className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <div className="relative z-10">
                <h3 className="font-display text-lg font-semibold text-paper">
                  Regional language support
                </h3>
                <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-mist">
                  Switch the whole result — summary, fields, checklist, warnings — into Hindi,
                  Bengali, Tamil, and eight more languages with one tap.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ THE APP ============ */}
      <section ref={appRef} className="relative border-t border-line/60 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
          <div className="mb-10 text-center">
            <div className="glow-highlighter glass-card mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-highlighter/30">
              <ScanLine className="h-5 w-5 text-highlighter" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-paper sm:text-3xl">
              Fix your form
            </h2>
            <p className="mx-auto mt-2 max-w-md font-body text-sm text-mist">
              Upload a photo. Get a plain-language breakdown in seconds.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card mb-6 rounded-xl border border-stamp/40 px-4 py-3 font-mono text-xs text-[#ff9d87]"
            >
              {error}
            </motion.div>
          )}

          {stage === "idle" && <UploadBox onSubmit={handleUpload} disabled={false} />}

          {(stage === "ocr" || stage === "simplify") && (
            <LoadingState stage={stage} activeSteps={activeSteps} />
          )}

          {stage === "done" && displayResult && (
            <div className="space-y-6">
              <ResultCard
                summary={displayResult.summary}
                rawText={ocr?.text}
                confidence={ocr?.confidence}
                ocrWarning={ocr?.warning}
                lang={lang}
                onLangChange={handleLangChange}
                translating={translating}
                onReset={reset}
              />
              <ChecklistPanel
                mandatoryFields={displayResult.mandatoryFields}
                optionalFields={displayResult.optionalFields}
                documentChecklist={displayResult.documentChecklist}
                warnings={displayResult.warnings}
              />
            </div>
          )}
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="relative border-t border-line/60 px-6 py-10 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 pb-16 sm:flex-row sm:pb-0">
          <div className="flex items-baseline gap-0.5 font-display text-sm font-bold">
            <span className="text-paper">Form</span>
            <span className="rounded bg-highlighter px-1 text-ink">Fix</span>
          </div>
          <p className="font-mono text-[11px] text-mist">plain language, not less meaning.</p>
          <a
            href="https://dipcodesdev.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[11px] text-mist hover:text-highlighter transition-colors"
          >
            built by Dipankar ↗
          </a>
        </div>
      </footer>

      {/* ============ MOBILE DOCK ============ */}
      <nav className="glass-card glow-highlighter fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-line/60 p-1.5 sm:hidden">
        <button
          onClick={() => scrollTo(heroRef)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-mist hover:text-paper transition-colors"
          aria-label="Top"
        >
          <HomeIcon className="h-4.5 w-4.5" />
        </button>
        <button
          onClick={() => scrollTo(howRef)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-mist hover:text-paper transition-colors"
          aria-label="How it works"
        >
          <BrainCircuit className="h-4.5 w-4.5" />
        </button>
        <button
          onClick={() => scrollTo(appRef)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-highlighter text-ink"
          aria-label="Fix a form"
        >
          <UploadCloud className="h-4.5 w-4.5" />
        </button>
      </nav>
    </main>
  );
}