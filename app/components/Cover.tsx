import type { Motif } from "@/lib/motif";

/**
 * Cover art that says what a thing IS before you read the title.
 *
 * Drawn inline rather than linked, so it paints in the page's own tokens and
 * flips with the theme — nothing here is a fixed hex. Each motif alternates
 * between two arrangements by position, so two design systems (or four themes)
 * sitting near each other are never the same picture twice.
 */
export function Cover({ motif, i = 0, label }: { motif: Motif; i?: number; label: string }) {
	const v = i % 2;

	return (
		<svg
			className="cover"
			viewBox="0 0 480 300"
			preserveAspectRatio="xMidYMid slice"
			role="img"
			aria-label={`${motif} cover for ${label}`}
		>
			<rect className="cover__bg" width="480" height="300" />
			<g className="cover__grid">
				<path d="M60 0v300M120 0v300M180 0v300M240 0v300M300 0v300M360 0v300M420 0v300M0 60h480M0 120h480M0 180h480M0 240h480" />
			</g>

			{motif === "broadcast" && (
				<>
					{/* A signal, drawn once — the thing that is broadcast. */}
					<path className="cover__wave" d="M40 150h38l10-34 12 68 10-48 9 26 10-12h34l10-22 12 44 9-30 10 18h36l10-26 12 52 10-38 9 22 10-8h39" />
					<circle className="cover__ring" cx="392" cy="150" r="34" />
					<circle className="cover__accent" cx="392" cy="150" r="15" />
				</>
			)}

			{motif === "system" && (v === 0 ? (
				<>
					{/* The lightness ladder every ramp in the system shares. */}
					<g className="cover__ink">
						<rect x="60" y="96" width="46" height="108" rx="4" opacity=".14" />
						<rect x="114" y="96" width="46" height="108" rx="4" opacity=".28" />
						<rect x="168" y="96" width="46" height="108" rx="4" opacity=".46" />
						<rect x="222" y="96" width="46" height="108" rx="4" opacity=".68" />
						<rect x="276" y="96" width="46" height="108" rx="4" opacity=".9" />
					</g>
					<rect className="cover__accent" x="330" y="96" width="46" height="108" rx="4" />
					<circle className="cover__craft" cx="399" cy="150" r="14" />
				</>
			) : (
				<>
					<g className="cover__ink">
						<rect x="60" y="66" width="150" height="30" rx="4" opacity=".9" />
						<rect x="60" y="104" width="150" height="30" rx="4" opacity=".62" />
						<rect x="60" y="142" width="150" height="30" rx="4" opacity=".38" />
						<rect x="60" y="180" width="150" height="30" rx="4" opacity=".2" />
					</g>
					<circle className="cover__accent" cx="316" cy="138" r="52" />
					<circle className="cover__craft" cx="380" cy="198" r="18" />
				</>
			))}

			{motif === "theme" && (
				<>
					{/* A page, reduced to the decisions a theme actually makes. */}
					<rect className="cover__ink cover__ink--stroke" x="56" y="60" width="368" height="180" rx="8" />
					<rect className="cover__ink" x="56" y="60" width="368" height="26" rx="8" />
					<circle className="cover__accent" cx="76" cy="73" r="5" />
					{v === 0 ? (
						<>
							<g className="cover__ink" opacity=".75">
								<rect x="76" y="108" width="150" height="14" rx="3" />
								<rect x="76" y="132" width="196" height="9" rx="3" />
								<rect x="76" y="150" width="176" height="9" rx="3" />
								<rect x="76" y="168" width="120" height="9" rx="3" />
							</g>
							<rect className="cover__accent" x="300" y="108" width="104" height="70" rx="5" />
							<rect className="cover__ink" x="76" y="200" width="328" height="9" rx="3" opacity=".35" />
						</>
					) : (
						<>
							<rect className="cover__accent" x="76" y="104" width="328" height="52" rx="5" />
							<g className="cover__ink" opacity=".75">
								<rect x="76" y="172" width="216" height="12" rx="3" />
								<rect x="76" y="194" width="328" height="8" rx="3" />
								<rect x="76" y="210" width="286" height="8" rx="3" />
							</g>
						</>
					)}
				</>
			)}

			{motif === "curriculum" && (
				<>
					{/* Lessons in order, and how far along you are. */}
					<g className="cover__ink" opacity=".72">
						<rect x="60" y="78" width="360" height="30" rx="5" />
						<rect x="60" y="120" width="360" height="30" rx="5" />
						<rect x="60" y="162" width="360" height="30" rx="5" />
						<rect x="60" y="204" width="360" height="30" rx="5" />
					</g>
					<g className="cover__accent">
						{v === 0 ? (
							<>
								<rect x="60" y="78" width="248" height="30" rx="5" />
								<rect x="60" y="120" width="160" height="30" rx="5" />
							</>
						) : (
							<>
								<rect x="60" y="78" width="330" height="30" rx="5" />
								<rect x="60" y="120" width="252" height="30" rx="5" />
								<rect x="60" y="162" width="104" height="30" rx="5" />
							</>
						)}
					</g>
					<g className="cover__dot">
						<circle cx="44" cy="93" r="5" /><circle cx="44" cy="135" r="5" />
						<circle cx="44" cy="177" r="5" /><circle cx="44" cy="219" r="5" />
					</g>
				</>
			)}

			{motif === "glyphs" && (
				<>
					{/* One geometry, nine times — which is the argument of an icon set. */}
					<g className="cover__ink cover__ink--stroke" style={{ strokeWidth: 5 }}>
						<circle cx="132" cy="90" r="22" />
						<rect x="218" y="68" width="44" height="44" rx="8" />
						<path d="M326 112l22-44 22 44Z" />
						<path d="M110 150h44M132 128v44" />
						<circle cx="240" cy="150" r="22" />
						<path d="M326 128l44 44M370 128l-44 44" />
						<rect x="110" y="188" width="44" height="44" rx="22" />
						<path d="M218 210h44M240 188l22 22-22 22" />
					</g>
					<rect className="cover__accent" x="326" y="188" width="44" height="44" rx="8" />
				</>
			)}

			{motif === "platform" && (v === 0 ? (
				<>
					{/* Planes stacked: a thing with a front and a back. */}
					<g className="cover__ink">
						<path d="M120 108 240 62l120 46-120 46Z" opacity=".28" />
						<path d="M120 152 240 106l120 46-120 46Z" opacity=".58" />
					</g>
					<path className="cover__accent" d="M120 196 240 150l120 46-120 46Z" />
				</>
			) : (
				<>
					<path className="cover__accent" d="M120 100 240 54l120 46-120 46Z" />
					<g className="cover__ink">
						<path d="M120 148 240 102l120 46-120 46Z" opacity=".6" />
						<path d="M120 196 240 150l120 46-120 46Z" opacity=".3" />
					</g>
				</>
			))}

			{motif === "tool" && (
				<>
					{/* A prompt and a switch: something you operate. */}
					<rect className="cover__ink cover__ink--stroke" x="60" y="72" width="360" height="156" rx="10" />
					{v === 0 ? (
						<>
							<g className="cover__ink" opacity=".8">
								<path d="M96 130l20 16-20 16" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
								<rect x="130" y="140" width="86" height="10" rx="4" />
							</g>
							<rect className="cover__accent" x="228" y="140" width="14" height="10" rx="4" />
							<rect className="cover__ink" x="300" y="128" width="88" height="34" rx="17" opacity=".28" />
							<circle className="cover__accent" cx="371" cy="145" r="13" />
						</>
					) : (
						<>
							<g className="cover__ink" opacity=".72">
								<rect x="92" y="104" width="120" height="10" rx="4" />
								<rect x="92" y="130" width="180" height="10" rx="4" />
								<rect x="92" y="182" width="146" height="10" rx="4" />
							</g>
							<rect className="cover__accent" x="92" y="156" width="76" height="10" rx="4" />
							<g className="cover__ink cover__ink--stroke" style={{ strokeWidth: 5 }}><path d="M316 138l16 16 34-38" /></g>
							<circle className="cover__craft" cx="341" cy="196" r="11" />
						</>
					)}
				</>
			)}

			{motif === "archive" && (
				<>
					{/* Frames inside frames — kept, not published. */}
					<g className="cover__ink cover__ink--stroke" style={{ strokeWidth: 5 }}>
						<rect x="90" y="66" width="300" height="168" rx="8" />
						<rect x="132" y="96" width="216" height="108" rx="6" opacity=".6" />
					</g>
					<circle className="cover__accent" cx="240" cy="150" r="20" />
				</>
			)}

			<g className="cover__ticks"><path d="M24 24h20M24 24v20M456 276h-20M456 276v-20" /></g>
			<text className="cover__n" x="24" y="285">{String(i + 1).padStart(2, "0")}</text>
		</svg>
	);
}
