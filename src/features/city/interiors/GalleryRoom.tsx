"use client";

import { useEffect, useMemo } from "react";
import { InteriorLights } from "./InteriorLights";
import { Exhibit, type ExhibitSpec } from "./Exhibit";
import { HallShell } from "./HallShell";
import { CASE_Z, exhibitX, type HallSpec } from "./layout";
import { createHallMaterials } from "./materials";
import { Plant } from "../cabin/Decor";

/** A museum corridor: glass cases in a row, the city glowing behind them. */
export function GalleryRoom({ spec, items, active }: { spec: HallSpec; items: ExhibitSpec[]; active: number }) {
  const m = useMemo(() => createHallMaterials(spec.L, spec.W, spec.H), [spec]);
  useEffect(() => () => Object.values(m).forEach((x) => typeof x === "object" && "dispose" in x && x.dispose()), [m]);
  const n = items.length;
  const px = exhibitX(Math.min(active, n - 1), n, spec.L);

  return (
    <group>
      <HallShell spec={spec} m={m} floor="wood" />
      {items.map((it, i) => (
        <Exhibit key={it.id} spec={it} m={m} active={i === active} position={[exhibitX(i, n, spec.L), 0, CASE_Z]} />
      ))}
      <Plant m={m} position={[-spec.L / 2 + 0.9, 0, spec.W / 2 - 0.9]} scale={0.85} />
      <Plant m={m} position={[spec.L / 2 - 0.9, 0, spec.W / 2 - 0.9]} scale={0.85} />
      <InteriorLights points={[[px, spec.H - 0.5, 0.5], [px - 4, spec.H - 0.5, 0.5], [px + 4, spec.H - 0.5, 0.5], [px, spec.H - 0.5, -3]]} />
    </group>
  );
}
