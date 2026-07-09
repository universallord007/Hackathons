"use client";

import { motion } from "framer-motion";
import { AlertTriangle, FileCheck2, ShieldAlert, CircleSlash2 } from "lucide-react";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  show: { opacity: 1, x: 0 },
};

function FieldTag({ children, mandatory }) {
  return (
    <motion.span
      variants={itemVariants}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs
      ${
        mandatory
          ? "border-stamp/40 bg-stamp/10 text-[#ff9d87]"
          : "border-teal/30 bg-teal/10 text-teal"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${mandatory ? "bg-stamp" : "bg-teal"}`} />
      {children}
    </motion.span>
  );
}

export default function ChecklistPanel({ mandatoryFields, optionalFields, documentChecklist, warnings }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Mandatory / optional fields */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card rounded-2xl border border-line p-5 sm:col-span-2"
      >
        <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-paper">
          <ShieldAlert className="h-4 w-4 text-highlighter" />
          Fields that actually matter
        </h3>

        {mandatoryFields?.length > 0 || optionalFields?.length > 0 ? (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="flex flex-wrap gap-2"
          >
            {mandatoryFields?.map((f, i) => (
              <FieldTag key={`m-${i}`} mandatory>
                {f}
              </FieldTag>
            ))}
            {optionalFields?.map((f, i) => (
              <FieldTag key={`o-${i}`}>{f}</FieldTag>
            ))}
          </motion.div>
        ) : (
          <p className="font-mono text-xs text-mist">No individual fields were detected.</p>
        )}

        <div className="mt-4 flex gap-4 font-mono text-[11px] text-mist">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-stamp" /> mandatory
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" /> optional
          </span>
        </div>
      </motion.div>

      {/* Document checklist */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl border border-line p-5"
      >
        <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-paper">
          <FileCheck2 className="h-4 w-4 text-highlighter" />
          Document checklist
        </h3>

        {documentChecklist?.length > 0 ? (
          <motion.ul variants={listVariants} initial="hidden" animate="show" className="space-y-2.5">
            {documentChecklist.map((d, i) => (
              <motion.li
                key={i}
                variants={itemVariants}
                className="flex items-start gap-2.5 font-body text-sm text-paper/85"
              >
                <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-[4px] border border-highlighter/60" />
                {d}
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <p className="flex items-center gap-2 font-mono text-xs text-mist">
            <CircleSlash2 className="h-3.5 w-3.5" /> No extra documents needed.
          </p>
        )}
      </motion.div>

      {/* Warnings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card rounded-2xl border border-stamp/30 p-5"
      >
        <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-[#ff9d87]">
          <AlertTriangle className="h-4 w-4" />
          Deadlines &amp; traps
        </h3>

        {warnings?.length > 0 ? (
          <motion.ul variants={listVariants} initial="hidden" animate="show" className="space-y-2.5">
            {warnings.map((w, i) => (
              <motion.li
                key={i}
                variants={itemVariants}
                className="flex items-start gap-2.5 font-body text-sm text-paper/85"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-stamp" />
                {w}
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <p className="font-mono text-xs text-mist">Nothing time-sensitive was flagged.</p>
        )}
      </motion.div>
    </div>
  );
}