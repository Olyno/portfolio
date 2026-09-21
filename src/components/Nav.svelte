<script lang="ts">
	import { page } from '$app/state';
	import { LINKS } from '$lib/links';
	import { ICONS } from '$lib/icons';
	import { paletteOpen } from '$lib/palette';
	import { m } from '$lib/paraglide/messages.js';
	import { readCookieLocale, toggleLocale, localeVersion } from '$lib/locale';

	let open = $state(false);
	let lang = $state(readCookieLocale());
	$effect(() => {
		lang = readCookieLocale();
		$localeVersion;
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
		// a 2px band across the viewport center: whichever section crosses it
		// is the one being read — robust for sections taller than the viewport
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
		`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
			scrolled ? 'bg-[rgba(12,14,18,0.72)] backdrop-blur-xl border-b border-ink-line' : ''
		}`
	);
</script>

<header class={headerCls}>
	<div class="mx-auto flex max-w-shell items-center justify-between px-5 py-4 md:px-8">
		<a href="#home" class="group flex items-center gap-3" aria-label="Olyno — home">
			<span
				class="grid h-9 w-9 place-items-center rounded-xl bg-gold font-display text-sm font-extrabold text-ink shadow-[0_0_24px_rgba(231,184,79,.35)] transition-transform duration-300 group-hover:rotate-6"
			>
				O
			</span>
			<span class="hidden font-display text-lg font-bold tracking-tight sm:block">
				Olyno<span class="text-gold">.dev</span>
			</span>
		</a>

		<nav class="hidden items-center gap-1 md:flex" aria-label={m.a11y_main_nav()}>
			{#each items as [id, label] (id)}
				<a
					href="#{id}"
					class="relative rounded-full px-4 py-2 text-sm text-cream-dim transition-colors hover:text-cream"
					class:text-gold={active === id}
					aria-current={active === id ? 'page' : undefined}
				>
					{label}
					{#if active === id}
						<span
							class="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-gold to-transparent"
						></span>
					{/if}
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={() => paletteOpen.set(true)}
				class="hidden items-center gap-2 rounded-full border border-ink-line px-3 py-1.5 text-xs text-cream-faint transition-colors hover:border-gold/50 hover:text-cream md:flex"
				aria-label={m.a11y_command_palette()}
			>
				<svg
					width="13"
					height="13"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"><path d={ICONS.search} /></svg
				>
				<span class="kbd">⌘K</span>
			</button>

			<button
				type="button"
				onclick={toggleLocale}
				class="mono-label rounded-full border border-ink-line px-3 py-1.5 text-cream-dim transition-colors hover:border-gold/50 hover:text-gold"
				aria-label={m.a11y_lang_switch()}
			>
				{lang === 'en' ? 'FR' : 'EN'}
			</button>

			<a
				href={LINKS.x}
				target="_blank"
				rel="noopener noreferrer"
				class="grid h-9 w-9 place-items-center rounded-full border border-ink-line text-cream-dim transition-all hover:-translate-y-0.5 hover:border-gold/60 hover:text-gold"
				aria-label={m.a11y_x()}
			>
				<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"
					><path d={ICONS.x} /></svg
				>
			</a>
			<a
				href={LINKS.github}
				target="_blank"
				rel="noopener noreferrer"
				class="hidden h-9 w-9 place-items-center rounded-full border border-ink-line text-cream-dim transition-all hover:-translate-y-0.5 hover:border-gold/60 hover:text-gold sm:grid"
				aria-label={m.a11y_github()}
			>
				<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"
					><path d={ICONS.github} /></svg
				>
			</a>

			<button
				type="button"
				onclick={() => (open = !open)}
				class="grid h-9 w-9 place-items-center rounded-full border border-ink-line text-cream md:hidden"
				aria-label={open ? m.a11y_close_menu() : m.a11y_open_menu()}
				aria-expanded={open}
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
				>
					<path d={open ? ICONS.close : ICONS.menu} />
				</svg>
			</button>
		</div>
	</div>

	{#if open}
		<div
			class="mobile-sheet border-b border-ink-line bg-ink-soft/95 px-5 pb-5 backdrop-blur-xl md:hidden"
		>
			<nav class="flex flex-col" aria-label={m.a11y_main_nav()}>
				{#each items as [id, label] (id)}
					<a
						href="#{id}"
						onclick={() => (open = false)}
						class="border-b border-ink-line/60 py-3 font-display text-lg font-bold"
						class:text-gold={active === id}
					>
						{label}
					</a>
				{/each}
			</nav>
		</div>
	{/if}
</header>
