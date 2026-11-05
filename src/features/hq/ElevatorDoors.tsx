"use client";

import { motion } from "framer-motion";

/**
 * Brushed-steel doors that close and open each time the floor changes,
 * with the floor number lit above. Pure overlay, so it works in 2D and 3D.
 */
export function ElevatorDoors({ floorKey, level }: { floorKey: string; level: string }) {
  const ease = [0.65, 0, 0.35, 1] as const;
  return (
    <div className="doors" aria-hidden="true">
      <motion.i
        key={`l-${floorKey}`}
        className="door door-l"
        initial={{ x: "0%" }}
        animate={{ x: "-101%" }}
        transition={{ delay: 0.35, duration: 0.9, ease }}
      />
      <motion.i
        key={`r-${floorKey}`}
        className="door door-r"
        initial={{ x: "0%" }}
        animate={{ x: "101%" }}
        transition={{ delay: 0.35, duration: 0.9, ease }}
      />
      <motion.div key={`n-${floorKey}`} className="doors-num" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
        <span>{level}</span>
      </motion.div>
    </div>
  );
}
