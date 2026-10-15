# C. Sree Harshith Reddy's Empire

A portfolio built as a city. Scroll to descend through the clouds into the skyline; every project is a tower, LinkedIn has its own tower, and the HQ holds the rest of the story: lobby, About, Projects, Experience, Leadership, Achievements, Certifications, and the CEO cabin at the top.

- **2D / 3D toggle** (like light/dark). 3D lazy-loads three.js, so 2D visitors never download it.
- **Time of day** follows the visitor's clock (sunrise, day, sunset, dusk, night) with a manual picker.
- **Live GitHub data** on each project tower via `/api/github` (cached 10 minutes).

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

Optional: set `GITHUB_TOKEN` (no scopes needed) to raise the GitHub rate limit.

## Where to change things

| To change | Edit |
| --- | --- |
| Bio, stats, skills, tech | `src/data/about.ts` |
| Projects (text, team, **GitHub repo**, accent colour) | `src/data/projects.ts` |
| Work and leadership roles | `src/data/experience.ts` |
| Achievements / certifications | `src/data/achievements.ts`, `src/data/certifications.ts` |
| Contact details, socials | `src/data/site.ts` |
| HQ floor list | `src/data/floors.ts` + `src/features/hq/floorViews.tsx` |

To switch on live commits for a building, set `repo: "owner/name"` on that project.

## Structure

```
src/
  data/                 all content, typed
  store/                zustand: experience (mode/time), journey (intro scroll), nav (where you are)
  lib/                  pure helpers: time of day, journey maths, capabilities
  hooks/                useResolvedMode, useTimeOfDay, useGithub
  components/           scene host, control bar
  features/
    intro/              scroll-to-enter driver and overlay
    city/               3D city: plan/ (layout), shaders/, materials/, environment/,
                        world/, camera/, cabin/ (CEO cabin room), effects/
    city-2d/            2D parallax city + cabin illustration
    nav/                directory rail
    panels/             project + LinkedIn panels
    hq/                 elevator, floor cards, floor templates
  app/                  Next.js app router (+ api/github)
legacy/                 the original HTML site, kept only as the content source
docs/reference/         visual references
```

## Notes

- The founder in the cabin is a stylised stand-in (`src/features/city/cabin/Avatar.tsx`). Swap it for a model or a photo plane when ready.
- Esc leaves the current building or floor.
