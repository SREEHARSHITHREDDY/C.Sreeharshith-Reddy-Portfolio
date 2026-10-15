"use client";

import type { CityPlan } from "../plan";
import { Beacons } from "./Beacons";
import { Buildings } from "./Buildings";
import { Screens } from "./Screens";

/**
 * A planar mirror image of the skyline, flipped under the water plane. The
 * ground is open where the river runs, so the reflection is visible only
 * through the water: exactly what a real mirror would show.
 */
export function MirroredCity({ plan }: { plan: CityPlan }) {
  return (
    <group scale={[1, -1, 1]}>
      <Buildings tiers={plan.tiers} />
      <Screens screens={plan.screens} />
      <Beacons beacons={plan.beacons} />
    </group>
  );
}
