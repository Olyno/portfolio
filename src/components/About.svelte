<script lang="ts">
	import { LINKS } from '$lib/links';
	import { ICONS } from '$lib/icons';
	import { reveal, counter } from '$lib/attach';
	import { gh, totalContribs, langStats } from '$lib/github';
	import { m } from '$lib/paraglide/messages.js';
	import { localeVersion } from '$lib/locale';

	const st = $derived($gh);
	const langs = $derived($langStats);
	$localeVersion;

	const stars = $derived(st.repos.reduce((a, r) => a + r.stars, 0));
	const forks = $derived(st.repos.reduce((a, r) => a + r.forks, 0));

	// language instrument ring
	const ring = $derived.by(() => {
		const top = $langStats.slice(0, 6);
		const total = top.reduce((a, [, n]) => a + n, 0) || 1;
		let acc = 0;
		const palette = [
			'var(--brass)',
			'var(--verify)',
			'var(--ember)',
			'#7c9cf5',
			'var(--tx-dim)',
			'var(--brass-deep)'
		];
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
		{ v: st.user?.public_repos ?? 169, l: m.about_stats_repos() },
		{ v: totalContribs, l: m.about_stats_contribs() },
		{ v: stars, l: m.about_stats_stars() },
		{ v: forks, l: m.about_stats_forks() },
		{ v: st.user?.followers ?? 90, l: m.about_stats_followers() },
		{ v: langs.length, l: m.about_stats_langs() }
	]);
</script>

<section id="about" class="relative mx-auto max-w-shell scroll-mt-24 px-5 py-[12vh]">
	<header {@attach reveal()}>
		<p class="data-label mb-2">№ 00 — {m.about_kicker()}</p>
		<h2 class="serif text-[clamp(2.2rem,6vw,4rem)]">{m.about_title()}</h2>
	</header>

	<div class="mt-10 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
		<!-- statement -->
		<article class="tick card flex flex-col justify-between p-6 sm:p-9" {@attach reveal(60)}>
			<p class="serif text-[clamp(1.25rem,2.6vw,1.7rem)] leading-snug text-[var(--tx)]">
				{m.about_lead()}
			</p>
			<div class="mt-8 border-t border-[var(--line)] pt-5">
				<p class="data-label">{m.about_role_now()}</p>
				<p class="mt-1.5 font-mono text-sm text-[var(--brass)]">{m.about_role_now_v()}</p>
			</div>
		</article>

		<!-- instrument ring -->
		<article
			class="tick card flex flex-col items-center justify-center gap-4 p-6"
			{@attach reveal(120)}
		>
			<div class="relative h-36 w-36">
				<svg viewBox="0 0 42 42" class="h-full w-full -rotate-90">
					<circle
						cx="21"
						cy="21"
						r="15.9"
						fill="none"
						stroke="var(--line-soft)"
						stroke-width="4.5"
					/>
					{#each ring as seg (seg.lang)}
						<circle
							cx="21"
							cy="21"
							r="15.9"
							fill="none"
							stroke={seg.color}
							stroke-width="4.5"
							stroke-dasharray={`${seg.pct} ${100 - seg.pct}`}
							stroke-dashoffset={-seg.offset}
						/>
					{/each}
				</svg>
				<div class="absolute inset-0 grid place-items-center text-center">
					<div>
						<p class="serif text-2xl">{langs.length}</p>
						<p class="data-label">{m.about_stats_langs()}</p>
					</div>
				</div>
			</div>
			<ul class="flex flex-wrap justify-center gap-x-3 gap-y-1">
				{#each ring.slice(0, 5) as seg (seg.lang)}
					<li class="flex items-center gap-1.5 font-mono text-[0.66rem] text-[var(--tx-dim)]">
						<span class="h-1.5 w-1.5 rounded-full" style:background={seg.color}></span>{seg.lang}
					</li>
				{/each}
			</ul>
		</article>

		<!-- roles worn -->
		<article class="tick card p-6" {@attach reveal(60)}>
			<h3 class="serif text-xl">{m.about_roles_title()}</h3>
			<ul class="mt-4 space-y-2.5">
				{#each m.about_roles().split(' · ') as role, i (role)}
					<li class="flex items-baseline gap-3 text-sm text-[var(--tx-dim)]">
						<span class="data-label">{String(i + 1).padStart(2, '0')}</span>
						{role}
					</li>
				{/each}
			</ul>
		</article>

		<!-- instruments + since -->
		<article class="tick card p-6" {@attach reveal(120)}>
			<h3 class="serif text-xl">{m.about_stack_title()}</h3>
			<p class="mt-2 text-sm leading-relaxed text-[var(--tx-dim)]">{m.about_stack_body()}</p>
			<div class="mt-4 flex flex-wrap gap-1.5">
				{#each ['TS', 'Svelte', 'Rust', 'Java', 'Node', 'SQL', 'Nim', 'Docker'] as tool (tool)}
					<span
						class="border border-[var(--line)] bg-[var(--plate)] px-2 py-0.5 font-mono text-[0.62rem] text-[var(--tx-dim)]"
					>
						{tool}
					</span>
				{/each}
			</div>
			<p class="mt-5 border-t border-[var(--line)] pt-4 text-sm text-[var(--tx-dim)]">
				{m.about_since_body()}
				<a
					href={LINKS.repos}
					target="_blank"
					rel="noopener noreferrer"
					class="ml-1 inline-flex items-center gap-1 text-[var(--brass)] hover:underline"
				>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"
						><path d={ICONS.github}></path></svg
					>
					{m.projects_see_more_button()}
				</a>
			</p>
		</article>
	</div>

	<!-- census strip -->
	<dl
		class="mt-6 grid grid-cols-3 divide-x divide-[var(--line)] overflow-hidden rounded-lg border border-[var(--line)] sm:grid-cols-6"
		{@attach reveal()}
	>
		{#each stats as s (s.l)}
			<div class="bg-[var(--panel)] px-3 py-4 text-center">
				<dd class="serif text-xl text-[var(--tx)] sm:text-2xl" {@attach counter(s.v)}>
					{s.v.toLocaleString('en')}
				</dd>
				<dt class="data-label mt-1 text-[0.52rem]">{s.l}</dt>
			</div>
		{/each}
	</dl>
</section>
