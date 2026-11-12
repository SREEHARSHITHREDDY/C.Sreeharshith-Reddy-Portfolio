import { planBuildings } from "./buildings";
import { planRoads } from "./roads";

export type * from "./types";
export { riverX, inWater, inRiverCorridor } from "./river";

/** Everything the city needs, generated once and shared by the world components. */
export function createCityPlan() {
  return { ...planBuildings(), ...planRoads() };
}

export type CityPlan = ReturnType<typeof createCityPlan>;
