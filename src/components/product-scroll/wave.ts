type TickerLike = {
  add: (fn: (time: number) => void) => void;
  remove: (fn: (time: number) => void) => void;
};

/** Animated wave path for section 3 — Blue Soda STEP 5. */
export function startWave(path: SVGPathElement | null, ticker: TickerLike) {
  if (!path) return () => {};

  const bases = [125, 140, 115, 60, 40, 65];
  const xs = [0, 288, 576, 864, 1152, 1440];

  const tick = (time: number) => {
    const pts = xs.map((x, i) => ({
      x,
      y: bases[i]! + Math.sin(time * 1.1 + i * 1.3) * 10,
    }));
    let d = `M${pts[0]!.x},${pts[0]!.y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i]!;
      const b = pts[i + 1]!;
      const midX = (a.x + b.x) / 2;
      d += ` C${midX},${a.y} ${midX},${b.y} ${b.x},${b.y}`;
    }
    d += " L1440,200 L0,200 Z";
    path.setAttribute("d", d);
  };

  ticker.add(tick);
  return () => ticker.remove(tick);
}
