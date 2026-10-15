import type { ReactElement } from "react";
import { experience } from "./experienceData";
import type { Floor } from "@/data";
import { About } from "./floors/About";
import { Achievements } from "./floors/Achievements";
import { Cabin } from "./floors/Cabin";
import { Certifications } from "./floors/Certifications";
import { Lobby } from "./floors/Lobby";
import { ProjectsFloor } from "./floors/ProjectsFloor";
import { Timeline } from "./floors/Timeline";

/** Which component renders each floor id. Adding a floor = one data entry + one line here. */
export function renderFloor(floor: Floor): ReactElement {
  switch (floor.id) {
    case "lobby": return <Lobby floor={floor} />;
    case "about": return <About floor={floor} />;
    case "projects": return <ProjectsFloor floor={floor} />;
    case "experience": return <Timeline floor={floor} roles={experience.work} intro="Where I have built and led outside the classroom." />;
    case "leadership": return <Timeline floor={floor} roles={experience.leadership} intro="Campus leadership, mentorship and volunteering." />;
    case "achievements": return <Achievements floor={floor} />;
    case "certifications": return <Certifications floor={floor} />;
    default: return <Cabin floor={floor} />;
  }
}
