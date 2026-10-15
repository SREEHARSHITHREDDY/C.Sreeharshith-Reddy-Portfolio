import * as THREE from "three";
import { mulberry32 } from "@/lib/random";

function canvas(size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  return c;
}

function finish(c: HTMLCanvasElement, repeatX: number, repeatY: number, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeatX, repeatY);
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Warm oak herringbone parquet: 2x1 planks, each tinted and grained a little differently. */
export function herringbone(repeat: number) {
  const S = 512;
  const cells = 16;
  const u = S / cells;
  const c = canvas(S);
  const g = c.getContext("2d")!;
  const rnd = mulberry32(11);
  g.fillStyle = "#1a0f08";
  g.fillRect(0, 0, S, S);
  const plank = (x: number, y: number, w: number, h: number, vertical: boolean) => {
    const l = 20 + rnd() * 9;
    g.fillStyle = `hsl(${24 + rnd() * 5}, ${44 + rnd() * 10}%, ${l}%)`;
    g.fillRect(x + 1, y + 1, w - 2, h - 2);
    g.strokeStyle = `rgba(0,0,0,${0.12 + rnd() * 0.1})`;
    g.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      g.beginPath();
      if (vertical) {
        const gx = x + 3 + rnd() * (w - 6);
        g.moveTo(gx, y + 1);
        g.lineTo(gx + (rnd() - 0.5) * 3, y + h - 1);
      } else {
        const gy = y + 3 + rnd() * (h - 6);
        g.moveTo(x + 1, gy);
        g.lineTo(x + w - 1, gy + (rnd() - 0.5) * 3);
      }
      g.stroke();
    }
  };
  for (let j = 0; j < cells; j++) {
    for (let i = 0; i < cells; i++) {
      const s = (i + j) % 4;
      if (s === 0) plank(i * u, j * u, u * 2, u, false);
      else if (s === 2) plank(i * u, j * u, u, u * 2, true);
    }
  }
  // wrap-around: planks that start on the last row/column
  for (let j = 0; j < cells; j++) {
    const s = (cells - 1 + j) % 4;
    if (s === 0) plank(0 - u, j * u, u * 2, u, false);
  }
  return finish(c, repeat, repeat);
}

/** Dark walnut wall panelling: framed vertical panels with bevelled edges. */
export function panelling(repeatX: number, repeatY: number) {
  const S = 512;
  const c = canvas(S);
  const g = c.getContext("2d")!;
  const rnd = mulberry32(5);
  g.fillStyle = "#2b1a10";
  g.fillRect(0, 0, S, S);
  const n = 2;
  const pw = S / n;
  for (let i = 0; i < n; i++) {
    const x = i * pw;
    g.fillStyle = `hsl(21, 42%, ${14 + rnd() * 3}%)`;
    g.fillRect(x + 10, 14, pw - 20, S - 28);
    // grain
    for (let k = 0; k < 70; k++) {
      g.strokeStyle = `rgba(${rnd() < 0.5 ? "0,0,0" : "120,70,35"},${0.04 + rnd() * 0.07})`;
      const gx = x + 14 + rnd() * (pw - 28);
      g.beginPath();
      g.moveTo(gx, 16);
      g.lineTo(gx + (rnd() - 0.5) * 8, S - 16);
      g.stroke();
    }
    // bevel: light top/left, dark bottom/right
    g.lineWidth = 3;
    g.strokeStyle = "rgba(255,200,140,0.14)";
    g.beginPath(); g.moveTo(x + 10, S - 14); g.lineTo(x + 10, 14); g.lineTo(x + pw - 10, 14); g.stroke();
    g.strokeStyle = "rgba(0,0,0,0.5)";
    g.beginPath(); g.moveTo(x + pw - 10, 14); g.lineTo(x + pw - 10, S - 14); g.lineTo(x + 10, S - 14); g.stroke();
  }
  return finish(c, repeatX, repeatY);
}

/** An abstract gold-and-violet canvas for the wall art. */
export function artwork() {
  const S = 256;
  const c = canvas(S);
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, S, S);
  grad.addColorStop(0, "#150f2e");
  grad.addColorStop(1, "#3b1f6b");
  g.fillStyle = grad;
  g.fillRect(0, 0, S, S);
  const rnd = mulberry32(3);
  for (let i = 0; i < 9; i++) {
    g.strokeStyle = `rgba(245,158,11,${0.25 + rnd() * 0.5})`;
    g.lineWidth = 1.5 + rnd() * 3;
    g.beginPath();
    g.arc(S * (0.2 + rnd() * 0.6), S * (0.2 + rnd() * 0.6), 20 + rnd() * 90, rnd() * 6, rnd() * 6 + 2);
    g.stroke();
  }
  return finish(c, 1, 1);
}
