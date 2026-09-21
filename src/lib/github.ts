import { writable, derived, get } from 'svelte/store';
import fallbackRepos from '$lib/data/repos.json';
import contrib from '$lib/data/contrib.json';
import { curated } from '$lib/data/projects';

export interface GhRepo {
	name: string;
	url: string;
	desc: string | null;
	lang: string | null;
	stars: number;
	forks: number;
	updated: string;
	topics: string[];
	home: string | null;
}

interface GhUser {
	login: string;
	name: string | null;
	bio: string | null;
	public_repos: number;
	followers: number;
	created_at: string;
	avatar_url: string;
}

export interface GhState {
	repos: GhRepo[];
	user: GhUser | null;
	live: boolean;
	loaded: boolean;
}

interface RawRepo {
	name: string;
	html_url?: string;
	description?: string | null;
	language?: string | null;
	stargazers_count?: number;
	forks_count?: number;
	pushed_at?: string;
	topics?: string[];
	homepage?: string | null;
	fork?: boolean;
}

interface RawUser {
	login?: string;
	name?: string | null;
	bio?: string | null;
	public_repos?: number;
	followers?: number;
	created_at?: string;
	avatar_url?: string;
}

const isNoise = (name: string) =>
	/repro|test|\.tmp|scratch/i.test(name) ||
	name === 'portfolio' ||
	name === 'Olyno' ||
	// flagship products are curated separately; hide bare forks of them
	curated.some((c) => c.gh && c.gh.toLowerCase() === name.toLowerCase());

// baked snapshot ships in the bundle → instant paint, never an empty page
export const gh = writable<GhState>({
	repos: (fallbackRepos as RawRepo[])
		.map((r) => ({
			name: r.name,
			url: r.html_url ?? `https://github.com/Olyno/${r.name}`,
			desc: r.description ?? null,
			lang: r.language ?? null,
			stars: r.stargazers_count ?? 0,
			forks: r.forks_count ?? 0,
			updated: (r.pushed_at ?? '').slice(0, 10),
			topics: r.topics ?? [],
			home: r.homepage ?? null
		}))
		.filter((r) => !isNoise(r.name)),
	user: {
		login: 'Olyno',
		name: 'Olyno',
		bio: 'Idea starter & open-source enthusiast.',
		public_repos: 169,
		followers: 90,
		created_at: '2017-01-13T18:32:01Z',
		avatar_url: 'https://avatars.githubusercontent.com/u/25107942?v=4'
	},
	live: false,
	loaded: false
});

export const contributions = {
	start: contrib.start as string,
	dates: contrib.dates as string[],
	counts: contrib.counts as number[]
};

export const totalContribs = contrib.counts.reduce((a, b) => a + b, 0);

export const langStats = derived(gh, ($g) => {
	const tally: Record<string, number> = {};
	for (const r of $g.repos) {
		const l = r.lang ?? 'Other';
		tally[l] = (tally[l] ?? 0) + 1;
	}
	return Object.entries(tally).sort((a, b) => b[1] - a[1]);
});

/** Refresh with live data from the GitHub REST API (best-effort; snapshot remains on failure). */
export async function refreshLive(): Promise<void> {
	try {
		const [reposRaw, userRaw] = await Promise.all([
			fetch('https://api.github.com/users/Olyno/repos?per_page=100&sort=pushed').then((r) =>
				r.ok ? (r.json() as Promise<unknown>) : null
			),
			fetch('https://api.github.com/users/Olyno').then((r) =>
				r.ok ? (r.json() as Promise<unknown>) : null
			)
		]);
		if (!Array.isArray(reposRaw) || typeof userRaw !== 'object' || !userRaw) return;

		let flat = reposRaw as RawRepo[];
		if (flat.length === 100) {
			const p2 = await fetch(
				'https://api.github.com/users/Olyno/repos?per_page=100&sort=pushed&page=2'
			).then((r) => (r.ok ? r.json() : []));
			if (Array.isArray(p2)) flat = flat.concat(p2 as RawRepo[]);
		}

		const fresh: GhRepo[] = flat
			.filter((r) => !r.fork)
			.map((r) => ({
				name: r.name,
				url: r.html_url ?? `https://github.com/Olyno/${r.name}`,
				desc: r.description ?? null,
				lang: r.language ?? null,
				stars: r.stargazers_count ?? 0,
				forks: r.forks_count ?? 0,
				updated: (r.pushed_at ?? '').slice(0, 10),
				topics: r.topics ?? [],
				home: r.homepage ?? null
			}))
			.filter((r) => !isNoise(r.name))
			.sort((a, b) => b.stars - a.stars || (a.updated < b.updated ? 1 : -1));

		const u = userRaw as RawUser;
		gh.set({
			repos: fresh.length ? fresh : get(gh).repos,
			user: u.login
				? {
						login: u.login,
						name: u.name ?? 'Olyno',
						bio: u.bio ?? null,
						public_repos: u.public_repos ?? 169,
						followers: u.followers ?? 90,
						created_at: u.created_at ?? '2017-01-13T18:32:01Z',
						avatar_url: u.avatar_url ?? 'https://avatars.githubusercontent.com/u/25107942?v=4'
					}
				: get(gh).user,
			live: true,
			loaded: true
		});
	} catch {
		// network/API down → baked snapshot already rendered; stay silent
		gh.update((s) => ({ ...s, loaded: true }));
	}
}
