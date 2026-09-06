/**
 * A sparkline that draws itself in. Pure SVG, no library: a `pathLength` of 1
 * means the dash animation is the same line of CSS whatever the data is.
 */
export function Sparkline({ values, width = 320, height = 72, label }: { values: number[]; width?: number; height?: number; label: string }) {
	if (values.length < 2) return null;
	const min = Math.min(...values), max = Math.max(...values);
	const span = max - min || 1;
	const pad = 4;
	const pts = values.map((v, i) => [
		pad + (i / (values.length - 1)) * (width - pad * 2),
		pad + (1 - (v - min) / span) * (height - pad * 2),
	]);
	const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
	const area = `${d} L${pts[pts.length - 1][0].toFixed(1)} ${height} L${pts[0][0].toFixed(1)} ${height} Z`;
	const [lx, ly] = pts[pts.length - 1];
	return (
		<svg className="spark" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
			<path className="spark__area" d={area} />
			<path className="spark__line" d={d} pathLength={1} />
			<circle className="spark__end" cx={lx} cy={ly} r="3.5" />
		</svg>
	);
}
