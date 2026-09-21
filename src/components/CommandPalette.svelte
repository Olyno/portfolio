<script lang="ts">
	import { LINKS, SECTIONS } from '$lib/links';
	import { ICONS } from '$lib/icons';
	import { paletteOpen } from '$lib/palette';
	import { gh } from '$lib/github';
	import { m } from '$lib/paraglide/messages.js';
	import { toggleLocale } from '$lib/locale';
	import { scrollToEl } from '$lib/scroller';
	import { localeVersion } from '$lib/locale';

	let input: HTMLInputElement | undefined = $state();
	let query = $state('');
	let sel = $state(0);

	const ghState = $derived($gh);

	interface Cmd {
		group: 'nav' | 'link' | 'repo';
		label: string;
		hint?: string;
		run: () => void;
	}

	const all = $derived.by((): Cmd[] => {
		void $localeVersion;
		const nav: Cmd[] = [
			['home', m.nav_home()],
			['about', m.nav_about()],
			['projects', m.nav_projects()],
			['activity', m.nav_activity()],
			['contact', m.nav_contact()]
		].map(([s, label]) => ({ group: 'nav', label, run: () => jump('#' + s) }));
		const links: Cmd[] = [
			{
				group: 'link',
				label: 'GitHub — @Olyno',
				hint: LINKS.github,
				run: () => open(LINKS.github)
			},
			{ group: 'link', label: 'X — @Olyno_', hint: LINKS.x, run: () => open(LINKS.x) },
			{
				group: 'link',
				label: 'PatchBay',
				hint: 'github.com/Olyno/patchbay',
				run: () => open('https://github.com/Olyno/patchbay')
			},
			{ group: 'link', label: 'Mod A Duck', hint: 'modaduck.co', run: () => open(LINKS.modaduck) },
			{
				group: 'link',
				label: 'Impeccable',
				hint: 'impeccable.style',
				run: () => open(LINKS.impeccable)
			},
			{ group: 'link', label: m.palette_lang(), hint: 'EN ⇄ FR', run: toggleLocale }
		];
		const repos: Cmd[] = ghState.repos.slice(0, 60).map((r) => ({
			group: 'repo',
			label: r.name,
			hint: r.desc ?? undefined,
			run: () => open(r.url)
		}));
		return [...nav, ...links, ...repos];
	});

	const filtered = $derived(
		query.trim()
			? all.filter(
					(c) =>
						c.label.toLowerCase().includes(query.toLowerCase()) ||
						c.hint?.toLowerCase().includes(query.toLowerCase())
				)
			: all.slice(0, 12)
	);

	$effect(() => {
		if (sel >= filtered.length) sel = 0;
	});

	$effect(() => {
		if ($paletteOpen) queueMicrotask(() => input?.focus());
	});

	function open(url: string) {
		window.open(url, '_blank', 'noopener');
		close();
	}
	function jump(hash: string) {
		const el = document.getElementById(hash.slice(1));
		if (el) scrollToEl(el, { offset: -16 });
		close();
	}
	function close() {
		paletteOpen.set(false);
		query = '';
		sel = 0;
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
		else if (e.key === 'ArrowDown') {
			e.preventDefault();
			sel = (sel + 1) % Math.max(1, filtered.length);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			sel = (sel - 1 + filtered.length) % Math.max(1, filtered.length);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			filtered[sel]?.run();
		}
	}
</script>

{#if $paletteOpen}
	<div class="fixed inset-0 z-[90]">
		<button
			type="button"
			class="absolute inset-0 h-full w-full bg-ink/70 backdrop-blur-sm"
			onclick={close}
			aria-label={m.nav_close()}
		></button>
		<div
			class="absolute inset-0 flex items-start justify-center px-4 pt-[14vh]"
			role="dialog"
			aria-modal="true"
			aria-label={m.a11y_command_palette()}
		>
			<div class="glass w-full max-w-xl overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,.9)]">
				<div class="flex items-center gap-3 border-b border-ink-line px-4 py-3">
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="shrink-0 text-gold"
						stroke-linecap="round"><path d={ICONS.search} /></svg
					>
					<input
						bind:this={input}
						type="text"
						bind:value={query}
						oninput={() => (sel = 0)}
						onkeydown={onKey}
						placeholder={m.palette_placeholder()}
						class="w-full bg-transparent py-1 text-sm text-cream outline-none placeholder:text-cream-faint"
						aria-label={m.palette_placeholder()}
					/>
					<span class="kbd hidden sm:block">esc</span>
				</div>

				<ul class="max-h-[52vh] overflow-y-auto p-2" role="listbox">
					{#each filtered as c, i (c.group + c.label)}
						<li>
							<button
								type="button"
								role="option"
								aria-selected={i === sel}
								onclick={c.run}
								onmousemove={() => (sel = i)}
								class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left"
								class:bg-[rgba(231,184,79,0.1)]={i === sel}
							>
								<span
									class="mono-label w-14 shrink-0 text-[0.58rem]"
									class:text-gold={c.group === 'nav'}
									class:text-teal={c.group === 'link'}
									class:text-cream-faint={c.group === 'repo'}
								>
									{c.group === 'nav'
										? m.palette_go()
										: c.group === 'link'
											? m.palette_links()
											: m.palette_repos()}
								</span>
								<span class="truncate text-sm font-medium text-cream">{c.label}</span>
								{#if c.hint}
									<span
										class="ml-auto hidden max-w-[38%] truncate text-xs text-cream-faint sm:block"
										>{c.hint}</span
									>
								{/if}
							</button>
						</li>
					{:else}
						<li class="px-4 py-8 text-center text-sm text-cream-faint">{m.palette_no_results()}</li>
					{/each}
				</ul>

				<div
					class="flex items-center justify-between border-t border-ink-line px-4 py-2 text-[0.65rem] text-cream-faint"
				>
					<span>{m.palette_footer()}</span>
					<span>{m.projects_live_note()}</span>
				</div>
			</div>
		</div>
	</div>
{/if}
