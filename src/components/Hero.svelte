<script lang="ts">
	import { onMount } from 'svelte';
	import { LINKS } from '$lib/links';
	import { ICONS } from '$lib/icons';
	import { magnetic } from '$lib/attach';
	import { gh, totalContribs } from '$lib/github';
	import { m } from '$lib/paraglide/messages.js';
	import { localeVersion } from '$lib/locale';

	const ghState = $derived($gh);

	// `void $localeVersion` re-runs the derivation on language switch
	const roles = $derived.by(() => {
		void $localeVersion;
		return [
			m.hero_role_1(),
			m.hero_role_2(),
			m.hero_role_3(),
			m.hero_role_4(),
			m.hero_role_5(),
			m.hero_role_6()
		];
	});
	const titleWords = $derived.by(() => {
		void $localeVersion;
		return `${m.hero_title_a()} ${m.hero_title_b()}`.split(' ');
	});
	const lang = $derived($localeVersion);

	let typed = $state('');
	let caret = $state(true);

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			typed = roles[0];
			return;
		}
		let idx = 0;
		let n = 0;
		let deleting = false;
		let timer: ReturnType<typeof setTimeout>;
		const step = () => {
			const target = roles[idx];
			if (!deleting) {
				n++;
				typed = target.slice(0, n);
				if (n >= target.length) {
					deleting = true;
					timer = setTimeout(step, 2200);
					return;
				}
				timer = setTimeout(step, 40 + Math.random() * 42);
			} else {
				n--;
				typed = target.slice(0, n);
				if (n <= 0) {
					deleting = false;
					idx = (idx + 1) % roles.length;
					timer = setTimeout(step, 380);
					return;
				}
				timer = setTimeout(step, 20);
			}
		};
		timer = setTimeout(step, 1100);
		const blink = setInterval(() => (caret = !caret), 530);
		return () => {
			clearTimeout(timer);
			clearInterval(blink);
		};
	});

	const since = $derived(new Date(ghState.user?.created_at ?? 0).getUTCFullYear() || 2017);

	function spotlight(e: PointerEvent) {
		const s = document.documentElement.style;
		s.setProperty('--spot-x', e.clientX + 'px');
		s.setProperty('--spot-y', e.clientY + 'px');
	}
</script>

<svelte:window onpointermove={spotlight} />

<section
	id="home"
	class="relative flex min-h-[100svh] scroll-mt-20 flex-col items-center justify-center px-5"
>
	<div class="mx-auto w-full max-w-shell pb-16 pt-28 text-center">
		<p class="mono-label mb-6 inline-flex items-center gap-2 text-gold/90">
			<span class="relative flex h-2 w-2">
				<span
					class="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60"
				></span>
				<span class="relative inline-flex h-2 w-2 rounded-full bg-gold"></span>
			</span>
			{m.hero_kicker()}
		</p>

		<h1 class="display mx-auto max-w-5xl text-[clamp(2.2rem,6.6vw,4.6rem)]">
			{#each titleWords as w, i (`${lang}-${w}-${i}`)}
				<span class="word"
					><span class="word-in" style:animation-delay={`${0.25 + i * 0.12}s`}>{w}</span></span
				>
			{/each}
			<span class="word"
				><span
					class="word-in brass-text"
					style:animation-delay={`${0.25 + titleWords.length * 0.12}s`}>.</span
				></span
			>
		</h1>

		<p
			class="mx-auto mt-6 flex min-h-14 max-w-xl items-start justify-center gap-x-2 font-mono text-sm leading-7 text-cream-dim sm:text-base"
		>
			<span class="shrink-0 text-cream-faint">{m.hero_role_prefix()}&nbsp;</span>
			<span class="text-left text-teal"
				>{typed}<span class="text-gold" class:opacity-0={!caret}>▍</span></span
			>
		</p>

		<div class="mt-10 flex flex-wrap items-center justify-center gap-4">
			<a href="#projects" class="btn btn-solid" {@attach magnetic(0.2)} data-cursor>
				{m.hero_cta_projects()}
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.4"
					stroke-linecap="round"
					stroke-linejoin="round"><path d={ICONS.arrow}></path></svg
				>
			</a>
			<a href="#contact" class="btn btn-ghost" {@attach magnetic(0.16)} data-cursor>
				{m.hero_cta_contact()}
			</a>
			<a
				href={LINKS.x}
				target="_blank"
				rel="noopener noreferrer"
				class="btn btn-ghost !px-4"
				aria-label={m.hero_x_handle()}
				data-cursor
			>
				<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"
					><path d={ICONS.x}></path></svg
				>
				@Olyno_
			</a>
		</div>

		<dl
			class="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-ink-line bg-ink-line"
		>
			<div class="bg-ink-soft/80 px-3 py-5 backdrop-blur">
				<dd class="font-display text-2xl font-extrabold text-cream sm:text-3xl">
					{ghState.user?.public_repos ?? 169}
				</dd>
				<dt class="mono-label mt-1 text-cream-faint">{m.hero_meta_repos()}</dt>
			</div>
			<div class="bg-ink-soft/80 px-3 py-5 backdrop-blur">
				<dd class="font-display text-2xl font-extrabold text-gold sm:text-3xl">
					{totalContribs.toLocaleString('en')}
				</dd>
				<dt class="mono-label mt-1 text-cream-faint">{m.hero_meta_contribs()}</dt>
			</div>
			<div class="bg-ink-soft/80 px-3 py-5 backdrop-blur">
				<dd class="font-display text-2xl font-extrabold text-cream sm:text-3xl">{since}</dd>
				<dt class="mono-label mt-1 text-cream-faint">{m.hero_meta_since()}</dt>
			</div>
		</dl>

		<div class="mt-16 flex justify-center">
			<a aria-label={m.hero_scroll()} href="#about" class="scrollButton" data-cursor>
				<span></span>
			</a>
		</div>
	</div>
</section>

<style>
	.word-in {
		display: inline-block;
		margin-right: 0.22em;
		opacity: 0;
		transform: translateY(110%);
		animation: word-up 0.95s cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}
	@keyframes word-up {
		to {
			opacity: 1;
			transform: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.word-in {
			opacity: 1;
			transform: none;
			animation: none;
		}
	}
</style>
