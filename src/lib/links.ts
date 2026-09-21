export const LINKS = {
	github: 'https://github.com/Olyno',
	x: 'https://x.com/Olyno_',
	// assembled at render time from fragments so the literal address never
	// appears in prerendered HTML — a light crawl-defense on a personal page
	emailUser: 'olyno.dev',
	emailHost: 'gmail.com',
	coffee: 'https://www.buymeacoffee.com/olyno',
	modaduck: 'https://modaduck.co',
	modaduckX: 'https://x.com/hello_modaduck',
	patchbay: 'https://github.com/Olyno/patchbay',
	repos: 'https://github.com/Olyno?tab=repositories'
} as const;

export const email = () => `${LINKS.emailUser}@${LINKS.emailHost}`;
