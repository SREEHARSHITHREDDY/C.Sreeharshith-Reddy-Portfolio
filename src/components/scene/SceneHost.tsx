"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { CityParallax } from "@/features/city-2d/CityParallax";
import type { ResolvedExperience } from "@/hooks/useResolvedMode";
import type { TimeOfDay } from "@/hooks/useTimeOfDay";

// The 3D stack (three.js, shaders) is only downloaded when 3D mode is actually shown.
const CityCanvas = dynamic(() => import("@/features/city/CityCanvas"), { ssr: false });

/** Chooses between the 2D parallax city and the 3D city, cross-fading between them. */
export function SceneHost({ exp, time }: { exp: ResolvedExperience; time: TimeOfDay }) {
  return (
    <div className="scene-host">
      <AnimatePresence mode="sync">
        {exp.ready && (
          <motion.div
            key={exp.mode}
            className="scene-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {exp.mode === "3d" ? (
              <CityCanvas time={time} lowPower={exp.lowPower} reducedMotion={exp.caps?.reducedMotion} />
            ) : (
              <CityParallax time={time} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
