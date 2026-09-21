<script lang="ts">
	import { LINKS } from '$lib/links';
	import { ICONS } from '$lib/icons';
	import { paletteOpen } from '$lib/palette';
	import { gh } from '$lib/github';
	import { m } from '$lib/paraglide/messages.js';
	import { toggleLocale, localeVersion } from '$lib/locale';
	import { scrollToEl } from '$lib/scroller';

	let input: HTMLInputElement | undefined = $state();
	let query = $state('');
	let sel = $state(0);

	const ghState = $derived($gh);
	void $localeVersion;

	interface Cmd {
		group: 'nav' | 'link' | 'repo';
		label: string;
		hint?: string;
		run: () => void;
	}

	const all = $derived.by((): Cmd[] => {
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
				run: () => open(LINKS.patchbay)
			},
			{ group: 'link', label: 'Mod A Duck', hint: 'modaduck.co', run: () => open(LINKS.modaduck) },
			{ group: 'link', label: m.palette_lang(), hint: 'EN ⇄ FR', run: toggleLocale }
		];
		const repos: Cmd[] = ghState.repos.slice(0, 80).map((r) => ({
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
			: all.slice(0, 14)
	);

	$effect(() => {
		if (sel >= filtered.length) sel = 0;
	});

	$effect(() => {
		if ($paletteOpen) queueMicrotask(() => input?.focus());
	});

	// global escape — works even if focus somehow left the input
	function onWindowKey(e: KeyboardEvent) {
		if ($paletteOpen && e.key === 'Escape') {
			e.preventDefault();
			close();
		}
	}

	function open(url: string) {
		window.open(url, '_blank', 'noopener');
		close();
	}
	function jump(hash: string) {
		const el = document.getElementById(hash.slice(1));
		scrollToEl(el ?? 0, el && hash !== '#home' ? { offset: -16 } : undefined);
		close();
	}
	function close() {
		paletteOpen.set(false);
		query = '';
		sel = 0;
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
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

	const groupGlyph: Record<Cmd['group'], string> = { nav: '→', link: '↗', repo: '◉' };
	const groupLabel = $derived({
		nav: m.palette_go(),
		link: m.palette_links(),
		repo: m.palette_repos()
	});
</script>

<svelte:window onkeydown={onWindowKey} />

{#if $paletteOpen}
	<div class="fixed inset-0 z-[90]">
		<button
			type="button"
			class="absolute inset-0 h-full w-full cursor-default bg-[color-mix(in_srgb,var(--plate)_62%,transparent)] backdrop-blur-[2px]"
			onclick={close}
			aria-label={m.nav_close()}
		></button>

		<div
			class="pointer-events-none absolute inset-0 flex items-start justify-center px-4 pt-[14vh]"
		>
			<div
				class="sheet-in pointer-events-auto w-full max-w-xl overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--panel)] shadow-[0_40px_120px_-20px_rgba(0,0,0,.45)]"
				role="dialog"
				tabindex="-1"
				aria-modal="true"
				aria-label={m.a11y_command_palette()}
				onkeydown={onKey}
			>
				<div class="flex items-center gap-3 border-b border-[var(--line)] px-4 py-3">
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="shrink-0 text-[var(--brass)]"
						stroke-linecap="round"><path d={ICONS.search}></path></svg
					>
					<input
						bind:this={input}
						type="text"
						bind:value={query}
						oninput={() => (sel = 0)}
						placeholder={m.palette_placeholder()}
						class="w-full bg-transparent py-1 text-sm text-[var(--tx)] outline-none placeholder:text-[var(--tx-faint)]"
						aria-label={m.palette_placeholder()}
					/>
					<span class="kbd">esc</span>
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
								class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left"
								class:bg-[color-mix(in_srgb,var(--brass)_10%,transparent)]={i === sel}
							>
								<span
									class="w-4 shrink-0 text-center font-mono text-[0.7rem]"
									class:text-[var(--brass)]={c.group === 'nav'}
									class:text-[var(--verify)]={c.group === 'link'}
									class:text-[var(--tx-faint)]={c.group === 'repo'}
									title={groupLabel[c.group]}
									aria-label={groupLabel[c.group]}
								>
									{groupGlyph[c.group]}
								</span>
								<span class="min-w-0 flex-1 truncate text-sm font-medium text-[var(--tx)]"
									>{c.label}</span
								>
								{#if c.hint}
									<span
										class="hidden max-w-[34%] shrink-0 truncate text-right text-xs text-[var(--tx-faint)] sm:block"
										>{c.hint}</span
									>
								{/if}
							</button>
						</li>
					{:else}
						<li class="px-4 py-8 text-center text-sm text-[var(--tx-faint)]">
							{m.palette_no_results()}
						</li>
					{/each}
				</ul>

				<div
					class="flex items-center justify-between border-t border-[var(--line)] px-4 py-2 font-mono text-[0.62rem] text-[var(--tx-faint)]"
				>
					<span>{m.palette_footer()}</span>
					<span>{m.projects_live_note()}</span>
				</div>
			</div>
		</div>
	</div>
{/if}
