"use client";

import { useState } from "react";
import { site, type Floor } from "@/data";
import { useResolvedMode } from "@/hooks/useResolvedMode";
import { useNav } from "@/store/nav";
import { FloorFrame } from "../FloorFrame";

/** The top floor: the founder's cabin and every way to reach them. */
export function Cabin({ floor }: { floor: Floor }) {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const { contact, socials } = site;
  const { mode } = useResolvedMode();
  const spot = useNav((st) => st.cabinSpot);
  const setSpot = useNav((st) => st.setCabinSpot);
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(`Hello from ${name || "your portfolio"}`)}&body=${encodeURIComponent(`${msg}\n\n— ${name}`)}`;

  return (
    <FloorFrame floor={floor} title="CEO Cabin" intro={`${site.name} · ${site.title}`}>
      <p className="panel-body">Pull up a chair. If something here caught your eye, I would like to hear about it.</p>
      {mode === "3d" && (
        <button type="button" className="btn-ghost" onClick={() => setSpot(spot === "desk" ? "window" : "desk")}>
          {spot === "desk" ? "Step to the window →" : "← Back to the desk"}
        </button>
      )}
      <ul className="contact">
        <li><span>Email</span><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
        <li><span>Phone</span><a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a></li>
        <li><span>Location</span><b>{contact.location}</b></li>
        <li><span>LinkedIn</span><a href={socials.linkedin.url} target="_blank" rel="noopener noreferrer">{socials.linkedin.handle} ↗</a></li>
        <li><span>GitHub</span><a href={socials.github.url} target="_blank" rel="noopener noreferrer">{socials.github.handle} ↗</a></li>
      </ul>

      <h3 className="panel-h">Send a message</h3>
      <form className="msg-form" onSubmit={(e) => { e.preventDefault(); window.location.href = mailto; }}>
        <label>
          <span className="sr-only">Your name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required autoComplete="name" />
        </label>
        <label>
          <span className="sr-only">Your message</span>
          <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="What would you like to talk about?" rows={4} required />
        </label>
        <button type="submit" className="btn-primary">Open in my email app →</button>
      </form>
    </FloorFrame>
  );
}
