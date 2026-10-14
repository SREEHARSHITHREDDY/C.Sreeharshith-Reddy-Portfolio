"use client";

import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import type { TimeOfDay } from "@/hooks/useTimeOfDay";
import { CameraRig } from "./camera/CameraRig";
import { heroShot } from "./camera/path";
import { PostFX } from "./effects/PostFX";
import { Atmosphere } from "./environment/Atmosphere";
import { Lighting } from "./environment/Lighting";
import { SkyDome } from "./environment/SkyDome";
import { SkyProbe } from "./environment/SkyProbe";
import { SkyRigProvider } from "./environment/SkyRig";
import { createCityPlan } from "./plan";
import { Beacons } from "./world/Beacons";
import { Bridges } from "./world/Bridges";
import { Buildings } from "./world/Buildings";
import { Ground } from "./world/Ground";
import { Lamps } from "./world/Lamps";
import { River } from "./world/River";
import { Screens } from "./world/Screens";
import { Traffic } from "./world/Traffic";

interface Props {
  time: TimeOfDay;
  lowPower: boolean;
  reducedMotion?: boolean;
}

export default function CityCanvas({ time, lowPower, reducedMotion = false }: Props) {
  const plan = useMemo(createCityPlan, []);
  const shot = heroShot(plan.hq);

  return (
    <Canvas
      flat
      dpr={lowPower ? 1 : [1, 1.75]}
      camera={{ position: [...shot.position], fov: shot.fov, near: 1, far: 5000 }}
      gl={{ antialias: false, powerPreference: "high-performance", toneMapping: THREE.NoToneMapping }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <SkyRigProvider time={time}>
        <SkyDome />
        <SkyProbe resolution={lowPower ? 64 : 128} />
        <Atmosphere />
        <Lighting />

        <Ground />
        <River lowPower={lowPower} />
        <Buildings tiers={plan.tiers} />
        <Bridges bridges={plan.bridges} />
        <Traffic runs={plan.roadRuns} />
        <Lamps lamps={plan.lamps} />
        <Screens screens={plan.screens} />
        <Beacons beacons={plan.beacons} />

        <CameraRig hq={plan.hq} drift={!reducedMotion} />
        <PostFX lowPower={lowPower} />
      </SkyRigProvider>
    </Canvas>
  );
}
