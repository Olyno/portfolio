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
		let lastMonthShown = -1;
		for (let i = 0; i < counts.length; i++) {
			if (dates[i] > today) break;
			const d = new Date(dates[i] + 'T00:00:00Z');
			const c = counts[i];
			const ratio = c / max;
			const level = c === 0 ? 0 : ratio > 0.6 ? 4 : ratio > 0.3 ? 3 : ratio > 0.12 ? 2 : 1;
			col.push({ date: dates[i], count: c, level });
			if (col.length === 7) {
				const month = d.getUTCMonth();
				const showMonth =
					month !== lastMonthShown ? d.toLocaleDateString(locale, { month: 'short' }) : null;
				lastMonthShown = month;
				out.push({ cells: col, month: showMonth });
				col = [];
			}
		}
		if (col.length) out.push({ cells: col, month: null });
		return out;
	});

	const shownCells = $derived(weeks.flatMap((w) => w.cells));
	const active = $derived(shownCells.filter((c) => c.count > 0).length);

	// busiest continuous 4-week stretch
	const busy = $derived.by(() => {
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

<section id="activity" class="relative mx-auto max-w-shell scroll-mt-24 px-5 py-[10vh]">
	<div {@attach reveal()}>
		<p class="eyebrow mono-label text-gold">03 — {m.nav_activity()}</p>
		<h2 class="display mt-3 text-[clamp(1.9rem,5vw,3.4rem)]">{m.contrib_title()}</h2>
		<p class="mt-3 max-w-2xl text-cream-dim">{m.contrib_subtitle()}</p>
	</div>

	<div class="mt-10 grid gap-5 lg:grid-cols-[1fr_auto]">
		<article class="glass overflow-x-auto p-6 sm:p-8" {@attach reveal(80)}>
			<div class="min-w-[46rem]">
				<div class="relative mb-3 h-4 font-mono text-[0.6rem] text-cream-faint">
					{#each weeks as w, i (i)}
						{#if w.month}
							<span
								class="absolute top-0 whitespace-nowrap"
								style:left={`${(i / weeks.length) * 100}%`}>{w.month}</span
							>
						{/if}
					{/each}
				</div>

				<div class="heat-grid" role="grid" aria-label={m.contrib_title()}>
					{#each weeks as cell, wi (wi)}
						{#each cell.cells as c (c.date)}
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
					class="mt-4 flex items-center justify-end gap-1.5 font-mono text-[0.62rem] text-cream-faint"
				>
					<span>{m.contrib_less()}</span>
					{#each [0, 1, 2, 3, 4] as lv (lv)}
						<span class="heat-cell h-3 w-3" data-level={lv}></span>
					{/each}
					<span>{m.contrib_more()}</span>
				</div>
			</div>
		</article>

		<dl class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
			<div class="glass card-lift px-5 py-4" {@attach reveal(60)}>
				<dd class="font-display text-2xl font-extrabold text-gold">
					{totalContribs.toLocaleString('en')}
				</dd>
				<dt class="mono-label mt-1 text-cream-faint">{m.contrib_total({ n: totalContribs })}</dt>
			</div>
			<div class="glass card-lift px-5 py-4" {@attach reveal(120)}>
				<dd class="font-display text-2xl font-extrabold text-cream">
					{active.toLocaleString('en')}
				</dd>
				<dt class="mono-label mt-1 text-cream-faint">{m.contrib_active_days({ n: active })}</dt>
			</div>
			<div class="glass card-lift px-5 py-4" {@attach reveal(180)}>
				<dd class="font-display text-xl font-extrabold text-teal">{busy.n.toLocaleString('en')}</dd>
				<dt class="mono-label mt-1 text-cream-faint">{m.contrib_busiest()} · {busy.label}</dt>
			</div>
		</dl>
	</div>
</section>
