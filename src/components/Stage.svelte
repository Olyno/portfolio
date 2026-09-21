<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { get } from 'svelte/store';
	import { Survey, type StarHover, type DayHover } from '$lib/three/universe';
	import { gh, totalContribs } from '$lib/github';
	import { SECTIONS } from '$lib/links';
	import { m } from '$lib/paraglide/messages.js';
	import { theme } from '$lib/theme';

	let canvas: HTMLCanvasElement;
	let survey: Survey | null = null;

	let hover = $state<StarHover | null>(null);
	let day = $state<DayHover | null>(null);
	let plate = $state(0);
	let repoCount = $state(0);
	const repos = $derived($gh.repos);
	$effect(() => {
		repoCount = repos.length;
	});

	// HUD captions name the exhibit: the background IS the data, labelled.
	const plateCaption = $derived([
		m.plate_0({ n: repoCount }),
		m.plate_1({ n: repoCount }),
		m.plate_2({ n: totalContribs }),
		m.plate_3()
	]);

	onMount(() => {
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const lowPower =
			navigator.hardwareConcurrency <= 4 || matchMedia('(pointer: coarse)').matches || reduce;
		survey = new Survey(
			canvas,
			{
				onStarHover: (h) => (hover = h),
				onDayHover: (d) => (day = d)
			},
			lowPower ? 'low' : 'high'
		);
		survey.setRepos(get(gh).repos);

		const seat = () => {
			if (!survey) return;
			const se = document.documentElement;
			const max = se.scrollHeight - innerHeight;
			if (max <= 0) return;
			const stops: [number, number][] = [[0, 0]];
			const zoneT = [0, 0.24, 0.4, 0.62, 0.88, 1];
			SECTIONS.forEach((id, i) => {
				const el = document.getElementById(id);
				if (!el) return;
				const top = el.getBoundingClientRect().top + scrollY;
				const f = Math.min(1, Math.max(0, top / max));
				stops.push([f, zoneT[Math.min(i, zoneT.length - 1)]]);
			});
			survey.setKeyframes(stops);
		};
		tick().then(() => setTimeout(seat, 350));
		setTimeout(seat, 1700);

		const unsub = gh.subscribe((s) => survey?.setRepos(s.repos));
		const unsubTheme = theme.subscribe(() => survey?.applyTheme());
		const hud = setInterval(() => {
			if (survey) plate = survey.currentPlate();
		}, 250);
		addEventListener('resize', seat);

		return () => {
			clearInterval(hud);
			unsub();
			unsubTheme();
			removeEventListener('resize', seat);
			survey?.dispose();
			survey = null;
		};
	});

	function dayLabel(d: DayHover): string {
		const date = new Date(d.date + 'T00:00:00Z');
		const s = date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
		return d.count > 0
			? m.contrib_day_cell({ n: d.count, date: s })
			: m.contrib_no_cell({ date: s });
	}
</script>

<canvas class="stage" bind:this={canvas} aria-hidden="true"></canvas>

<div class="marks" aria-hidden="true"><i></i><i></i><i></i><i></i></div>

<div class="hud" aria-hidden="true">
	<span class="no">{m.hud_survey()}</span>
	<span class="rule"></span>
	<span>
		{String(plate).padStart(2, '0')} · {plateCaption[plate]}
	</span>
</div>

<!-- repo star tooltip -->
<div
	class="tip"
	class:show={hover}
	style={hover ? `left:${hover.sx}px; top:${hover.sy}px` : ''}
	role="status"
>
	<span class="name">{hover?.name}</span>
	<span class="stars">★ {hover?.stars ?? 0}</span>
</div>

<!-- contribution day tooltip -->
<div
	class="tip day"
	class:show={day}
	style={day ? `left:${day.sx}px; top:${day.sy}px` : ''}
	role="status"
>
	<span class="name">{day ? dayLabel(day) : ''}</span>
</div>

<style>
	.tip {
		position: fixed;
		z-index: 40;
		transform: translate(-50%, -130%);
		pointer-events: none;
		display: flex;
		gap: 0.5rem;
		align-items: center;
		padding: 0.3rem 0.7rem;
		border-radius: 6px;
		background: var(--panel);
		border: 1px solid var(--line);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		white-space: nowrap;
		opacity: 0;
		transition: opacity 0.18s ease;
	}
	.tip.show {
		opacity: 1;
	}
	.tip.day {
		border-color: color-mix(in srgb, var(--verify) 55%, var(--line));
	}
	.name {
		color: var(--tx);
	}
	.stars {
		color: var(--brass);
	}
</style>
