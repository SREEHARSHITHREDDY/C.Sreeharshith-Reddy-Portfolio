/**
 * Illustrated CEO cabin for 2D mode: dark panelled room with a wide window cut
 * out, so the live parallax skyline shows through, plus the desk, round table and plant.
 */
export function Cabin2D() {
  return (
    <svg className="cabin2d" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="c2-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b110b" /><stop offset="1" stopColor="#2c1a10" />
        </linearGradient>
        <linearGradient id="c2-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2414" /><stop offset="1" stopColor="#140b06" />
        </linearGradient>
        <radialGradient id="c2-glow" cx="0.5" cy="0.1" r="0.8">
          <stop offset="0" stopColor="#ffcf94" stopOpacity="0.28" /><stop offset="1" stopColor="#ffcf94" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* wall with a window cut out (even-odd) */}
      <path fillRule="evenodd" fill="url(#c2-wall)" d="M0 0H1600V640H0Z M230 70H1370V560H230Z" />
      {/* panelling grooves */}
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={i * 118 + 6} y={0} width={2} height={640} fill="#000" opacity={0.28} />
      ))}
      {/* window mullions */}
      {[230, 420, 610, 800, 990, 1180, 1370].map((x) => (
        <rect key={x} x={x - 5} y={64} width={10} height={502} fill="#1a0f08" />
      ))}
      <rect x={225} y={64} width={1150} height={10} fill="#1a0f08" />
      <rect x={225} y={552} width={1150} height={16} fill="#1a0f08" />
      {/* floor */}
      <rect x={0} y={640} width={1600} height={260} fill="url(#c2-floor)" />
      <rect x={0} y={632} width={1600} height={10} fill="#0e0704" />
      {/* rug + round table */}
      <ellipse cx={420} cy={800} rx={320} ry={62} fill="#241f3d" />
      <ellipse cx={420} cy={770} rx={190} ry={34} fill="#2a170c" />
      <rect x={410} y={770} width={20} height={44} fill="#1b0f07" />
      {[-150, -60, 60, 150].map((dx) => (
        <rect key={dx} x={420 + dx - 28} y={720 + Math.abs(dx) * 0.05} width={56} height={52} rx={14} fill="#5b2f1c" />
      ))}
      {/* desk with founder */}
      <rect x={720} y={600} width={640} height={26} rx={4} fill="#2a170c" />
      <rect x={740} y={626} width={40} height={120} fill="#241308" /><rect x={1300} y={626} width={40} height={120} fill="#241308" />
      <rect x={950} y={540} width={160} height={60} rx={6} fill="#241410" />
      <rect x={1000} y={455} width={60} height={64} rx={26} fill="#b98563" />
      <path d="M965 600V540q0-30 30-30h70q30 0 30 30v60z" fill="#17171f" />
      <path d="M1000 460q0-30 30-30t30 30q-8-12-30-12t-30 12z" fill="#0d0a0a" />
      <rect x={780} y={560} width={90} height={42} rx={3} fill="#9dc6ff" opacity={0.85} />
      {/* plant */}
      <rect x={1440} y={560} width={60} height={90} rx={10} fill="#161214" />
      {[-60, -30, 0, 30, 60].map((dx) => (
        <ellipse key={dx} cx={1470 + dx * 0.6} cy={500 - Math.abs(dx) * 0.4} rx={16} ry={72} transform={`rotate(${dx * 0.5} ${1470} 560)`} fill="#1f5a34" />
      ))}
      {/* sconces */}
      {[110, 1490].map((x) => (<rect key={x} x={x - 8} y={250} width={16} height={90} rx={6} fill="#ffcf8a" opacity={0.95} />))}
      <rect width={1600} height={900} fill="url(#c2-glow)" />
    </svg>
  );
}
