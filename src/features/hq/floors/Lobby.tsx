"use client";

import { floors, site } from "@/data";
import { useNav } from "@/store/nav";
import { FloorFrame } from "../FloorFrame";

export function Lobby({ floor }: { floor: (typeof floors)[number] }) {
  const openHq = useNav((s) => s.openHq);
  return (
    <FloorFrame floor={floor} title="Welcome" intro={site.brand}>
      <p className="panel-body">
        This is the headquarters. Every floor holds a different part of the story, from who I am to the work I have shipped. Take the elevator on the left, or pick a floor below.
      </p>
      <ul className="floor-links">
        {floors.filter((f) => f.id !== "lobby").map((f) => (
          <li key={f.id}>
            <button type="button" onClick={() => openHq(f.id)}>
              <b>{f.level}</b>
              <span>{f.name}<i>{f.blurb}</i></span>
            </button>
          </li>
        ))}
      </ul>
    </FloorFrame>
  );
}
