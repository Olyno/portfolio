import { locale, setLocale } from '$i18n/i18n-svelte';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'lazysizes';
import { get } from 'svelte/store';
import '../app.css';

export const ssr = false;
export const prerender = true;

export async function load() {
	await loadLocaleAsync(get(locale) || 'en');
	setLocale(get(locale) || 'en');
	AOS.init();

	const repositories = await fetch(
		'https://api.github.com/users/Olyno/repos?sort=created&direction=desc'
	)
		.then((res) => res.json())
		// @ts-ignore
		.then((repos) => repos.filter((r) => !r.name.includes('repro')));

	if (window.location.hash) {
		const targetElement = document.querySelector(window.location.hash);
		if (targetElement) {
			targetElement.scrollIntoView();
		}
	}

	return {
		repositories
	};
}
