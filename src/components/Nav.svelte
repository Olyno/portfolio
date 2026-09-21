<script lang="ts">
	import { page } from '$app/state';
	import { LINKS } from '$lib/links';
	import { ICONS } from '$lib/icons';
	import XLogo from '$components/XLogo.svelte';
	import { paletteOpen } from '$lib/palette';
	import { m } from '$lib/paraglide/messages.js';
	import { toggleLocale, readCookieLocale, localeVersion } from '$lib/locale';
	import { theme, toggleTheme } from '$lib/theme';

	let open = $state(false);
	// Nav remounts on locale switch (keyed in layout); this reads the live cookie
	let lang = $state<'en' | 'fr'>('en');
	$effect(() => {
		$localeVersion;
		lang = readCookieLocale();
	});

	const items = $derived([
		['home', m.nav_home()],
		['about', m.nav_about()],
		['projects', m.nav_projects()],
		['activity', m.nav_activity()],
		['contact', m.nav_contact()]
	] as [string, string][]);

	let scrolled = $state(false);
	$effect(() => {
		const on = () => (scrolled = scrollY > 24);
		on();
		addEventListener('scroll', on, { passive: true });
		return () => removeEventListener('scroll', on);
	});

	let active = $state('home');
	$effect(() => {
		const ids = ['home', 'about', 'projects', 'activity', 'contact'];
		const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
		// a band across the viewport center: whichever section crosses it wins
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						active = e.target.id;
						break;
					}
				}
			},
			{ rootMargin: '-45% 0px -45% 0px' }
		);
		els.forEach((el) => io.observe(el));
		return () => io.disconnect();
	});

	const headerCls = $derived(
		`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
			scrolled || open
				? 'border-b border-[var(--line)] bg-[var(--plate)]'
				: 'border-b border-transparent [background:linear-gradient(to_bottom,var(--plate)_98%,var(--plate)_70%,transparent_112%)]'
		}`
	);
</script>

<header class={headerCls}>
	<div class="mx-auto flex max-w-shell items-center justify-between px-5 py-4 md:px-8">
		<a href="#home" class="group flex items-baseline gap-2" aria-label="Olyno — home">
			<span class="serif text-2xl italic">Olyno</span>
			<span class="data-label group-hover:text-[var(--brass)]">.dev</span>
		</a>

		<nav class="hidden items-center gap-6 md:flex" aria-label={m.a11y_main_nav()}>
			{#each items as [id, label], i (id)}
				<a
					href="#{id}"
					class="group relative font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--tx-dim)] transition-colors hover:text-[var(--tx)]"
					class:text-[var(--brass)]={active === id}
					aria-current={active === id ? 'page' : undefined}
				>
					<span class="mr-1.5 text-[0.55rem] opacity-60">{String(i + 1).padStart(2, '0')}</span>
					{label}
					<span
						class="absolute -bottom-1.5 left-0 h-px w-0 bg-[var(--brass)] transition-all duration-300 group-hover:w-full"
						class:w-full={active === id}
					></span>
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={() => paletteOpen.set(true)}
				class="hidden items-center gap-2 rounded-md border border-[var(--line)] px-2.5 py-1.5 font-mono text-[0.66rem] text-[var(--tx-faint)] transition-colors hover:border-[var(--brass)] hover:text-[var(--tx)] md:flex"
				aria-label={m.a11y_command_palette()}
			>
				<svg
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"><path d={ICONS.search}></path></svg
				>
				<span class="kbd !border-0 !bg-transparent !p-0">⌘K</span>
			</button>

			<!-- theme toggle: day / night -->
			<button
				type="button"
				onclick={toggleTheme}
				class="theme-knob"
				role="switch"
				aria-checked={$theme === 'dark'}
				aria-label={m.a11y_theme()}
				data-cursor
			>
				<i></i>
			</button>

			<button
				type="button"
				onclick={toggleLocale}
				class="rounded-md border border-[var(--line)] px-2.5 py-1.5 font-mono text-[0.66rem] text-[var(--tx-dim)] transition-colors hover:border-[var(--brass)] hover:text-[var(--brass)]"
				aria-label={m.a11y_lang_switch()}
			>
				{lang === 'fr' ? 'EN' : 'FR'}
			</button>

			<a
				href={LINKS.x}
				target="_blank"
				rel="noopener noreferrer"
				class="hidden h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-[var(--tx-dim)] transition-colors hover:border-[var(--brass)] hover:text-[var(--brass)] sm:grid"
				aria-label={m.a11y_x()}
			>
				<XLogo size={12} />
			</a>

			<button
				type="button"
				onclick={() => (open = !open)}
				class="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-[var(--tx)] md:hidden"
				aria-label={open ? m.a11y_close_menu() : m.a11y_open_menu()}
				aria-expanded={open}
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
				>
					<path d={open ? ICONS.close : ICONS.menu}></path>
				</svg>
			</button>
		</div>
	</div>

	{#if open}
		<div class="mobile-sheet border-b border-[var(--line)] bg-[var(--panel)] px-5 pb-5 md:hidden">
			<nav class="flex flex-col" aria-label={m.a11y_main_nav()}>
				{#each items as [id, label], i (id)}
					<a
						href="#{id}"
						onclick={() => (open = false)}
						class="flex items-baseline gap-3 border-b border-[var(--line-soft)] py-3 last:border-0"
					>
						<span class="data-label">{String(i + 1).padStart(2, '0')}</span>
						<span class="serif text-xl">{label}</span>
					</a>
				{/each}
			</nav>
		</div>
	{/if}
</header>
