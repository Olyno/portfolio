// Language mechanism: paraglide cookie strategy (PARAGLIDE_LOCALE). The site is
// prerendered once in the base locale for crawlers; the switcher updates the
// cookie without a reload and bumps `localeVersion`, which keys the UI tree so
// every message re-renders in the new language. No flash, no network reload.
import { cookieMaxAge, cookieName, baseLocale, type Locale } from '$lib/paraglide/runtime';
import { writable } from 'svelte/store';

/** Bumped on every language change; components key/read this to stay live. */
export const localeVersion = writable(0);

/** The offered languages, named in their own tongue: a language switcher that
 *  translates "Français" into "French" stops being findable for the reader who
 *  wants it. No flags - a flag is a country, not a language. */
export const LOCALES: { id: Locale; name: string }[] = [
	{ id: 'en', name: 'English' },
	{ id: 'fr', name: 'Français' }
];

export const isInitialLocale = (l: Locale) => l !== baseLocale;

export function applyLocaleCookie(locale: Locale): void {
	if (typeof document === 'undefined') return;
	// SameSite=Lax so a stored choice rides a top-level arrival from an
	// external link (paraglide writes the cookie without a SameSite policy).
	document.cookie = `${cookieName}=${locale}; path=/; max-age=${cookieMaxAge}; SameSite=Lax`;
	document.documentElement.lang = locale;
	localeVersion.update((v) => v + 1);
}

export function toggleLocale(): void {
	if (typeof document === 'undefined') return;
	const next: Locale = readCookieLocale() === 'en' ? 'fr' : 'en';
	applyLocaleCookie(next);
}

export function readCookieLocale(): Locale {
	if (typeof document === 'undefined') return 'en';
	const m = document.cookie.match(/(?:^|;\s*)PARAGLIDE_LOCALE=([^;]+)/);
	return m?.[1] === 'fr' ? 'fr' : 'en';
}
