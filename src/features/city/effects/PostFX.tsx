"use client";

import { BrightnessContrast, Bloom, EffectComposer, HueSaturation, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useSkyRig } from "../environment/SkyRig";

/** Film pipeline: HDR bloom on lights, filmic tone mapping, gentle vignette. */
export function PostFX({ lowPower }: { lowPower: boolean }) {
  const rig = useSkyRig();
  const bloom = useRef<{ intensity: number } | null>(null);

  useFrame(() => {
    // night scenes carry the light, so bloom grows as windows light up
    if (bloom.current) bloom.current.intensity = 0.32 + rig.windowGlow * 0.7;
  });

  return (
    <EffectComposer multisampling={lowPower ? 0 : 4}>
      <Bloom ref={bloom as never} mipmapBlur luminanceThreshold={0.95} luminanceSmoothing={0.2} intensity={0.8} radius={0.75} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <HueSaturation saturation={-0.1} />
      <BrightnessContrast brightness={-0.04} contrast={0.16} />
      <Vignette offset={0.28} darkness={0.5} />
    </EffectComposer>
  );
}
