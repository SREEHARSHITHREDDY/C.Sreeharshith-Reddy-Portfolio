"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { journey } from "@/store/journey";
import { useNav, type View } from "@/store/nav";
import type { CityPlan } from "../plan";
import { cameraAt, type Shot } from "./path";
import { hqFloorShot, landmarkShot } from "./poses";

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();

/**
 * Drives the camera. During the intro it follows the scroll journey. Once
 * the visitor is in the city, selecting a landmark or an HQ floor eases the
 * camera from the arrival shot to that view (and back again).
 */
export function NavCameraRig({ plan, drift = true }: { plan: CityPlan; drift?: boolean }) {
  const byId = useMemo(() => new Map(plan.landmarks.map((l) => [l.id, l])), [plan.landmarks]);
  const state = useMemo(
    () => ({
      pos: new THREE.Vector3(),
      look: new THREE.Vector3(),
      fov: 50,
      ready: false,
    }),
    [],
  );

  const poseFor = (view: View, t: number): Shot | null => {
    if (view.kind === "project" || view.kind === "linkedin") {
      const l = byId.get(view.kind === "linkedin" ? "linkedin" : view.id);
      return l ? landmarkShot(l) : null;
    }
    if (view.kind === "hq") return hqFloorShot(plan.hq, view.floor, t);
    return null;
  };

  useFrame((threeState, dtRaw) => {
    const dt = Math.min(dtRaw, 0.35);
    const t = threeState.clock.elapsedTime;
    const cam = threeState.camera as THREE.PerspectiveCamera;
    const view = useNav.getState().view;

    const base = cameraAt(journey.value, plan.hq, drift ? t : 0);
    const nav = poseFor(view, drift ? t : 0);

    const wantPos = tmpA.set(...(nav ? nav.position : base.position));
    const wantLook = tmpB.set(...(nav ? nav.target : base.target));
    const wantFov = nav ? nav.fov : base.fov;

    if (!state.ready) {
      state.pos.copy(wantPos);
      state.look.copy(wantLook);
      state.fov = wantFov;
      state.ready = true;
    }

    // one damped camera: it glides to whichever pose is wanted (landmark, HQ floor, or the live journey shot)
    const vk = 1 - Math.exp(-dt * (nav ? (view.kind === "hq" ? 1.9 : 2.2) : 2.6));
    state.pos.lerp(wantPos, vk);
    state.look.lerp(wantLook, vk);
    state.fov += (wantFov - state.fov) * vk;

    cam.position.copy(state.pos);
    cam.lookAt(state.look);
    if (Math.abs(cam.fov - state.fov) > 0.01) {
      cam.fov = state.fov;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}
