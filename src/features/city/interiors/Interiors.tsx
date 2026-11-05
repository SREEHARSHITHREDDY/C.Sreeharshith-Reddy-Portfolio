"use client";

import { useEffect, useMemo, useState } from "react";
import { galleryFor } from "@/features/hq/galleryData";
import { useNav } from "@/store/nav";
import type { CityPlan } from "../plan";
import type { ExhibitSpec } from "./Exhibit";
import { GalleryRoom } from "./GalleryRoom";
import { HALLS, hallCentreZ } from "./layout";
import { LobbyRoom } from "./LobbyRoom";
import { LoungeRoom } from "./LoungeRoom";

function toExhibits(floorId: string): ExhibitSpec[] {
  return galleryFor(floorId).map((g) => ({ id: g.id, title: g.title, sub: g.sub, accent: g.accent, kind: g.exhibit }));
}

/** All HQ floors. A floor is built the first time the visitor reaches it, and shown only while they are on it. */
export function Interiors({ hq }: { hq: CityPlan["hq"] }) {
  const view = useNav((s) => s.view);
  const exhibit = useNav((s) => s.exhibit);
  const floor = view.kind === "hq" ? view.floor : null;
  const [seen, setSeen] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (floor && HALLS[floor] && !seen.has(floor)) setSeen((s) => new Set(s).add(floor));
  }, [floor, seen]);

  const items = useMemo(() => Object.fromEntries(Object.keys(HALLS).map((id) => [id, toExhibits(id)])), []);

  return (
    <>
      {Object.values(HALLS).map((spec) =>
        seen.has(spec.id) ? (
          <group key={spec.id} position={[hq.x, spec.y, hq.z + hallCentreZ(spec)]} visible={floor === spec.id}>
            {spec.kind === "lobby" && <LobbyRoom spec={spec} />}
            {spec.kind === "lounge" && <LoungeRoom spec={spec} />}
            {spec.kind === "gallery" && <GalleryRoom spec={spec} items={items[spec.id]} active={exhibit} />}
          </group>
        ) : null,
      )}
    </>
  );
}
