"use client";

import { motion } from "framer-motion";

// This is the background or the cool background of this project ...
export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-void">
      <motion.div
        aria-hidden
        className="absolute -left-32 -top-40 h-[520px] w-[520px] rounded-full bg-highlighter/[0.10] blur-[120px]"
        animate={{ x: [0, 40, -20, 0], y: [0, 30, -10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -right-40 top-1/3 h-[480px] w-[480px] rounded-full bg-stamp/[0.08] blur-[130px]"
        animate={{ x: [0, -30, 20, 0], y: [0, -20, 25, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-[-10%] left-1/4 h-[420px] w-[420px] rounded-full bg-teal/[0.07] blur-[130px]"
        animate={{ x: [0, 25, -25, 0], y: [0, -15, 15, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="grid-field absolute inset-0" />
    </div>
  );
}