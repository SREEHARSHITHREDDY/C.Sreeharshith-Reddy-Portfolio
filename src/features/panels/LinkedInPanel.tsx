"use client";

import { site } from "@/data";
import { useNav } from "@/store/nav";
import { Panel } from "./Panel";

/** The LinkedIn tower: a short professional card with a link out. */
export function LinkedInPanel() {
  const goCity = useNav((s) => s.goCity);
  const { linkedin } = site.socials;
  return (
    <Panel accent="#2f8cf0" onClose={goCity} label="LinkedIn">
      <p className="eyebrow">Professional network</p>
      <h2 className="panel-title">{site.name}</h2>
      <p className="panel-tag">{site.title}</p>
      <p className="panel-body">{site.tagline}</p>
      <p className="panel-body">Roles, leadership work and the story behind these projects live on LinkedIn. Say hello there.</p>
      <p className="panel-note">/in/{linkedin.handle}</p>
      <a className="btn-primary" href={linkedin.url} target="_blank" rel="noopener noreferrer">Open LinkedIn ↗</a>
    </Panel>
  );
}
