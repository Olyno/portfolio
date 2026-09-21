<script lang="ts">
	import { contributions, totalContribs } from '$lib/github';
	import { reveal } from '$lib/attach';
	import { m } from '$lib/paraglide/messages.js';
	import { localeVersion } from '$lib/locale';
	import { getLocale } from '$lib/paraglide/runtime.js';

	const { counts, dates } = contributions;
	const max = Math.max(...counts, 1);

	const weeks = $derived.by(() => {
		void $localeVersion;
		const locale = getLocale();
		const today = new Date().toISOString().slice(0, 10);
		const out: { cells: { date: string; count: number; level: number }[]; month: string | null }[] =
			[];
		let col: { date: string; count: number; level: number }[] = [];
		let lastMonth = -1;
		for (let i = 0; i < counts.length; i++) {
			if (dates[i] > today) break;
			const d = new Date(dates[i] + 'T00:00:00Z');
			const c = counts[i];
			const ratio = c / max;
			const level = c === 0 ? 0 : ratio > 0.6 ? 4 : ratio > 0.3 ? 3 : ratio > 0.12 ? 2 : 1;
			col.push({ date: dates[i], count: c, level });
			if (col.length === 7) {
				const month = d.getUTCMonth();
				const label = month !== lastMonth ? d.toLocaleDateString(locale, { month: 'short' }) : null;
				lastMonth = month;
				out.push({ cells: col, month: label });
				col = [];
			}
		}
		if (col.length) out.push({ cells: col, month: null });
		return out;
	});

	const shownCells = $derived(weeks.flatMap((w) => w.cells));
	const active = $derived(shownCells.filter((c) => c.count > 0).length);

	// hottest continuous 4-week stretch — the survey's "peak"
	const peak = $derived.by(() => {
		const flat = shownCells;
		let best = 0;
		let bi = 0;
		for (let i = 0; i + 28 <= flat.length; i += 4) {
			const s = flat.slice(i, i + 28).reduce((a, b) => a + b.count, 0);
			if (s > best) {
				best = s;
				bi = i;
			}
		}
		const d = new Date(flat[bi]?.date + 'T00:00:00Z');
		return {
			n: best,
			label: isNaN(+d) ? '' : d.toLocaleDateString(getLocale(), { month: 'long', year: 'numeric' })
		};
	});

	function title(c: number, d: string): string {
		const date = new Date(d + 'T00:00:00Z').toLocaleDateString(getLocale(), {
			weekday: 'long',
			month: 'long',
			day: 'numeric'
		});
		return c > 0 ? m.contrib_day_cell({ n: c, date }) : m.contrib_no_cell({ date });
	}
</script>

<section id="activity" class="relative mx-auto max-w-shell scroll-mt-24 px-5 py-[12vh]">
	<header {@attach reveal()} class="flex flex-wrap items-end justify-between gap-6">
		<div>
			<p class="data-label mb-2">№ 04 — {m.nav_activity()}</p>
			<h2 class="serif text-[clamp(2.2rem,6vw,4rem)]">{m.contrib_title()}</h2>
			<p class="mt-3 max-w-xl text-[var(--tx-dim)]">{m.contrib_subtitle()}</p>
		</div>
		<!-- the ridge behind this section is the same dataset; say so -->
		<p
			class="hidden max-w-[16rem] border-l border-[var(--brass)] pl-4 font-mono text-[0.66rem] leading-relaxed text-[var(--tx-faint)] lg:block"
		>
			{m.contrib_parity()}
		</p>
	</header>

	<div class="mt-10 grid gap-5 lg:grid-cols-[1fr_auto]">
		<article class="tick card overflow-x-auto p-5 sm:p-7" {@attach reveal(60)}>
			<div class="min-w-[44rem]">
				<div class="relative mb-2.5 h-4 font-mono text-[0.6rem] text-[var(--tx-faint)]">
					{#each weeks as w, i (i)}
						{#if w.month}
							<span class="absolute top-0" style:left={`${(i / weeks.length) * 100}%`}
								>{w.month}</span
							>
						{/if}
					{/each}
				</div>

				<div class="heat-grid" role="grid" aria-label={m.contrib_title()}>
					{#each weeks as wk, wi (wi)}
						{#each wk.cells as c (c.date)}
							<div
								class="heat-cell"
								role="gridcell"
								data-level={c.level}
								title={title(c.count, c.date)}
								aria-label={title(c.count, c.date)}
							></div>
						{/each}
					{/each}
				</div>

				<div
					class="mt-3.5 flex items-center justify-end gap-1.5 font-mono text-[0.6rem] text-[var(--tx-faint)]"
				>
					<span>{m.contrib_less()}</span>
					{#each [0, 1, 2, 3, 4] as lv (lv)}
						<span class="heat-cell h-2.5 w-2.5" data-level={lv}></span>
					{/each}
					<span>{m.contrib_more()}</span>
				</div>
			</div>
		</article>

		<dl class="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
			<div class="tick card px-5 py-4" {@attach reveal(60)}>
				<dd class="serif text-3xl text-[var(--brass)]">{totalContribs.toLocaleString('en')}</dd>
				<dt class="data-label mt-1">{m.contrib_total({ n: totalContribs })}</dt>
			</div>
			<div class="tick card px-5 py-4" {@attach reveal(120)}>
				<dd class="serif text-3xl">{active.toLocaleString('en')}</dd>
				<dt class="data-label mt-1">{m.contrib_active_days({ n: active })}</dt>
			</div>
			<div class="tick card px-5 py-4" {@attach reveal(180)}>
				<dd class="serif text-3xl">{peak.n.toLocaleString('en')}</dd>
				<dt class="data-label mt-1">{m.contrib_busiest()} · {peak.label}</dt>
			</div>
		</dl>
	</div>
</section>
