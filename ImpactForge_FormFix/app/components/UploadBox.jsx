"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Image as ImageIcon, X, ScanLine } from "lucide-react";

export default function UploadBox({ onSubmit, disabled }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const f = e.dataTransfer.files?.[0];
      handleFile(f);
    },
    [handleFile, disabled]
  );

  const clear = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.button
            key="dropzone"
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`glass-card group relative w-full rounded-2xl border-2 border-dashed px-6 py-14 sm:py-20 text-center transition-colors
            ${isDragging ? "border-highlighter bg-highlighter/5 glow-highlighter" : "border-line/70 hover:border-mist/60"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-surface2 ring-1 ring-line group-hover:ring-highlighter/40 transition-all">
              <UploadCloud
                className="h-7 w-7 text-highlighter"
                strokeWidth={1.75}
              />
            </div>
            <p className="font-display text-lg font-medium text-paper">
              Drop a photo of the form here
            </p>
            <p className="mt-1.5 font-mono text-xs uppercase tracking-widest text-mist">
              or click to browse · JPG, PNG, HEIC
            </p>

            <span className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          </motion.button>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="glass-card relative w-full overflow-hidden rounded-2xl border border-line"
          >
            <button
              onClick={clear}
              disabled={disabled}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-void/80 text-paper backdrop-blur hover:bg-stamp transition-colors disabled:opacity-40"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative h-64 sm:h-80 w-full bg-void">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Uploaded form preview"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-line bg-surface px-4 py-3">
              <div className="flex min-w-0 items-center gap-2 text-mist">
                <ImageIcon className="h-4 w-4 shrink-0" />
                <span className="truncate font-mono text-xs">{file?.name}</span>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                disabled={disabled}
                onClick={() => onSubmit(file)}
                className="glow-highlighter flex shrink-0 items-center gap-2 rounded-full bg-highlighter px-4 py-2 font-display text-sm font-semibold text-ink transition-transform hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100"
              >
                <ScanLine className="h-4 w-4" />
                Scan &amp; simplify
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
