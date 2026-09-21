<script lang="ts">
	import { LINKS } from '$lib/links';
	import { ICONS } from '$lib/icons';
	import { reveal, counter } from '$lib/attach';
	import { gh, totalContribs, langStats } from '$lib/github';
	import { m } from '$lib/paraglide/messages.js';
	import { paletteOpen } from '$lib/palette';

	const repos = $derived($gh.repos);
	const langs = $derived($langStats);

	const stars = $derived(repos.reduce((a, r) => a + r.stars, 0));
	const forks = $derived(repos.reduce((a, r) => a + r.forks, 0));

	// top 7 languages for the donut ring, normalized to 100
	const ring = $derived.by(() => {
		const top = $langStats.slice(0, 7);
		const total = top.reduce((a, [, n]) => a + n, 0) || 1;
		let acc = 0;
		const palette = ['#e7b84f', '#2dd4bf', '#7c9cf5', '#f2d38a', '#8b5cf6', '#b98a2c', '#f6f1e3'];
		return top.map(([lang, n], i) => {
			const seg = {
				lang,
				n,
				pct: (n / total) * 100,
				offset: acc,
				color: palette[i % palette.length]
			};
			acc += seg.pct;
			return seg;
		});
	});

	const stats = $derived([
		{ v: $gh.user?.public_repos ?? 169, l: m.about_stats_repos(), gold: false },
		{ v: totalContribs, l: m.about_stats_contribs(), gold: true },
		{ v: stars, l: m.about_stats_stars(), gold: false },
		{ v: forks, l: m.about_stats_forks(), gold: false },
		{ v: $gh.user?.followers ?? 90, l: m.about_stats_followers(), gold: false },
		{ v: langs.length, l: m.about_stats_langs(), gold: true }
	]);
</script>

<section id="about" class="relative mx-auto max-w-shell scroll-mt-24 px-5 py-[16vh]">
	<div {@attach reveal()}>
		<p class="eyebrow mono-label text-gold">{m.about_whoami()}</p>
		<h2 class="display mt-3 text-[clamp(1.9rem,5vw,3.4rem)]">{m.about_title()}</h2>
	</div>

	<div class="mt-10 grid gap-5 md:grid-cols-6">
		<!-- lead -->
		<article class="glass card-lift p-6 md:col-span-4 md:p-8" {@attach reveal(80)}>
			<p class="text-[1.05rem] leading-relaxed text-cream-dim md:text-lg">{m.about_lead()}</p>
			<button
				type="button"
				onclick={() => paletteOpen.set(true)}
				class="mono-label mt-6 inline-flex items-center gap-2 text-cream-faint transition-colors hover:text-gold"
			>
				{m.about_hint_cmdk()} <span class="kbd">⌘K</span>
			</button>
		</article>

		<!-- language ring -->
		<article
			class="glass card-lift flex flex-col items-center justify-center gap-4 p-6 md:col-span-2"
		>
			<div class="relative h-40 w-40">
				<svg viewBox="0 0 42 42" class="h-full w-full -rotate-90">
					<circle cx="21" cy="21" r="15.9" fill="none" stroke="#1b1e26" stroke-width="5" />
					{#each ring as seg (seg.lang)}
						<circle
							cx="21"
							cy="21"
							r="15.9"
							fill="none"
							stroke={seg.color}
							stroke-width="5"
							stroke-dasharray={`${seg.pct} ${100 - seg.pct}`}
							stroke-dashoffset={-seg.offset}
							class="ring-seg"
						/>
					{/each}
				</svg>
				<div class="absolute inset-0 grid place-items-center text-center">
					<div>
						<p class="font-display text-2xl font-extrabold">{langs.length}</p>
						<p class="mono-label text-cream-faint">{m.about_stats_langs()}</p>
					</div>
				</div>
			</div>
			<ul class="flex flex-wrap justify-center gap-x-3 gap-y-1">
				{#each ring.slice(0, 5) as seg (seg.lang)}
					<li class="flex items-center gap-1.5 text-xs text-cream-dim">
						<span class="h-2 w-2 rounded-full" style:background={seg.color}></span>{seg.lang}
					</li>
				{/each}
			</ul>
		</article>

		<!-- community -->
		<article class="glass card-lift p-6 md:col-span-2" {@attach reveal(60)}>
			<span class="mono-label text-teal">01</span>
			<h3 class="mt-2 font-display text-lg font-bold">{m.about_community_title()}</h3>
			<p class="mt-2 text-sm leading-relaxed text-cream-dim">{m.about_community_body()}</p>
			<div class="mt-4 flex gap-2">
				{#each ['Prisma', 'Supabase'] as c (c)}
					<span
						class="rounded-full border border-ink-line px-2.5 py-1 font-mono text-[0.65rem] text-cream-faint"
					>
						{c}
					</span>
				{/each}
			</div>
		</article>

		<!-- toolkit -->
		<article class="glass card-lift p-6 md:col-span-2" {@attach reveal(140)}>
			<span class="mono-label text-teal">02</span>
			<h3 class="mt-2 font-display text-lg font-bold">{m.about_stack_title()}</h3>
			<p class="mt-2 text-sm leading-relaxed text-cream-dim">{m.about_stack_body()}</p>
			<div class="mt-4 flex flex-wrap gap-2">
				{#each ['TS', 'Svelte', 'Rust', 'Java', 'Node', 'SQL', 'Nim', 'Docker'] as t (t)}
					<span
						class="rounded-full border border-ink-line px-2.5 py-1 font-mono text-[0.65rem] text-cream-faint"
					>
						{t}
					</span>
				{/each}
			</div>
		</article>

		<!-- since -->
		<article class="glass card-lift p-6 md:col-span-2" {@attach reveal(220)}>
			<span class="mono-label text-teal">03</span>
			<h3 class="mt-2 font-display text-lg font-bold">{m.about_since_title()}</h3>
			<p class="mt-2 text-sm leading-relaxed text-cream-dim">{m.about_since_body()}</p>
			<a
				href={LINKS.repos}
				target="_blank"
				rel="noopener noreferrer"
				class="mono-label mt-4 inline-flex items-center gap-1.5 text-gold transition-colors hover:text-gold-soft"
			>
				<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" class="opacity-80"
					><path d={ICONS.github} /></svg
				>
				{m.projects_see_more_button()}
			</a>
		</article>
	</div>

	<!-- stat rail -->
	<dl
		class="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-line bg-ink-line sm:grid-cols-3 lg:grid-cols-6"
	>
		{#each stats as s (s.l)}
			<div class="bg-ink-soft/80 px-4 py-5 text-center backdrop-blur">
				<dd
					class="font-display text-xl font-extrabold text-cream sm:text-2xl"
					class:text-gold={s.gold}
					{@attach counter(s.v)}
				>
					{s.v.toLocaleString('en')}
				</dd>
				<dt class="mono-label mt-1.5 text-[0.55rem] text-cream-faint">{s.l}</dt>
			</div>
		{/each}
	</dl>
</section>

<style>
	.ring-seg {
		transition: stroke-dasharray 1s cubic-bezier(0.22, 1, 0.36, 1);
	}
</style>
