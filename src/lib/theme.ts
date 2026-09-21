// Theme mechanism: `data-theme` on <html>, persisted in localStorage,
// pre-applied by the boot inline script in app.html (no FOUC).
import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

const KEY = 'olyno-theme';

function readInitial(): Theme {
	if (typeof document === 'undefined') return 'light';
	return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export const theme = writable<Theme>(readInitial());

export function toggleTheme(): Theme {
	const next: Theme = readInitial() === 'dark' ? 'light' : 'dark';
	document.documentElement.dataset.theme = next;
	document.documentElement.style.colorScheme = next;
	localStorage.setItem(KEY, next);
	theme.set(next);
	return next;
}
