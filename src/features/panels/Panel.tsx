"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import "./panels.css";

/** Shared glass side panel with a close button and an accent edge. */
export function Panel({ accent, label, onClose, children }: { accent: string; label: string; onClose: () => void; children: ReactNode }) {
  return (
    <motion.aside
      className="panel"
      style={{ ["--panel" as string]: accent } as CSSProperties}
      aria-label={label}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <button type="button" className="panel-back" onClick={onClose}>← Back to city</button>
      <div className="panel-scroll">{children}</div>
    </motion.aside>
  );
}
