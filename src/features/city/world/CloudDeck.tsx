"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { smoothstep } from "@/lib/journey";
import { useSkyRig } from "../environment/SkyRig";
import { createCloudMaterial } from "../materials/cloudMaterial";

/** A stack of cloud decks the intro camera descends through. They follow the camera in x/z so they feel endless. */
const WHITE = new THREE.Color("#ffffff");

export function CloudDeck({ layers }: { layers: readonly number[] }) {
  const rig = useSkyRig();
  const mats = useMemo(() => layers.map((_, i) => createCloudMaterial(3.7 + i * 17.3, i / Math.max(1, layers.length - 1))), [layers]);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ camera, clock }) => {
    layers.forEach((y, i) => {
      const mesh = meshes.current[i];
      if (!mesh) return;
      mesh.position.set(camera.position.x, y, camera.position.z);
      const u = mats[i].uniforms;
      u.uTime.value = clock.elapsedTime;
      // sunlit tops: the sky's cloud colour pushed toward white and warmed by the sun
      u.uLit.value.copy(rig.cloud).lerp(WHITE, 0.4).lerp(rig.sun, 0.22);
      // shaded cores take the cool mid-sky colour, which keeps sunsets from going flat orange
      u.uShade.value.copy(rig.skyMid).lerp(rig.skyTop, 0.45).lerp(rig.cloud, 0.25).multiplyScalar(0.8);
      u.uSunDir.value.copy(rig.sunDir);
      // fully visible while the camera is above the deck, gone once it has dropped well below
      u.uVis.value = smoothstep(y - 260, y + 260, camera.position.y);
    });
  });

  return (
    <>
      {layers.map((y, i) => (
        <mesh
          key={y}
          ref={(m) => {
            meshes.current[i] = m;
          }}
          rotation={[-Math.PI / 2, 0, 0]}
          material={mats[i]}
          renderOrder={3}
          frustumCulled={false}
        >
          <planeGeometry args={[14000, 14000]} />
        </mesh>
      ))}
    </>
  );
}
