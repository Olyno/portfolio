import type Lenis from 'lenis';

/** Single smooth-scroll instance shared across the app (set by +layout.svelte). */
let current: Lenis | null = null;

export function setScroller(l: Lenis | null): void {
	current = l;
}

export function scrollToEl(
	el: HTMLElement | number,
	opts?: { offset?: number; immediate?: boolean }
): void {
	if (!current) {
		if (typeof el === 'number') window.scrollTo({ top: el, behavior: 'auto' });
		else el.scrollIntoView({ behavior: 'auto' });
		return;
	}
	current.scrollTo(el, opts);
}
