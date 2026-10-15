import { NextResponse, type NextRequest } from "next/server";

const REPO_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const REVALIDATE = 600; // seconds: repo data is cached on the server, so visitors never hit GitHub's rate limit

interface GhRepo {
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  pushed_at: string;
  html_url: string;
  topics?: string[];
}
interface GhCommit {
  sha: string;
  html_url: string;
  commit: { message: string; author: { name: string; date: string } };
}

async function gh<T>(path: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(`https://api.github.com/${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "empire-portfolio",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate: REVALIDATE },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  return res.json() as Promise<T>;
}

/** GET /api/github?repo=owner/name -> repo facts + the latest commits, cached for ten minutes. */
export async function GET(req: NextRequest) {
  const repo = req.nextUrl.searchParams.get("repo") ?? "";
  if (!REPO_RE.test(repo)) return NextResponse.json({ ok: false, error: "bad repo" }, { status: 400 });

  try {
    const [info, commits] = await Promise.all([gh<GhRepo>(`repos/${repo}`), gh<GhCommit[]>(`repos/${repo}/commits?per_page=5`)]);
    return NextResponse.json(
      {
        ok: true,
        repo: {
          description: info.description,
          stars: info.stargazers_count,
          forks: info.forks_count,
          issues: info.open_issues_count,
          language: info.language,
          pushedAt: info.pushed_at,
          url: info.html_url,
          topics: info.topics ?? [],
        },
        commits: commits.map((c) => ({
          sha: c.sha.slice(0, 7),
          url: c.html_url,
          message: c.commit.message.split("\n")[0],
          author: c.commit.author.name,
          date: c.commit.author.date,
        })),
      },
      { headers: { "Cache-Control": `public, s-maxage=${REVALIDATE}, stale-while-revalidate=3600` } },
    );
  } catch {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 502 });
  }
}
