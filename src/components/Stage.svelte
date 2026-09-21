<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { get } from 'svelte/store';
	import { Universe, type HoverPayload, type DayHover } from '$lib/three/universe';
	import { gh } from '$lib/github';
	import { SECTIONS } from '$lib/links';
	import { m } from '$lib/paraglide/messages.js';

	let canvas: HTMLCanvasElement;
	let tip: HTMLDivElement;
	let dayTip: HTMLDivElement;

	let hover = $state<HoverPayload | null>(null);
	let day = $state<DayHover | null>(null);

	onMount(() => {
		if (import.meta.env.SSR) return;
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const lowPower =
			navigator.hardwareConcurrency <= 4 || matchMedia('(pointer: coarse)').matches || reduce;
		const uni = new Universe(
			canvas,
			{
				onRepoHover: (h) => {
					hover = h;
				},
				onDayHover: (d) => {
					day = d;
				}
			},
			lowPower ? 'low' : 'high'
		);
		uni.setRepos(get(gh).repos);

		// re-seat the camera keyframes once content has laid out
		const seat = () => {
			const se = document.documentElement;
			const max = se.scrollHeight - innerHeight;
			if (max <= 0) return;
			const stops: [number, number][] = [[0, 0]];
			const zoneT = [0, 0.22, 0.36, 0.58, 0.86, 1];
			SECTIONS.forEach((id, i) => {
				const el = document.getElementById(id);
				if (!el) return;
				const top = el.getBoundingClientRect().top + scrollY;
				const f = Math.min(1, Math.max(0, top / max));
				stops.push([f, zoneT[Math.min(i, zoneT.length - 1)]]);
			});
			uni.setKeyframes(stops);
		};
		tick().then(() => setTimeout(seat, 350));
		setTimeout(seat, 1600);

		const unsub = gh.subscribe((s) => uni.setRepos(s.repos));
		const onResize = () => setTimeout(seat, 150);
		addEventListener('resize', onResize);

		return () => {
			unsub();
			removeEventListener('resize', onResize);
			uni.dispose();
			hover = null;
			day = null;
		};
	});

	// format the hovered day for the tooltip
	function dayLabel(d: DayHover): string {
		const date = new Date(d.date + 'T00:00:00Z');
		const s = date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
		return d.count > 0
			? m.contrib_day_cell({ n: d.count, date: s })
			: m.contrib_no_cell({ date: s });
	}
</script>

<canvas class="stage" bind:this={canvas} aria-hidden="true"></canvas>

<!-- repo orb tooltip -->
<div
	class="orb-tip"
	class:show={hover}
	style={hover ? `left:${hover.sx}px; top:${hover.sy}px` : ''}
	role="status"
>
	<span class="name">{hover?.name}</span>
	<span class="stars">★ {hover?.stars ?? 0}</span>
</div>

<!-- contribution day tooltip -->
<div
	class="orb-tip day"
	class:show={day}
	style={day ? `left:${day.sx}px; top:${day.sy}px` : ''}
	role="status"
>
	<span class="name">{day ? dayLabel(day) : ''}</span>
</div>

<style>
	.orb-tip {
		position: fixed;
		z-index: 40;
		transform: translate(-50%, -130%);
		pointer-events: none;
		display: flex;
		gap: 0.5rem;
		align-items: center;
		padding: 0.35rem 0.75rem;
		border-radius: 999px;
		background: rgba(12, 14, 18, 0.88);
		border: 1px solid rgba(231, 184, 79, 0.45);
		backdrop-filter: blur(6px);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.72rem;
		white-space: nowrap;
		opacity: 0;
		transition: opacity 0.18s ease;
	}
	.orb-tip.show {
		opacity: 1;
	}
	.orb-tip.day {
		border-color: rgba(45, 212, 191, 0.5);
	}
	.name {
		color: #f6f1e3;
	}
	.stars {
		color: #e7b84f;
	}
</style>
