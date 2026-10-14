"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { createSkyMaterial } from "../shaders/sky";
import { applySkyUniforms, useSkyRig } from "./SkyRig";

/**
 * Bakes the live sky into an environment map (PMREM) so glass, water and wet
 * asphalt reflect the actual sunset or moonlit sky. Rebuilt only while the
 * sky is changing, and throttled.
 */
export function SkyProbe({ resolution = 128 }: { resolution?: number }) {
  const { gl, scene } = useThree();
  const rig = useSkyRig();
  const state = useRef({ last: 0, sig: "", target: null as THREE.WebGLRenderTarget | null });

  const probe = useMemo(() => {
    const s = new THREE.Scene();
    const mat = createSkyMaterial();
    const dome = new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), mat);
    s.add(dome);
    return { scene: s, mat, pmrem: new THREE.PMREMGenerator(gl) };
  }, [gl]);

  useEffect(() => {
    const st = state.current;
    return () => {
      st.target?.dispose();
      probe.pmrem.dispose();
      probe.mat.dispose();
      scene.environment = null;
    };
  }, [probe, scene]);

  useFrame((s) => {
    const st = state.current;
    const now = s.clock.elapsedTime;
    const sig = [
      rig.skyTop.getHexString(), rig.skyMid.getHexString(), rig.skyBottom.getHexString(),
      rig.sunDir.x.toFixed(2), rig.sunDir.y.toFixed(2), rig.sunIntensity.toFixed(2),
    ].join("|");
    if (sig === st.sig || (st.target && now - st.last < 0.7)) return;
    st.sig = sig;
    st.last = now;
    applySkyUniforms(probe.mat, rig, 0);
    const next = probe.pmrem.fromScene(probe.scene, 0, 0.1, 100, { size: resolution });
    st.target?.dispose();
    st.target = next;
    scene.environment = next.texture;
    scene.environmentIntensity = 1;
  });

  return null;
}
