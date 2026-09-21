export const LINKS = {
	github: 'https://github.com/Olyno',
	x: 'https://x.com/Olyno_',
	email: 'olyno.dev@gmail.com',
	coffee: 'https://www.buymeacoffee.com/olyno',
	modaduck: 'https://modaduck.co',
	modaduckX: 'https://x.com/hello_modaduck',
	impeccable: 'https://impeccable.style',
	repos: 'https://github.com/Olyno?tab=repositories'
} as const;

export const SECTIONS = ['home', 'about', 'projects', 'activity', 'contact'] as const;
export type SectionId = (typeof SECTIONS)[number];
