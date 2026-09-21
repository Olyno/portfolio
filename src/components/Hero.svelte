<script lang="ts">
	import { onMount } from 'svelte';
	import { LINKS } from '$lib/links';
	import { magnetic } from '$lib/attach';
	import { gh, totalContribs } from '$lib/github';
	import { m } from '$lib/paraglide/messages.js';
	import { localeVersion } from '$lib/locale';

	const st = $derived($gh);
	const lang = $derived($localeVersion);

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

	let typed = $state('');
	let caret = $state(true);

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			typed = roles[0];
			return;
		}
		let idx = 0;
		let n = 0;
		let del = false;
		let timer: ReturnType<typeof setTimeout>;
		const step = () => {
			const target = roles[idx];
			if (!del) {
				n++;
				typed = target.slice(0, n);
				if (n >= target.length) {
					del = true;
					timer = setTimeout(step, 2200);
					return;
				}
				timer = setTimeout(step, 38 + Math.random() * 40);
			} else {
				n--;
				typed = target.slice(0, n);
				if (n <= 0) {
					del = false;
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

	const since = $derived(new Date(st.user?.created_at ?? 0).getUTCFullYear() || 2017);

	// banner parallax (drives via CSS var, no per-frame style thrash)
	let bannerWrap: HTMLDivElement | undefined = $state();
	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let raf = 0;
		let ticking = false;
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			raf = requestAnimationFrame(() => {
				ticking = false;
				if (bannerWrap && scrollY < innerHeight * 1.5) {
					bannerWrap.style.setProperty('--sy', String(scrollY));
				}
			});
		};
		addEventListener('scroll', onScroll, { passive: true });
		return () => {
			removeEventListener('scroll', onScroll);
			cancelAnimationFrame(raf);
		};
	});
</script>

<svelte:head>
	<title>Olyno — Entrepreneur, full-stack developer, idea starter</title>
</svelte:head>

<section id="home" class="relative min-h-[100svh]">
	<!-- exhibition plate: the banner is the artwork, framed like a gallery piece -->
	<div
		class="plate-wrap absolute inset-0 overflow-hidden"
		bind:this={bannerWrap}
		style="transform: translate3d(calc(var(--sy,0) * -0.18px), 0, 0) scale(1.08)"
	>
		<img
			src="/images/brand/banner.webp"
			alt={m.hero_banner_alt()}
			class="banner-img h-full w-full object-cover"
			fetchpriority="high"
		/>
		<div class="veil"></div>
	</div>

	<!-- the engraving: avatar in a hairline ring, top-left of the plate -->
	<div
		class="absolute left-1/2 top-24 z-10 -translate-x-1/2 sm:left-8 sm:top-auto sm:translate-x-0 lg:top-40"
	>
		<div class="avatar-ring">
			<img
				src="/images/brand/avatar-192.webp"
				alt="Olyno"
				width="72"
				height="72"
				class="h-[72px] w-[72px] rounded-full object-cover"
			/>
		</div>
	</div>

	<div
		class="relative z-10 mx-auto flex min-h-[100svh] max-w-shell flex-col justify-end px-5 pb-10 sm:pb-16"
	>
		<!-- editorial block bottom-left, like a wall label -->
		<div class="max-w-2xl">
			<p class="data-label mb-4 flex items-center gap-3">
				<span class="brass-dot"></span>
				{m.hero_kicker()}
			</p>

			<h1 class="serif text-[clamp(2.8rem,9vw,6.2rem)] text-[var(--tx)]">
				<span class="block text-[0.34em] tracking-[0.01em]"
					>{#each titleWords.slice(0, -1) as w, i (`${lang}-a-${w}-${i}`)}<span class="word"
							><span class="word-in">{w}</span></span
						>
					{/each}</span
				>
				<span class="italic">{titleWords.at(-1)}</span><span class="text-[var(--brass)]">.</span>
			</h1>

			<p class="mt-4 font-mono text-sm text-[var(--tx-dim)] sm:text-base">
				{m.hero_role_prefix()}&nbsp;<span class="text-[var(--brass)]">{typed}</span><span
					class:opacity-0={!caret}>▍</span
				>
			</p>

			<div class="mt-8 flex flex-wrap items-center gap-3">
				<a href="#projects" class="btn btn-solid" {@attach magnetic(0.18)} data-cursor>
					{m.hero_cta_projects()}
				</a>
				<a href="#contact" class="btn btn-ghost" {@attach magnetic(0.14)} data-cursor>
					{m.hero_cta_contact()}
				</a>
				<a
					href={LINKS.x}
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-ghost !px-3"
					aria-label={m.hero_x_handle()}
					data-cursor>X</a
				>
			</div>

			<!-- wall-label stats: the exhibit's census -->
			<dl class="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-[var(--line)] pt-5">
				<div>
					<dd class="serif text-2xl text-[var(--tx)]">{st.user?.public_repos ?? 169}</dd>
					<dt class="data-label">{m.hero_meta_repos()}</dt>
				</div>
				<div>
					<dd class="serif text-2xl text-[var(--brass)]">{totalContribs.toLocaleString('en')}</dd>
					<dt class="data-label">{m.hero_meta_contribs()}</dt>
				</div>
				<div>
					<dd class="serif text-2xl text-[var(--tx)]">{since}</dd>
					<dt class="data-label">{m.hero_meta_since()}</dt>
				</div>
			</dl>
		</div>
	</div>

	<a
		aria-label={m.hero_scroll()}
		href="#about"
		class="scrollButton absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:flex"
		data-cursor><span></span></a
	>
</section>

<style>
	.plate-wrap {
		will-change: transform;
	}
	.banner-img {
		filter: saturate(0.92) contrast(1.02);
	}
	/* duotone veil: keeps the artwork visible but readable under text */
	.veil {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(
				to top,
				color-mix(in srgb, var(--plate) 88%, transparent) 0%,
				color-mix(in srgb, var(--plate) 30%, transparent) 38%,
				transparent 70%
			),
			radial-gradient(
				120% 90% at 85% 10%,
				transparent 30%,
				color-mix(in srgb, var(--plate) 35%, transparent) 100%
			);
	}
	.brass-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--brass);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--brass) 22%, transparent);
	}
	.avatar-ring {
		position: relative;
		display: inline-flex;
		padding: 6px;
		border-radius: 50%;
		border: 1px solid var(--line);
		background: color-mix(in srgb, var(--panel) 80%, transparent);
	}
	.avatar-ring::before {
		content: '';
		position: absolute;
		inset: -7px;
		border-radius: 50%;
		border: 1px dashed color-mix(in srgb, var(--brass) 55%, transparent);
		animation: spin 24s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
