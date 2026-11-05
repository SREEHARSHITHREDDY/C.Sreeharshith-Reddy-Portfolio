import * as THREE from "three";

function make(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return { c, g: c.getContext("2d")! };
}
function tex(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function wrap(g: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number, maxLines = 4) {
  const words = text.split(" ");
  let line = "";
  let n = 0;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (g.measureText(test).width > maxW && line) {
      g.fillText(line, x, y + n * lh);
      line = w;
      n++;
      if (n >= maxLines) return y + n * lh;
    } else line = test;
  }
  g.fillText(line, x, y + n * lh);
  return y + (n + 1) * lh;
}

export interface CardSpec {
  eyebrow?: string;
  title: string;
  lines?: string[];
  footer?: string;
  accent?: string;
  theme?: "cream" | "navy";
}

/** A framed card (certificate, role badge, plaque) drawn on a canvas. */
export function cardTexture(spec: CardSpec) {
  const W = 800;
  const H = 580;
  const { c, g } = make(W, H);
  const cream = spec.theme !== "navy";
  const ink = cream ? "#2a1d10" : "#f3eefc";
  const gold = spec.accent ?? "#b8801a";
  g.fillStyle = cream ? "#f4ecd8" : "#14112b";
  g.fillRect(0, 0, W, H);
  if (cream) {
    const grad = g.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, W * 0.7);
    grad.addColorStop(0, "rgba(255,255,255,0.5)");
    grad.addColorStop(1, "rgba(150,110,50,0.18)");
    g.fillStyle = grad;
    g.fillRect(0, 0, W, H);
  }
  g.strokeStyle = gold;
  g.lineWidth = 8;
  g.strokeRect(24, 24, W - 48, H - 48);
  g.lineWidth = 2;
  g.strokeRect(40, 40, W - 80, H - 80);

  g.textAlign = "center";
  g.fillStyle = gold;
  g.font = "700 26px 'Space Mono', monospace";
  g.fillText((spec.eyebrow ?? "").toUpperCase(), W / 2, 100);

  g.fillStyle = ink;
  g.font = "400 56px 'Bebas Neue', Impact, sans-serif";
  let y = wrap(g, spec.title.toUpperCase(), W / 2, 175, W - 170, 62, 3);

  g.font = "400 26px 'DM Sans', sans-serif";
  g.fillStyle = cream ? "#5b4630" : "#cfc6e8";
  for (const l of spec.lines ?? []) y = wrap(g, l, W / 2, y + 14, W - 190, 34, 2);

  if (spec.footer) {
    g.fillStyle = gold;
    g.font = "700 24px 'Space Mono', monospace";
    g.fillText(spec.footer, W / 2, H - 70);
  }
  return tex(c);
}

/** Small engraved plaque for the front of a pedestal. */
export function plaqueTexture(title: string, sub: string, accent = "#c98a1e") {
  const { c, g } = make(512, 160);
  g.fillStyle = "#0f0d1a";
  g.fillRect(0, 0, 512, 160);
  g.strokeStyle = accent;
  g.lineWidth = 3;
  g.strokeRect(6, 6, 500, 148);
  g.textAlign = "center";
  g.fillStyle = "#f3eefc";
  g.font = "400 46px 'Bebas Neue', Impact, sans-serif";
  g.fillText(title.toUpperCase().slice(0, 28), 256, 76);
  g.fillStyle = accent;
  g.font = "700 20px 'Space Mono', monospace";
  g.fillText(sub.toUpperCase().slice(0, 36), 256, 118);
  return tex(c);
}

/** Welcome sign on the reception desk, redrawn when the guest gives their name. */
export function welcomeTexture(name: string | null) {
  const { c, g } = make(640, 320);
  g.fillStyle = "#14112b";
  g.fillRect(0, 0, 640, 320);
  g.strokeStyle = "#f59e0b";
  g.lineWidth = 6;
  g.strokeRect(12, 12, 616, 296);
  g.textAlign = "center";
  g.fillStyle = "#f59e0b";
  g.font = "700 30px 'Space Mono', monospace";
  g.fillText(name ? "WELCOME" : "GOOD TO SEE YOU", 320, 96);
  g.fillStyle = "#f3eefc";
  g.font = "400 84px 'Bebas Neue', Impact, sans-serif";
  g.fillText((name ?? "Guest").toUpperCase().slice(0, 18), 320, 205);
  g.fillStyle = "#8f87b0";
  g.font = "400 24px 'DM Sans', sans-serif";
  g.fillText("C. Sree Harshith Reddy's Empire", 320, 260);
  return tex(c);
}

/** Big gold sign for the lobby wall. */
export function signTexture(text: string) {
  const { c, g } = make(1600, 360);
  g.fillStyle = "#1a110b";
  g.fillRect(0, 0, 1600, 360);
  g.strokeStyle = "#c98a1e";
  g.lineWidth = 5;
  g.strokeRect(18, 18, 1564, 324);
  g.textAlign = "center";
  g.fillStyle = "#f5b53a";
  g.font = "400 150px 'Bebas Neue', Impact, sans-serif";
  g.fillText(text.toUpperCase(), 800, 215);
  g.fillStyle = "#b3a9d6";
  g.font = "700 30px 'Space Mono', monospace";
  g.fillText("HEADQUARTERS", 800, 290);
  return tex(c);
}

/** Dark polished marble checker for the lobby. */
export function marble(repeat: number) {
  const { c, g } = make(512, 512);
  const n = 4;
  const u = 512 / n;
  for (let j = 0; j < n; j++)
    for (let i = 0; i < n; i++) {
      g.fillStyle = (i + j) % 2 ? "#15131d" : "#a39d92";
      g.fillRect(i * u, j * u, u, u);
      g.strokeStyle = "rgba(0,0,0,0.18)";
      for (let k = 0; k < 5; k++) {
        g.beginPath();
        g.moveTo(i * u + Math.random() * u, j * u);
        g.lineTo(i * u + Math.random() * u, j * u + u);
        g.stroke();
      }
    }
  const t = tex(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  return t;
}
