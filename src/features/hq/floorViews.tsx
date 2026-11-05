import type { ReactElement } from "react";
import type { Floor } from "@/data";
import { About } from "./floors/About";
import { Cabin } from "./floors/Cabin";
import { GalleryPanel } from "./floors/GalleryPanel";
import { Lobby } from "./floors/Lobby";

/** Which component renders each floor id. Gallery floors share one panel, fed by galleryData.ts. */
export function renderFloor(floor: Floor): ReactElement {
  switch (floor.id) {
    case "lobby": return <Lobby floor={floor} />;
    case "about": return <About floor={floor} />;
    case "projects":
    case "experience":
    case "leadership":
    case "achievements":
    case "certifications": return <GalleryPanel floor={floor} />;
    default: return <Cabin floor={floor} />;
  }
}
