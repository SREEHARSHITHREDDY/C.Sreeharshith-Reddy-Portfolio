"use client";

import { useState } from "react";
import { floors, site, type Floor } from "@/data";
import { useGuest } from "@/store/guest";
import { useNav } from "@/store/nav";
import { FloorFrame } from "../FloorFrame";

/** The reception: asks for the visitor's name, then greets them and points to the floors. */
export function Lobby({ floor }: { floor: Floor }) {
  const name = useGuest((s) => s.name);
  const setName = useGuest((s) => s.setName);
  const forget = useGuest((s) => s.forget);
  const openHq = useNav((s) => s.openHq);
  const [draft, setDraft] = useState("");

  if (!name) {
    return (
      <FloorFrame floor={floor} title="Reception" intro={site.brand}>
        <div className="receptionist-card">
          <span className="rc-face" aria-hidden="true">☺</span>
          <p>“Welcome to the Empire! May I have your name, please?”</p>
        </div>
        <form className="msg-form" onSubmit={(e) => { e.preventDefault(); setName(draft); }}>
          <label>
            <span className="sr-only">Your name</span>
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Your name" required maxLength={40} autoComplete="given-name" autoFocus />
          </label>
          <button type="submit" className="btn-primary">Check in →</button>
        </form>
        <p className="panel-note">Only your first name is needed. It stays in this browser and is not sent anywhere.</p>
      </FloorFrame>
    );
  }

  return (
    <FloorFrame floor={floor} title={`Welcome, ${name}`} intro={site.brand}>
      <p className="panel-body">
        Delighted to have you. Every floor holds a different part of the story, from who I am to the work I have shipped. Take the elevator on the left, or pick a floor below.
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
      <button type="button" className="link-btn" onClick={forget}>Not {name}? Change name</button>
    </FloorFrame>
  );
}
