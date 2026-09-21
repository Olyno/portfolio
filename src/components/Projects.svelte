<script lang="ts">
	import { curated, type CuratedProject } from '$lib/data/projects';
	import { gh } from '$lib/github';
	import { activeRepo } from '$lib/activeRepo';
	import { LINKS } from '$lib/links';
	import { ICONS } from '$lib/icons';
	import { reveal, counter } from '$lib/attach';
	import { m } from '$lib/paraglide/messages.js';
	import { localeVersion } from '$lib/locale';

	const repos = $derived($gh.repos);
	const live = $derived($gh.live);
	let query = $state('');
	let langFilter = $state<string | null>(null);
	let sort = $state<'stars' | 'recent'>('stars');
	$localeVersion;

	const langChips = $derived.by(() => {
		const seen: Record<string, true> = {};
		const out: string[] = [];
		for (const r of repos) {
			const l = r.lang ?? 'Other';
			if (!seen[l] && out.length < 7) {
				seen[l] = true;
				out.push(l);
			}
		}
		return out;
	});

	const shown = $derived.by(() => {
		let list = repos.filter(
			(r) => !curated.some((c) => c.gh?.toLowerCase() === r.name.toLowerCase())
		);
		if (langFilter) list = list.filter((r) => (r.lang ?? 'Other') === langFilter);
		if (query.trim()) {
			const q = query.toLowerCase();
			list = list.filter(
				(r) =>
					r.name.toLowerCase().includes(q) ||
					r.desc?.toLowerCase().includes(q) ||
					r.topics.some((t) => t.toLowerCase().includes(q))
			);
		}
		return list
			.slice()
			.sort((a, b) => (sort === 'stars' ? b.stars - a.stars : a.updated < b.updated ? 1 : -1))
			.slice(0, 36);
	});

	const totalShown = $derived(repos.length);

	function starsOf(p: CuratedProject): number {
		if (!p.gh) return 0;
		return repos.find((r) => r.name.toLowerCase() === p.gh!.toLowerCase())?.stars ?? 0;
	}

	const flagship = $derived(curated[0]);
	const secondary = $derived(curated.slice(1, 3));
	const gridFeatured = $derived(curated.slice(3));

	// 3D tilt for the flagship card
	let tiltEl: HTMLDivElement | undefined = $state();
	$effect(() => {
		const el = tiltEl;
		if (!el) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const move = (e: PointerEvent) => {
			const r = el.getBoundingClientRect();
			const px = (e.clientX - r.left) / r.width - 0.5;
			const py = (e.clientY - r.top) / r.height - 0.5;
			el.style.transform = `perspective(1100px) rotateY(${px * 5}deg) rotateX(${-py * 4}deg)`;
		};
		const leave = () => (el.style.transform = '');
		el.addEventListener('pointermove', move);
		el.addEventListener('pointerleave', leave);
		return () => {
			el.removeEventListener('pointermove', move);
			el.removeEventListener('pointerleave', leave);
		};
	});
</script>

<section id="projects" class="relative mx-auto max-w-shell scroll-mt-24 px-5 py-[10vh]">
	<div {@attach reveal()} class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<p class="eyebrow mono-label text-gold">02 — {m.projects_flagship()}s</p>
			<h2 class="display mt-3 text-[clamp(1.9rem,5vw,3.4rem)]">{m.projects_title()}</h2>
			<p class="mt-3 max-w-xl text-cream-dim">{m.projects_subtitle()}</p>
		</div>
		<span
			class="inline-flex items-center gap-2 rounded-full border border-ink-line bg-ink-soft/60 px-3 py-1.5 text-xs text-cream-faint backdrop-blur"
			class:text-teal={live}
			title={m.projects_live_note()}
		>
			<span class="relative flex h-2 w-2">
				{#if live}
					<span
						class="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60"
					></span>
				{/if}
				<span
					class="relative inline-flex h-2 w-2 rounded-full"
					class:bg-teal={live}
					class:bg-cream-faint={!live}
				></span>
			</span>
			{live ? m.projects_live_note() : 'snapshot'}
		</span>
	</div>

	<!-- ============ flagship: PatchBay ============ -->
	{#if flagship}
		<article class="glass card-lift group relative mt-10 overflow-hidden" {@attach reveal()}>
			<img
				src={flagship.hero?.banner}
				alt=""
				class="pointer-events-none absolute inset-0 h-full w-full scale-105 object-cover opacity-30 transition-all duration-700 group-hover:scale-110 group-hover:opacity-45"
				loading="lazy"
			/>
			<div
				class="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30"
			></div>
			<div class="relative grid gap-6 p-6 sm:p-9 lg:grid-cols-[1.4fr_1fr] lg:items-center">
				<div>
					<div class="flex items-center gap-3">
						<img
							src={flagship.hero?.icon}
							alt="{flagship.name} logo"
							class="h-12 w-12 rounded-2xl shadow-[0_0_30px_rgba(224,168,60,.35)]"
							loading="lazy"
						/>
						<div>
							<p class="mono-label" style:color={flagship.hero?.accent}>
								{m.projects_flagship()}
							</p>
							<h3 class="display text-3xl">{flagship.name}</h3>
						</div>
						<span
							class="ml-auto rounded-full border px-3 py-1 font-mono text-[0.62rem]"
							style:color={flagship.hero?.accent}
							style:border-color={`${flagship.hero?.accent}55`}
						>
							{flagship.status === 'building' ? m.status_building() : m.status_live()}
						</span>
					</div>

					<p class="mt-5 max-w-xl text-lg font-medium text-cream">{flagship.tagline}</p>
					<p class="mt-3 max-w-xl text-sm leading-relaxed text-cream-dim">
						{flagship.description}
					</p>

					<ul class="mt-5 flex flex-wrap gap-2">
						{#each flagship.stack as s (s)}
							<li
								class="rounded-full border border-ink-line bg-ink/60 px-3 py-1 font-mono text-[0.65rem] text-cream-dim"
							>
								{s}
							</li>
						{/each}
					</ul>

					<div class="mt-7 flex flex-wrap items-center gap-4">
						<a
							href={flagship.url}
							target="_blank"
							rel="noopener noreferrer"
							class="btn btn-solid"
							data-cursor
						>
							{m.projects_view_repo()}
							<svg
								width="15"
								height="15"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.4"
								stroke-linecap="round"
								stroke-linejoin="round"><path d={ICONS.arrow}></path></svg
							>
						</a>
						<span class="font-mono text-xs text-cream-faint">{flagship.role}</span>
					</div>
				</div>

				<dl
					class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-line bg-ink-line lg:grid-cols-1"
				>
					<div class="bg-ink/70 px-5 py-4 backdrop-blur">
						<dd class="font-display text-2xl font-extrabold text-gold">{flagship.year}</dd>
						<dt class="mono-label mt-1 text-cream-faint">{m.projects_updated()}</dt>
					</div>
					<div class="bg-ink/70 px-5 py-4 backdrop-blur">
						<dd class="font-display text-2xl font-extrabold" {@attach counter(7)}>0</dd>
						<dt class="mono-label mt-1 text-cream-faint">engines & apps</dt>
					</div>
					<div class="bg-ink/70 px-5 py-4 backdrop-blur">
						<dd class="font-display text-xl font-extrabold text-cream">E2EE · MCP</dd>
						<dt class="mono-label mt-1 text-cream-faint">architecture</dt>
					</div>
				</dl>
			</div>
		</article>
	{/if}

	<!-- ============ secondary duo: Mod A Duck + Impeccable ============ -->
	<div class="mt-6 grid gap-6 md:grid-cols-2">
		{#each secondary as p (p.id)}
			<article class="glass card-lift group relative overflow-hidden" {@attach reveal(80)}>
				{#if p.hero}
					<img
						src={p.hero.banner}
						alt=""
						class="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25 transition-all duration-700 group-hover:scale-[1.06] group-hover:opacity-40"
						loading="lazy"
					/>
					<div
						class="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent"
					></div>
				{/if}
				<div class="relative flex h-full flex-col p-6 sm:p-7">
					<div class="flex items-center gap-3">
						{#if p.hero}
							<img
								src={p.hero.icon}
								alt="{p.name} logo"
								class="h-10 w-10 rounded-xl"
								style:box-shadow={`0 0 24px ${p.hero.accent}44`}
								loading="lazy"
							/>
						{/if}
						<h3 class="display text-2xl">{p.name}</h3>
						{#if p.badge === 'live'}
							<span
								class="ml-auto rounded-full border border-teal/40 px-2.5 py-0.5 font-mono text-[0.6rem] uppercase text-teal"
							>
								{m.projects_live_badge()}
							</span>
						{/if}
					</div>
					<p class="mt-3 text-sm font-medium text-cream">{p.tagline}</p>
					<p class="mt-2 line-clamp-3 text-[0.84rem] leading-relaxed text-cream-dim">
						{p.description}
					</p>
					<ul class="mt-3 flex flex-wrap gap-1.5">
						{#each p.stack as s (s)}
							<li
								class="rounded-full border border-ink-line px-2 py-0.5 font-mono text-[0.6rem] text-cream-faint"
							>
								{s}
							</li>
						{/each}
					</ul>
					<div class="mt-auto flex flex-wrap items-center gap-4 pt-5">
						<a
							href={p.url}
							target="_blank"
							rel="noopener noreferrer"
							class="btn btn-ghost !py-2 !text-sm"
							data-cursor
						>
							{m.projects_visit_site()}
							<svg
								width="13"
								height="13"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.4"
								stroke-linecap="round"
								stroke-linejoin="round"><path d={ICONS.arrow}></path></svg
							>
						</a>
						{#if p.x}
							<a
								href={p.x}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1.5 text-xs text-cream-faint transition-colors hover:text-cream"
								aria-label={m.projects_see_x()}
							>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"
									><path d={ICONS.x}></path></svg
								>
								@hello_modaduck
							</a>
						{/if}
					</div>
				</div>
			</article>
		{/each}
	</div>

	<!-- ============ mini feature row ============ -->
	<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each gridFeatured as p (p.id)}
			<a
				href={p.url}
				target="_blank"
				rel="noopener noreferrer"
				class="glass card-lift group flex flex-col p-5"
				{@attach reveal(60)}
			>
				<div class="flex items-center justify-between">
					<h4 class="font-display font-bold group-hover:text-gold">{p.name}</h4>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="text-cream-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
						stroke-linecap="round"
						stroke-linejoin="round"><path d={ICONS.arrow}></path></svg
					>
				</div>
				<p class="mt-1.5 line-clamp-2 text-[0.8rem] leading-relaxed text-cream-dim">{p.tagline}</p>
				{#if starsOf(p) > 0}
					<span class="mono-label mt-3 text-gold">★ {starsOf(p)}</span>
				{/if}
			</a>
		{/each}
	</div>

	<!-- ============ live GitHub grid ============ -->
	<div class="mt-16 flex flex-wrap items-center gap-3" {@attach reveal()}>
		<div
			class="flex min-w-56 flex-1 items-center gap-2 rounded-full border border-ink-line bg-ink-soft/70 px-4 py-2.5 backdrop-blur focus-within:border-gold/50"
		>
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				class="text-cream-faint"
				stroke-linecap="round"><path d={ICONS.search}></path></svg
			>
			<input
				type="search"
				bind:value={query}
				placeholder={m.projects_search_placeholder()}
				aria-label={m.projects_search_placeholder()}
				class="w-full bg-transparent text-sm outline-none placeholder:text-cream-faint"
			/>
		</div>
		<div class="flex flex-wrap gap-1.5">
			<button
				type="button"
				onclick={() => (langFilter = null)}
				class="rounded-full px-3 py-1.5 font-mono text-[0.65rem] transition-colors"
				class:bg-gold={langFilter === null}
				class:text-ink={langFilter === null}
				class:border={langFilter !== null}
				class:border-ink-line={langFilter !== null}
				class:text-cream-dim={langFilter !== null}
			>
				{m.projects_filter_all()}
			</button>
			{#each langChips as l (l)}
				<button
					type="button"
					onclick={() => (langFilter = langFilter === l ? null : l)}
					class="rounded-full px-3 py-1.5 font-mono text-[0.65rem] transition-colors"
					class:bg-gold={langFilter === l}
					class:text-ink={langFilter === l}
					class:border={langFilter !== l}
					class:border-ink-line={langFilter !== l}
					class:text-cream-dim={langFilter !== l}
				>
					{l}
				</button>
			{/each}
		</div>
		<div class="flex rounded-full border border-ink-line p-0.5">
			{#each [['stars', m.projects_sort_stars()], ['recent', m.projects_sort_recent()]] as [key, label] (key)}
				<button
					type="button"
					onclick={() => (sort = key as 'stars' | 'recent')}
					class="rounded-full px-3 py-1 font-mono text-[0.65rem] transition-colors"
					class:bg-ink-fog={sort === key}
					class:text-cream={sort === key}
					class:text-cream-faint={sort !== key}
				>
					{label}
				</button>
			{/each}
		</div>
	</div>

	<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each shown as r (r.name)}
			{@const accent =
				r.stars >= 5
					? '#e7b84f'
					: r.lang === 'Rust'
						? '#f97316'
						: r.lang === 'TypeScript' || r.lang === 'JavaScript'
							? '#7c9cf5'
							: r.lang === 'Java'
								? '#2dd4bf'
								: r.lang === 'Svelte'
									? '#f2d38a'
									: '#6b675c'}
			<a
				href={r.url}
				target="_blank"
				rel="noopener noreferrer"
				class="repo-card glass card-lift group flex min-h-44 flex-col p-5"
				style:--accent={accent}
				onmouseenter={() => activeRepo.set(r.name)}
				onmouseleave={() => activeRepo.set(null)}
				{@attach reveal()}
			>
				<div class="flex items-start justify-between gap-2">
					<h4
						class="font-display text-base font-bold leading-tight transition-colors group-hover:text-gold"
					>
						{r.name}
					</h4>
					<span class="mono-label shrink-0 text-[0.55rem]" style:color={accent}>
						{r.lang ?? '—'}
					</span>
				</div>
				<p class="mt-2 line-clamp-2 flex-1 text-[0.82rem] leading-relaxed text-cream-dim">
					{r.desc ?? m.projects_no_description()}
				</p>
				<div class="mt-4 flex items-center gap-4 font-mono text-[0.68rem] text-cream-faint">
					{#if r.stars > 0}
						<span style:color="#e7b84f">★ {r.stars}</span>
					{/if}
					{#if r.forks > 0}
						<span>⑃ {r.forks}</span>
					{/if}
					<span class="ml-auto">{r.updated}</span>
				</div>
			</a>
		{:else}
			<div class="glass col-span-full p-10 text-center text-sm text-cream-faint">
				{m.palette_no_results()}
			</div>
		{/each}
	</div>

	<div class="mt-10 text-center" {@attach reveal()}>
		<p class="mb-4 font-mono text-xs text-cream-faint">
			{m.projects_showing({ shown: shown.length, total: totalShown })}
		</p>
		<a
			href={LINKS.repos}
			target="_blank"
			rel="noopener noreferrer"
			class="btn btn-ghost"
			data-cursor
		>
			<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"
				><path d={ICONS.github}></path></svg
			>
			{m.projects_see_more_button()}
			<span class="text-cream-faint">({totalShown}+)</span>
		</a>
	</div>
</section>

<style>
	.repo-card {
		transition: border-color 0.3s ease;
	}
	.repo-card:hover {
		border-color: color-mix(in srgb, var(--accent) 55%, transparent);
	}
</style>
