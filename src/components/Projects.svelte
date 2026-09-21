<script lang="ts">
	import { curated, type CuratedProject } from '$lib/data/projects';
	import { gh } from '$lib/github';
	import { LINKS } from '$lib/links';
	import { ICONS } from '$lib/icons';
	import XLogo from '$components/XLogo.svelte';
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
			if (!seen[l] && out.length < 6) {
				seen[l] = true;
				out.push(l);
			}
		}
		return out;
	});

	// everything outside the curated flagships → the archive table
	const archived = $derived.by(() => {
		let list = repos.filter(
			(r) => !curated.some((c) => (c.gh ?? c.id).toLowerCase() === r.name.toLowerCase())
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

	function starsOf(p: CuratedProject): number {
		if (!p.gh) return 0;
		return repos.find((r) => r.name.toLowerCase() === p.gh!.toLowerCase())?.stars ?? 0;
	}

	const [patchbay, modaduck] = $derived([curated[0], curated[1]]);

	// 2026 field log — everything actually touched this year, from live data
	const log2026 = $derived(
		repos
			.filter((r) => r.updated >= '2026-01-01')
			.sort((a, b) => (a.updated < b.updated ? 1 : -1))
			.slice(0, 8)
	);

	let tiltEl: HTMLElement | undefined = $state();
	$effect(() => {
		const el = tiltEl;
		if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const move = (e: PointerEvent) => {
			const r = el.getBoundingClientRect();
			const px = (e.clientX - r.left) / r.width - 0.5;
			const py = (e.clientY - r.top) / r.height - 0.5;
			el.style.transform = `perspective(1400px) rotateY(${px * 3}deg) rotateX(${-py * 2.4}deg)`;
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

<section id="projects" class="relative mx-auto max-w-shell scroll-mt-24 px-5 py-[12vh]">
	<header {@attach reveal()} class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<p class="data-label mb-2">№ 01 — {m.projects_kicker()}</p>
			<h2 class="serif text-[clamp(2.2rem,6vw,4rem)]">{m.projects_title()}</h2>
			<p class="mt-3 max-w-lg text-[var(--tx-dim)]">{m.projects_subtitle()}</p>
		</div>
		<span class="data-label flex items-center gap-2" class:text-[var(--verify)]={live}>
			<span
				class="h-1.5 w-1.5 rounded-full"
				class:bg-[var(--verify)]={live}
				class:bg-[var(--tx-faint)]={!live}
			></span>
			{live ? m.projects_live_note() : 'snapshot'}
		</span>
	</header>

	<!-- ============ Plate A — PatchBay (flagship, full-width) ============ -->
	{#if patchbay}
		<article class="tick card relative mt-12 overflow-hidden" {@attach reveal()} bind:this={tiltEl}>
			<!-- theme-aware banner pair (original art ships both variants) -->
			<img
				src={patchbay.hero?.banner}
				alt=""
				class="banner-dark pointer-events-none absolute inset-0 h-full w-full object-cover"
				loading="lazy"
			/>
			{#if patchbay.hero?.bannerLight}
				<img
					src={patchbay.hero.bannerLight}
					alt=""
					class="banner-light pointer-events-none absolute inset-0 h-full w-full object-cover"
					loading="lazy"
				/>
			{/if}
			<div class="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
				<div>
					<div class="flex items-center gap-4">
						<img
							src={patchbay.hero?.icon}
							alt="{patchbay.name} logo"
							class="logo-dark h-14 w-14"
							loading="lazy"
						/>
						{#if patchbay.hero?.iconLight}
							<img
								src={patchbay.hero.iconLight}
								alt=""
								aria-hidden="true"
								class="logo-light h-14 w-14"
								loading="lazy"
							/>
						{/if}
						<div>
							<p class="data-label">{m.projects_flagship()}</p>
							<h3 class="serif text-4xl">{patchbay.name}</h3>
						</div>
						<span
							class="ml-auto border border-[var(--brass)] px-2.5 py-1 font-mono text-[0.62rem] text-[var(--brass)]"
						>
							{m.status_building()}
						</span>
					</div>
					<p class="serif mt-5 text-xl leading-snug text-[var(--tx-dim)] sm:text-2xl">
						{patchbay.tagline}
					</p>
					<p class="mt-3 max-w-xl text-sm leading-relaxed text-[var(--tx-dim)]">
						{patchbay.description}
					</p>
					<ul class="mt-5 flex flex-wrap gap-1.5">
						{#each patchbay.stack as s (s)}
							<li
								class="border border-[var(--line)] bg-[var(--plate)] px-2.5 py-1 font-mono text-[0.64rem] text-[var(--tx-dim)]"
							>
								{s}
							</li>
						{/each}
					</ul>
					<div class="mt-7 flex flex-wrap items-center gap-4">
						<a
							href={patchbay.url}
							target="_blank"
							rel="noopener noreferrer"
							class="btn btn-solid"
							data-cursor
						>
							{m.projects_view_repo()}
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.4"
								stroke-linecap="round"
								stroke-linejoin="round"><path d={ICONS.arrow}></path></svg
							>
						</a>
						<span class="font-mono text-xs text-[var(--tx-faint)]">{patchbay.role}</span>
					</div>
				</div>

				<dl
					class="divide-y divide-[var(--line)] overflow-hidden rounded-lg border border-[var(--line)] bg-[color-mix(in_srgb,var(--plate)_82%,transparent)]"
				>
					<div class="flex items-baseline justify-between px-5 py-4">
						<dd class="serif text-3xl text-[var(--brass)]">{patchbay.year}</dd>
						<dt class="data-label">{m.projects_updated()}</dt>
					</div>
					<div class="flex items-baseline justify-between px-5 py-4">
						<dd class="serif text-3xl" {@attach counter(7)}>0</dd>
						<dt class="data-label">engines & apps</dt>
					</div>
					<div class="flex items-baseline justify-between px-5 py-4">
						<dd class="serif text-xl">E2EE · MCP</dd>
						<dt class="data-label">architecture</dt>
					</div>
				</dl>
			</div>
		</article>
	{/if}

	<!-- ============ Plate B — Mod A Duck ============ -->
	{#if modaduck}
		<article class="tick card group relative mt-6 overflow-hidden" {@attach reveal(60)}>
			<img
				src={modaduck.hero?.banner}
				alt=""
				class="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-[1.04]"
				loading="lazy"
			/>
			<div
				class="pointer-events-none absolute inset-0 bg-gradient-to-r from-[color-mix(in_srgb,var(--panel)_92%,transparent)] via-[color-mix(in_srgb,var(--panel)_70%,transparent)] to-transparent"
			></div>
			<div class="relative flex flex-col gap-4 p-6 sm:p-9 md:max-w-2xl">
				<div class="flex items-center gap-3">
					<img
						src={modaduck.hero?.icon}
						alt="{modaduck.name} logo"
						class="h-10 w-10 rounded-lg"
						loading="lazy"
					/>
					<h3 class="serif text-3xl">{modaduck.name}</h3>
					<span
						class="border border-[var(--verify)] px-2 py-0.5 font-mono text-[0.6rem] uppercase text-[var(--verify)]"
					>
						{m.projects_live_badge()}
					</span>
				</div>
				<p class="text-sm font-medium text-[var(--tx-dim)]">{modaduck.tagline}</p>
				<p class="max-w-xl text-sm leading-relaxed text-[var(--tx-dim)]">{modaduck.description}</p>
				<div class="mt-2 flex flex-wrap items-center gap-4">
					<a
						href={modaduck.url}
						target="_blank"
						rel="noopener noreferrer"
						class="btn btn-solid !py-2 !text-sm"
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
					<a
						href={modaduck.x}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--tx-faint)] transition-colors hover:text-[var(--brass)]"
					>
						<XLogo size={12} />
						@hello_modaduck
					</a>
				</div>
			</div>
		</article>
	{/if}

	<!-- ============ field log 2026 — what actually happened this year ============ -->
	<div class="mt-16" {@attach reveal()}>
		<p class="data-label mb-2">№ 02 — {m.timeline_kicker()}</p>
		<h3 class="serif text-3xl">{m.timeline_title()}</h3>
		<ol class="timeline mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each log2026 as r (r.name)}
				<li>
					<a
						href={r.url}
						target="_blank"
						rel="noopener noreferrer"
						class="card flex h-full flex-col p-4 transition-[border-color]"
						data-cursor
					>
						<span class="data-label">{r.updated}</span>
						<span class="mt-2 font-semibold leading-tight hover:text-[var(--brass)]">{r.name}</span>
						<span class="mt-auto pt-3 font-mono text-[0.62rem] text-[var(--tx-faint)]"
							>{r.lang ?? '—'}</span
						>
					</a>
				</li>
			{/each}
		</ol>
	</div>

	<!-- ============ the archive — searchable census of everything else ============ -->
	<div class="mt-16" {@attach reveal()}>
		<p class="data-label mb-2">№ 03 — {m.projects_oss_more()}</p>
		<h3 class="serif text-3xl">{m.projects_title()} · {repos.length}</h3>

		<div class="mt-6 flex flex-wrap items-center gap-3">
			<div
				class="flex min-w-[14rem] flex-1 items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--panel)] px-3.5 py-2.5 focus-within:border-[var(--brass)]"
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="text-[var(--tx-faint)]"
					stroke-linecap="round"><path d={ICONS.search}></path></svg
				>
				<input
					type="search"
					bind:value={query}
					placeholder={m.projects_search_placeholder()}
					aria-label={m.projects_search_placeholder()}
					class="w-full bg-transparent text-sm outline-none placeholder:text-[var(--tx-faint)]"
				/>
			</div>
			<div class="flex flex-wrap gap-1.5">
				<button
					type="button"
					onclick={() => (langFilter = null)}
					class="rounded-md border px-2.5 py-1.5 font-mono text-[0.64rem] transition-colors"
					class:border-[var(--brass)]={langFilter === null}
					class:text-[var(--brass)]={langFilter === null}
					class:border-[var(--line)]={langFilter !== null}
					class:text-[var(--tx-dim)]={langFilter !== null}
				>
					{m.projects_filter_all()}
				</button>
				{#each langChips as l (l)}
					<button
						type="button"
						onclick={() => (langFilter = langFilter === l ? null : l)}
						class="rounded-md border px-2.5 py-1.5 font-mono text-[0.64rem] transition-colors"
						class:border-[var(--brass)]={langFilter === l}
						class:text-[var(--brass)]={langFilter === l}
						class:border-[var(--line)]={langFilter !== l}
						class:text-[var(--tx-dim)]={langFilter !== l}
					>
						{l}
					</button>
				{/each}
			</div>
		</div>

		<ul class="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)]">
			{#each archived as r (r.name)}
				<li>
					<a
						href={r.url}
						target="_blank"
						rel="noopener noreferrer"
						class="repo-row group grid grid-cols-[1fr_auto] items-baseline gap-4 px-1 py-3 sm:grid-cols-[minmax(10rem,16rem)_1fr_auto_auto]"
						data-cursor
					>
						<span class="font-mono text-sm text-[var(--tx)] group-hover:text-[var(--brass)]"
							>{r.name}</span
						>
						<span
							class="col-span-2 hidden truncate text-sm text-[var(--tx-dim)] sm:col-span-1 sm:block"
						>
							{r.desc ?? m.projects_no_description()}
						</span>
						<span class="hidden font-mono text-[0.64rem] text-[var(--tx-faint)] sm:block"
							>{r.lang ?? '—'}</span
						>
						<span class="font-mono text-[0.64rem] text-[var(--tx-faint)]">
							{#if r.stars > 0}<span class="text-[var(--brass)]">★{r.stars}</span> ·
							{/if}{r.updated}
						</span>
					</a>
				</li>
			{:else}
				<li class="px-1 py-10 text-center text-sm text-[var(--tx-faint)]">
					{m.palette_no_results()}
				</li>
			{/each}
		</ul>

		<div class="mt-8 text-center" {@attach reveal()}>
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
				{m.projects_see_more_button()} · {m.projects_more_count({ n: repos.length })}
			</a>
		</div>
	</div>
</section>

<style>
	/* theme-aware flagship art — banner stays a watermark, never competes with copy */
	.banner-dark,
	.banner-light {
		opacity: 0.12;
	}
	.banner-light,
	.logo-light {
		display: none;
	}
	:global(html[data-theme='light']) .banner-dark,
	:global(html[data-theme='light']) .logo-dark {
		display: none;
	}
	:global(html[data-theme='light']) .banner-light,
	:global(html[data-theme='light']) .logo-light {
		display: block;
	}

	.repo-row {
		transition: background 0.2s ease;
	}
	.repo-row:hover {
		background: color-mix(in srgb, var(--brass) 6%, transparent);
	}
</style>
