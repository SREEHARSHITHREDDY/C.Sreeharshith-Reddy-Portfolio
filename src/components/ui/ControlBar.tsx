"use client";

import type { ResolvedExperience } from "@/hooks/useResolvedMode";
import { ModeToggle } from "./ModeToggle";
import { TimeSelect } from "./TimeSelect";

export function ControlBar({ exp }: { exp: ResolvedExperience }) {
  return (
    <div className="control-bar">
      <ModeToggle current={exp.mode} canUse3D={exp.caps?.webgl ?? false} />
      <TimeSelect />
    </div>
  );
}
