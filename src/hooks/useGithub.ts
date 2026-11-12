"use client";

import { useEffect, useState } from "react";

export interface GithubData {
  repo: { description: string | null; stars: number; forks: number; issues: number; language: string | null; pushedAt: string; url: string; topics: string[] };
  commits: { sha: string; url: string; message: string; author: string; date: string }[];
}

export type GithubState = { status: "idle" | "loading" | "error" } | { status: "ready"; data: GithubData };

/** Live repo facts and recent commits for a building. Idle when the project has no repo yet. */
export function useGithub(repo: string | null): GithubState {
  const [state, setState] = useState<{ repo: string | null; value: GithubState }>({ repo: null, value: { status: "idle" } });

  useEffect(() => {
    if (!repo) return;
    const ctrl = new AbortController();
    fetch(`/api/github?repo=${encodeURIComponent(repo)}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((j) => setState({ repo, value: j.ok ? { status: "ready", data: j } : { status: "error" } }))
      .catch((e) => {
        if (e?.name !== "AbortError") setState({ repo, value: { status: "error" } });
      });
    return () => ctrl.abort();
  }, [repo]);

  if (!repo) return { status: "idle" };
  return state.repo === repo ? state.value : { status: "loading" };
}
