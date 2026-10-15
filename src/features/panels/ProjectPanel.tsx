"use client";

import { projects, site } from "@/data";
import { useGithub } from "@/hooks/useGithub";
import { initials, timeAgo } from "@/lib/format";
import { useNav } from "@/store/nav";
import { Panel } from "./Panel";

/** Side panel for one project building: the story, the team, and live repo activity. */
export function ProjectPanel({ id }: { id: string }) {
  const project = projects.find((p) => p.id === id);
  const goCity = useNav((s) => s.goCity);
  const gh = useGithub(project?.repo ?? null);
  if (!project) return null;

  const repoUrl = project.repo ? `https://github.com/${project.repo}` : site.socials.github.url;

  return (
    <Panel accent={project.accent} onClose={goCity} label={project.title}>
      <p className="eyebrow">{project.category} · {project.year}</p>
      <h2 className="panel-title">{project.title}</h2>
      <p className="panel-tag">{project.tagline}</p>
      <p className="panel-body">{project.about}</p>

      <h3 className="panel-h">Key features</h3>
      <ul className="panel-list">{project.features.map((f) => <li key={f}>{f}</li>)}</ul>

      <h3 className="panel-h">Impact</h3>
      <p className="panel-body">{project.impact}</p>

      <h3 className="panel-h">How it was built</h3>
      <p className="panel-body">{project.implementation}</p>
      <div className="chips">{project.stack.map((s) => <span key={s} className="chip">{s}</span>)}</div>

      <h3 className="panel-h">Team</h3>
      <ul className="people">
        {project.team.map((p) => (
          <li key={p.name}><span className="avatar">{initials(p.name)}</span><span><b>{p.name}</b><i>{p.role}</i></span></li>
        ))}
        {project.mentor && (
          <li className="mentor"><span className="avatar">{initials(project.mentor.name)}</span><span><b>{project.mentor.name}</b><i>{project.mentor.role}</i></span></li>
        )}
      </ul>

      <h3 className="panel-h">Live from GitHub</h3>
      {gh.status === "ready" ? (
        <div className="gh">
          <div className="gh-stats">
            {gh.data.repo.language && <span>{gh.data.repo.language}</span>}
            <span>★ {gh.data.repo.stars}</span>
            <span>⑂ {gh.data.repo.forks}</span>
            <span>updated {timeAgo(gh.data.repo.pushedAt)}</span>
          </div>
          <ul className="commits">
            {gh.data.commits.map((c) => (
              <li key={c.sha}>
                <a href={c.url} target="_blank" rel="noopener noreferrer"><code>{c.sha}</code> {c.message}</a>
                <i>{c.author} · {timeAgo(c.date)}</i>
              </li>
            ))}
          </ul>
        </div>
      ) : gh.status === "loading" ? (
        <p className="panel-note">Reading the repository…</p>
      ) : (
        <p className="panel-note">
          {project.repo ? "GitHub is not reachable right now." : "This building will show live commits as soon as its repository is linked."}
        </p>
      )}

      <a className="btn-primary" href={repoUrl} target="_blank" rel="noopener noreferrer">
        {project.repo ? "Open repository ↗" : "Browse GitHub ↗"}
      </a>
    </Panel>
  );
}
