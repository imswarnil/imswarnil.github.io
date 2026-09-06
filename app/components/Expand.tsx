"use client";

import { useRef, type ReactNode } from "react";
import { Icon } from "./icons";

/**
 * The expand button on a card, and the dialog it opens.
 *
 * The detail view is rendered on the server as ordinary children — it is in
 * the HTML, just inside a closed <dialog> — so this component moves nothing
 * across the wire and knows nothing about any API. The platform gives it
 * Escape, focus trapping and the top layer; the design system gives it the
 * rise-in.
 */
export function Expand({ label, children }: { label: string; children: ReactNode }) {
	const ref = useRef<HTMLDialogElement>(null);
	return (
		<>
			<button
				className="btn btn-icon btn-quiet btn-sm expand"
				type="button"
				aria-label={`Expand ${label}`}
				onClick={() => ref.current?.showModal()}
			>
				<Icon name="expand" />
			</button>
			<dialog
				className="dialog dialog-lg dialog-scroll detail"
				ref={ref}
				aria-label={label}
				onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}
			>
				<form method="dialog" className="detail__close">
					<button className="btn btn-icon btn-quiet" aria-label="Close"><Icon name="close" /></button>
				</form>
				{children}
			</dialog>
		</>
	);
}
