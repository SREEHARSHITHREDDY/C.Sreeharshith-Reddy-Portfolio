/**
 * Warm interior light rig. Always the same light count on every floor, so
 * the renderer compiles its shaders once and moving between floors never hitches.
 */
export function InteriorLights({ points }: { points: [number, number, number][] }) {
  const pts = [...points];
  while (pts.length < 4) pts.push(points[points.length - 1] ?? [0, 3, 0]);
  return (
    <>
      <ambientLight color="#ffd9b0" intensity={0.4} />
      {pts.slice(0, 4).map((p, i) => (
        <pointLight key={i} position={p} color="#ffd2a0" intensity={85} distance={0} decay={2} />
      ))}
    </>
  );
}
