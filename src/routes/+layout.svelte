<script lang="ts">
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import '../app.css';
	import { refreshLive } from '$lib/github';
	import { paletteOpen } from '$lib/palette';
	import { setScroller } from '$lib/scroller';
	import Nav from '$components/Nav.svelte';
	import Stage from '$components/Stage.svelte';
	import CommandPalette from '$components/CommandPalette.svelte';
	import Cursor from '$components/Cursor.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { localeVersion } from '$lib/locale';

	let { children } = $props();
	let booting = $state(true);

	onMount(() => {
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const lenis = new Lenis({
			lerp: 0.085,
			smoothWheel: !reduce,
			touchMultiplier: 0.6
		});
		setScroller(lenis);
		let raf = 0;
		const tick = (time: number) => {
			lenis.raf(time);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);

		// anchor links ride the smooth scroller
		const onClick = (e: MouseEvent) => {
			const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
			if (!a) return;
			const id = a.getAttribute('href')!.slice(1);
			const el = document.getElementById(id);
			if (!el) return;
			e.preventDefault();
			lenis.scrollTo(el, { offset: -16 });
			history.replaceState(null, '', '#' + id);
		};
		document.addEventListener('click', onClick);

		// ⌘K / Ctrl+K
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				paletteOpen.update((v) => !v);
			}
		};
		addEventListener('keydown', onKey);

		refreshLive();
		setTimeout(() => (booting = false), reduce ? 0 : 900);

		return () => {
			cancelAnimationFrame(raf);
			document.removeEventListener('click', onClick);
			removeEventListener('keydown', onKey);
			lenis.destroy();
			setScroller(null);
		};
	});
</script>

<svelte:head>
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Person",
			"name": "Olyno",
			"url": "https://olyno.dev",
			"image": "https://olyno.dev/images/brand/avatar-512.webp",
			"jobTitle": "Full Stack Developer",
			"description": "Idea starter & open-source enthusiast. Full-stack developer, content manager and Discord moderator for the official Prisma & Supabase communities. Builder of PatchBay and Mod A Duck.",
			"email": "mailto:olyno.dev@gmail.com",
			"sameAs": ["https://github.com/Olyno", "https://x.com/Olyno_"],
			"knowsAbout": ["TypeScript", "Svelte", "Rust", "Java", "Open Source"],
			"address": { "@type": "PostalAddress", "addressCountry": "FR" }
		}
	</script>
</svelte:head>

<div class="boot" class:boot-out={!booting} aria-hidden="true">
	<span class="p"></span><span class="p"></span><span class="p"></span>
</div>

<Stage />
<div class="grain" aria-hidden="true"></div>
<div class="spotlight" aria-hidden="true"></div>
<Cursor />
{#key $localeVersion}
	<Nav />
{/key}
<CommandPalette />

<a
	href="#home"
	class="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-gold px-4 py-2 font-semibold text-ink transition-transform focus:translate-y-0"
	>{m.a11y_skip()}</a
>

<main class="relative z-10">
	{#key $localeVersion}
		{@render children()}
	{/key}
</main>

<style>
	.boot {
		position: fixed;
		inset: 0;
		z-index: 2147483646;
		background: #07080a;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		transition:
			opacity 0.6s ease,
			visibility 0.6s;
	}
	.boot-out {
		opacity: 0;
		visibility: hidden;
	}
	.p {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: #e7b84f;
		animation: pulse 0.9s ease-in-out infinite;
	}
	.p:nth-child(2) {
		animation-delay: 0.15s;
	}
	.p:nth-child(3) {
		animation-delay: 0.3s;
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 0.25;
			transform: scale(0.8);
		}
		50% {
			opacity: 1;
			transform: scale(1.15);
		}
	}
</style>
