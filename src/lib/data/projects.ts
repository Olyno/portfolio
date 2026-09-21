// Curated flagship projects — hand-boosted on top of the live GitHub feed.
// `gh` links the entry to a repository in the live dataset (for stars/stats).
export type ProjectKind = 'product' | 'tool' | 'community' | 'experiment';

export interface CuratedProject {
	id: string;
	name: string;
	tagline: string;
	description: string;
	role: string;
	status: 'live' | 'building' | 'shipped' | 'oss';
	stack: string[];
	kind: ProjectKind;
	url: string;
	gh?: string;
	x?: string;
	badge?: string;
	hero?: { banner: string; bannerLight?: string; icon: string; iconLight?: string; accent: string };
	year: string;
}

export const curated: CuratedProject[] = [
	{
		id: 'patchbay',
		name: 'PatchBay',
		tagline: 'E2EE knowledge workspace where humans and AI agents share the same material',
		description:
			'Documents live on a canvas of cards and stickers, agents connect over MCP, and everything they learn is written back — under your mandates, in your vault, encrypted before it ever leaves the machine. Rust engine, Tauri 2 + SvelteKit desktop, a headless agent node, and a block-level ACL system. My most ambitious build to date.',
		role: 'Founder · architecture, engine, desktop app',
		status: 'building',
		stack: ['Rust', 'Tauri 2', 'SvelteKit', 'TypeScript', 'MCP', 'E2EE'],
		kind: 'product',
		url: 'https://github.com/Olyno/patchbay',
		gh: 'patchbay',
		badge: 'flagship',
		hero: {
			banner: '/images/brand/patchbay-banner-dark.webp',
			bannerLight: '/images/brand/patchbay-banner-light.webp',
			icon: '/images/brand/patchbay-icon-dark.webp',
			iconLight: '/images/brand/patchbay-icon-light.webp',
			accent: '#E0A83C'
		},
		year: '2026'
	},
	{
		id: 'modaduck',
		name: 'Mod A Duck',
		tagline: 'Give your MicroDuck new tricks — a mod marketplace for the community',
		description:
			'Discover and download community-made mods for the MicroDuck robot: programmable behaviors, printable parts, skins, games and utilities. Accounts, uploads, version history, trending rails — a full platform in SvelteKit, live at modaduck.co.',
		role: 'Creator · full platform',
		status: 'live',
		stack: ['SvelteKit', 'TypeScript', 'Marketplace'],
		kind: 'product',
		url: 'https://modaduck.co',
		x: 'https://x.com/hello_modaduck',
		badge: 'live',
		hero: {
			banner: '/images/brand/modaduck-banner.webp',
			icon: '/images/brand/modaduck-icon.webp',
			accent: '#8B5CF6'
		},
		year: '2026'
	},
	{
		id: 'serpent',
		name: 'Serpent',
		tagline: 'Latest experiment — pushing the playground further',
		description:
			'A fresh build on the GitHub canvas: the kind of thing that starts as a weekend sketch and refuses to stay small.',
		role: 'Solo build',
		status: 'shipped',
		stack: ['Experiment'],
		kind: 'experiment',
		url: 'https://github.com/Olyno/serpent',
		year: '2026'
	},
	{
		id: 'glob-searcher',
		name: 'Glob Searcher',
		tagline: 'Find your files using globs — across the whole machine',
		description:
			'A tiny, sharp tool: point it at a glob and it hunts your files everywhere. Fast, scriptable, no ceremony.',
		role: 'Solo build',
		status: 'oss',
		stack: ['JavaScript', 'CLI'],
		kind: 'tool',
		url: 'https://github.com/Olyno/glob-searcher',
		gh: 'glob-searcher',
		year: '2024'
	},
	{
		id: 'svecial',
		name: 'Svecial',
		tagline: 'Social buttons with Svelte — share flows without the tracking drag',
		description:
			'A component kit of social share buttons with Svelte at the core. Drop-in, light, and opinionated about privacy.',
		role: 'Solo build',
		status: 'oss',
		stack: ['Svelte', 'UI kit'],
		kind: 'tool',
		url: 'https://github.com/Olyno/svecial',
		gh: 'svecial',
		year: '2023'
	},
	{
		id: 'skript-ecosystem',
		name: 'Skript ecosystem',
		tagline: 'SkEmail · skent · skester · AnimatedGui — four addons, one community',
		description:
			'Years of Java-powered Minecraft server tooling: emails in Skript, file management, unit tests for scripts, animated GUIs — a small OSS empire used by server owners worldwide.',
		role: 'Author · long-running OSS',
		status: 'oss',
		stack: ['Java', 'Minecraft', 'Skript'],
		kind: 'tool',
		url: 'https://github.com/Olyno/SkEmail',
		gh: 'SkEmail',
		year: '2023'
	},
	{
		id: 'karaom',
		name: 'Karaom',
		tagline: 'Play karaoke with your friends online — for free',
		description:
			'A real-time karaoke experience for groups: sing, score, laugh. Born from the "what if we just built it" impulse.',
		role: 'Solo build',
		status: 'oss',
		stack: ['HTML', 'Realtime'],
		kind: 'experiment',
		url: 'https://github.com/Olyno/karaom',
		gh: 'karaom',
		year: '2023'
	}
];
