"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { floors } from "@/data";
import { useNav } from "@/store/nav";
import { ElevatorDoors } from "./ElevatorDoors";
import { renderFloor } from "./floorViews";
import "./hq.css";

/** Everything the visitor sees inside the headquarters: elevator panel, floor card, doors, window frame. */
export function HqShell() {
  const view = useNav((s) => s.view);
  const openHq = useNav((s) => s.openHq);
  const goCity = useNav((s) => s.goCity);
  const inHq = view.kind === "hq";
  const floorId = inHq ? view.floor : null;
  const floor = floors.find((f) => f.id === floorId);

  return (
    <AnimatePresence>
      {inHq && floor && (
        <motion.div key="hq" className="hq-shell" data-floor={floor.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          {floor.id !== "cabin" && <div className="hq-window" aria-hidden="true" />}
          <ElevatorDoors floorKey={floor.id} level={floor.level} />

          <nav className="elevator" aria-label="Elevator">
            <button type="button" className="elev-exit" onClick={goCity}>← Leave HQ</button>
            <ol>
              {[...floors].reverse().map((f) => (
                <li key={f.id}>
                  <button type="button" className={f.id === floor.id ? "is-here" : ""} aria-current={f.id === floor.id ? "location" : undefined} onClick={() => openHq(f.id)}>
                    <b>{f.level}</b>
                    <span>{f.name}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <AnimatePresence mode="wait">
            <motion.section
              key={floor.id}
              className={`floor-card floor-${floor.template}`}
              aria-label={floor.name}
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.7, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
            >
              <div className="panel-scroll">{renderFloor(floor)}</div>
            </motion.section>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Esc leaves the current building or floor and returns to the city. */
export function useEscapeToCity() {
  const goCity = useNav((s) => s.goCity);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && useNav.getState().view.kind !== "city") goCity();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goCity]);
}
