<script lang="ts">
	import { onMount } from 'svelte';
	import { LINKS } from '$lib/links';
	import { magnetic } from '$lib/attach';
	import { gh, totalContribs } from '$lib/github';
	import { m } from '$lib/paraglide/messages.js';
	import { localeVersion } from '$lib/locale';
	import XLogo from '$components/XLogo.svelte';

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
			srcset="/images/brand/banner-960.webp 960w, /images/brand/banner.webp 1920w"
			sizes="100vw"
			alt={m.hero_banner_alt()}
			class="banner-img h-full w-full object-cover"
			fetchpriority="high"
			decoding="async"
		/>
		<div class="veil"></div>
	</div>

	<div
		class="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-shell flex-col justify-end px-6 pb-12 sm:px-10 lg:px-14 sm:pb-16"
	>
		<!-- one composed plate: portrait left, wordmark right — not two stuck-on elements -->
		<div class="grid items-end gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
			<!-- the portrait: a framed engraving, deliberately large -->
			<div class="portrait mx-auto lg:mx-0" data-aos-portrait>
				<div class="portrait-frame">
					<img
						src="/images/brand/avatar-512.webp"
						srcset="/images/brand/avatar-192.webp 192w, /images/brand/avatar-512.webp 512w"
						sizes="(min-width: 1024px) 220px, 160px"
						alt="Portrait of Olyno"
						width="220"
						height="220"
						class="h-full w-full rounded-full object-cover"
						fetchpriority="high"
					/>
				</div>
				<p class="portrait-caption serif">{m.hero_portrait_caption()}</p>
			</div>

			<!-- wall label block -->
			<div class="max-w-2xl pb-1">
				<p class="kicker mb-5 flex items-center gap-3">
					<span class="brass-dot"></span>
					{m.hero_kicker()}
				</p>

				<h1 class="serif text-[clamp(3rem,8.5vw,6rem)] leading-[0.95] text-[var(--tx)]">
					<span class="block text-[0.32em] font-normal tracking-[0.01em]"
						>{#each titleWords.slice(0, -1) as w, i (`${lang}-a-${w}-${i}`)}<span class="word"
								><span class="word-in">{w}</span></span
							>
						{/each}</span
					>
					<span class="italic">{titleWords.at(-1)}</span><span class="text-[var(--brass)]">.</span>
				</h1>

				<p class="mt-5 font-mono text-sm text-[var(--tx-dim)] sm:text-base">
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
						class="btn btn-ghost !px-3.5"
						aria-label={m.hero_x_handle()}
						data-cursor
					>
						<XLogo size={15} />
					</a>
				</div>
			</div>
		</div>

		<!-- the exhibit's census -->
		<dl class="mt-12 flex flex-wrap gap-x-12 gap-y-4 border-t border-[var(--line)] pt-5">
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
	/* readability veil: art on top, a solid paper shelf where the copy lives */
	.veil {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(
				to top,
				var(--plate) 0%,
				var(--plate) 22%,
				color-mix(in srgb, var(--plate) 94%, transparent) 34%,
				color-mix(in srgb, var(--plate) 62%, transparent) 52%,
				color-mix(in srgb, var(--plate) 18%, transparent) 74%,
				transparent 100%
			),
			linear-gradient(
				to right,
				color-mix(in srgb, var(--plate) 58%, transparent) 0%,
				color-mix(in srgb, var(--plate) 24%, transparent) 42%,
				transparent 68%
			);
	}
	/* portrait: matted like a specimen plate */
	.portrait {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.9rem;
	}
	.portrait-frame {
		position: relative;
		width: 160px;
		height: 160px;
		padding: 9px;
		border-radius: 50%;
		background: color-mix(in srgb, var(--panel) 88%, transparent);
		border: 1px solid var(--line);
		box-shadow:
			0 0 0 1px color-mix(in srgb, var(--brass) 28%, transparent),
			0 18px 50px -18px rgb(0 0 0 / 0.45);
	}
	.portrait-frame::before {
		content: '';
		position: absolute;
		inset: -12px;
		border-radius: 50%;
		border: 1px dashed color-mix(in srgb, var(--brass) 50%, transparent);
	}
	.portrait-frame::after {
		content: '';
		position: absolute;
		inset: -12px;
		border-radius: 50%;
		border-top: 2px solid var(--brass);
		animation: orbit 9s linear infinite;
	}
	.portrait-caption {
		font-size: 0.95rem;
		font-style: italic;
		color: var(--tx-dim);
		text-align: center;
		max-width: 15rem;
		line-height: 1.3;
	}
	@keyframes orbit {
		to {
			transform: rotate(360deg);
		}
	}
	/* the identity line — big enough to read at a glance */
	.kicker {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--tx);
		font-weight: 500;
	}
	.brass-dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--brass);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--brass) 22%, transparent);
	}
	@media (min-width: 1024px) {
		.portrait-frame {
			width: 220px;
			height: 220px;
		}
	}
</style>
