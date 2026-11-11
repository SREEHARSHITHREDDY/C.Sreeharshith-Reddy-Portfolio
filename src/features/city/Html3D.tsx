"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import * as THREE from "three";

interface Html3DProps {
  position?: [number, number, number];
  /** Scales the label with distance, like drei's distanceFactor. Omit for a fixed pixel size. */
  distanceFactor?: number;
  zIndexRange?: [number, number];
  style?: CSSProperties;
  children: ReactNode;
}

const wp = new THREE.Vector3();
const cp = new THREE.Vector3();

/**
 * A small replacement for drei's <Html> (centred, optional distance scaling).
 * It renders into its own React root exactly like drei does, but unmounts that
 * root on the next tick. drei unmounts it synchronously during React's commit,
 * which logs "Attempted to synchronously unmount a root while React was already
 * rendering" and can throw removeChild errors when the 3D scene is torn down.
 */
export function Html3D({ position = [0, 0, 0], distanceFactor, zIndexRange = [16, 0], style, children }: Html3DProps) {
  const group = useRef<THREE.Group>(null);
  const { gl, camera, size } = useThree();
  const elRef = useRef<HTMLDivElement | null>(null);
  const root = useRef<Root | null>(null);

  useEffect(() => {
    // a fresh element per mount: React StrictMode runs this effect twice in development
    const el = document.createElement("div");
    el.style.cssText = "position:absolute;left:0;top:0;pointer-events:none;will-change:transform;display:none;";
    (gl.domElement.parentNode as HTMLElement | null)?.appendChild(el);
    const r = createRoot(el);
    elRef.current = el;
    root.current = r;
    r.render(<div style={{ transform: "translate(-50%, -50%)", ...latest.current.style }}>{latest.current.children}</div>);
    return () => {
      root.current = null;
      elRef.current = null;
      setTimeout(() => {
        r.unmount();
        el.remove();
      }, 0);
    };
  }, [gl]);

  const latest = useRef({ style, children });
  latest.current = { style, children };

  // re-render the label content whenever the parent renders
  useEffect(() => {
    root.current?.render(<div style={{ transform: "translate(-50%, -50%)", ...style }}>{children}</div>);
  });

  useFrame(() => {
    const g = group.current;
    const el = elRef.current;
    if (!g || !el) return;
    let shown = true;
    for (let o: THREE.Object3D | null = g; o; o = o.parent) {
      if (!o.visible) {
        shown = false;
        break;
      }
    }
    g.getWorldPosition(wp);
    camera.getWorldPosition(cp);
    const dist = wp.distanceTo(cp);
    const ndc = wp.clone().project(camera);
    if (!shown || ndc.z > 1 || ndc.z < -1) {
      el.style.display = "none";
      return;
    }
    el.style.display = "";
    const x = (ndc.x * 0.5 + 0.5) * size.width;
    const y = (-ndc.y * 0.5 + 0.5) * size.height;
    let scale = 1;
    if (distanceFactor !== undefined) {
      const fov = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180;
      scale = distanceFactor / (2 * Math.tan(fov / 2) * dist);
    }
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
    el.style.zIndex = String(Math.round(zIndexRange[0] - Math.min(dist / 2000, 1) * (zIndexRange[0] - zIndexRange[1])));
  });

  return <group ref={group} position={position} />;
}
