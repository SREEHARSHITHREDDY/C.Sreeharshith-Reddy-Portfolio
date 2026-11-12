import type { ReactNode } from "react";
import type { Floor } from "@/data";

/** Common header for every floor's content card. */
export function FloorFrame({ floor, title, intro, children }: { floor: Floor; title?: string; intro?: string; children: ReactNode }) {
  return (
    <>
      <p className="eyebrow">Floor {floor.level}</p>
      <h2 className="panel-title">{title ?? floor.name}</h2>
      {intro && <p className="panel-tag">{intro}</p>}
      {children}
    </>
  );
}
