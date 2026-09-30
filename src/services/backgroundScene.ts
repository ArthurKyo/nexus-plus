type Vec = [number, number, number];
const TAU = Math.PI * 2;
const segments = 84;
const sides = 12;
// A closed, three-lobed tube: an original sculptural symbol for connections.
const center = (t: number): Vec => [
  (1 + 0.3 * Math.cos(3 * t)) * Math.cos(2 * t),
  (1 + 0.3 * Math.cos(3 * t)) * Math.sin(2 * t),
  0.42 * Math.sin(3 * t),
];
const normalize = (v: Vec): Vec => {
  const n = Math.hypot(...v) || 1;
  return v.map((x) => x / n) as Vec;
};
const cross = (a: Vec, b: Vec): Vec => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const vertices: Vec[] = [];
for (let i = 0; i < segments; i++) {
  const t = (i / segments) * TAU,
    c = center(t),
    next = center(t + 0.001);
  const tangent = normalize(next.map((n, k) => n - c[k]) as Vec);
  const normal = normalize(cross(tangent, [0, 0, 1])),
    binormal = cross(tangent, normal);
  for (let j = 0; j < sides; j++) {
    const a = (j / sides) * TAU;
    vertices.push(
      c.map(
        (n, k) =>
          n + 0.2 * (Math.cos(a) * normal[k] + Math.sin(a) * binormal[k]),
      ) as Vec,
    );
  }
}
const poses = [
  [0.74, 0.53, 1, -0.35, 0.35, 0],
  [0.28, 0.51, 1.18, 0.3, 1.35, -0.45],
  [0.79, 0.48, 1.45, -0.25, 2.6, 0.3],
  [0.28, 0.6, 1.05, 0.5, 3.8, -0.3],
  [0.72, 0.4, 1.65, -0.45, 5.2, 0.2],
];
/** Interpolated camera poses rather than repeating particles or a video background. */
export function scenePose(progress: number): number[] {
  const p = Math.max(0, Math.min(1, progress)) * (poses.length - 1),
    i = Math.min(poses.length - 2, Math.floor(p));
  const t = p - i,
    e = t * t * (3 - 2 * t);
  return poses[i].map((n, k) => n + (poses[i + 1][k] - n) * e);
}
export function drawBackgroundScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
): void {
  const [x, y, zoom, rx, ry, rz] = scenePose(progress);
  const compact = width < 768;
  const radius =
    Math.min(width * (compact ? 0.49 : 0.25), height * 0.43) * zoom;
  const cx = width * x,
    cy = height * y;
  const rotate = ([x, y, z]: Vec): Vec => {
    const ya = y * Math.cos(rx) - z * Math.sin(rx),
      za = y * Math.sin(rx) + z * Math.cos(rx);
    const xb = x * Math.cos(ry) + za * Math.sin(ry),
      zb = -x * Math.sin(ry) + za * Math.cos(ry);
    return [
      xb * Math.cos(rz) - ya * Math.sin(rz),
      xb * Math.sin(rz) + ya * Math.cos(rz),
      zb,
    ];
  };
  const points = vertices.map((v) => {
    const r = rotate(v),
      perspective = 4.8 / (4.8 - r[2]);
    return {
      x: cx + r[0] * radius * perspective,
      y: cy + r[1] * radius * perspective,
      z: r[2],
      world: r,
    };
  });
  ctx.save();
  // Light is behind the sculpture, so the silhouette occludes the halo.
  ctx.translate(cx, cy);
  ctx.rotate(rz - 0.25);
  ctx.shadowColor = "#9bcaff";
  ctx.shadowBlur = 24;
  ctx.strokeStyle = "rgba(205,230,255,.58)";
  ctx.lineWidth = compact ? 3 : 5;
  ctx.beginPath();
  ctx.ellipse(
    0,
    -radius * 0.14,
    radius * 1.43,
    radius * (1.1 + 0.2 * Math.cos(ry)),
    0,
    0,
    TAU,
  );
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(197,248,121,.15)";
  ctx.beginPath();
  ctx.ellipse(
    0,
    -radius * 0.14,
    radius * 1.51,
    radius * (1.17 + 0.2 * Math.cos(ry)),
    0,
    0,
    TAU,
  );
  ctx.stroke();
  ctx.restore();
  const faces: { ids: number[]; z: number }[] = [];
  for (let i = 0; i < segments; i++)
    for (let j = 0; j < sides; j++) {
      const ids = [
        i * sides + j,
        ((i + 1) % segments) * sides + j,
        ((i + 1) % segments) * sides + ((j + 1) % sides),
        i * sides + ((j + 1) % sides),
      ];
      faces.push({ ids, z: ids.reduce((sum, k) => sum + points[k].z, 0) / 4 });
    }
  faces.sort((a, b) => a.z - b.z);
  const light = normalize([-0.5, -0.75, 1]);
  for (const face of faces) {
    const [a, b, c] = face.ids.map((i) => points[i].world);
    const normal = normalize(
      cross(b.map((n, k) => n - a[k]) as Vec, c.map((n, k) => n - a[k]) as Vec),
    );
    const diffuse = Math.max(
      0,
      normal.reduce((sum, n, k) => sum + n * light[k], 0),
    );
    const shine = Math.pow(diffuse, 16) * 105;
    const color = [
      18 + diffuse * 55 + shine,
      31 + diffuse * 70 + shine,
      46 + diffuse * 75 + shine,
    ].map(Math.round);
    ctx.fillStyle = `rgb(${color.join(",")})`;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 0.65;
    ctx.beginPath();
    face.ids.forEach((id, k) => {
      const p = points[id];
      if (k === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}
