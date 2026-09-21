<script lang="ts">
	import { LINKS, email } from '$lib/links';
	import { ICONS } from '$lib/icons';
	import { reveal } from '$lib/attach';
	import { magnetic } from '$lib/attach';
	import { m } from '$lib/paraglide/messages.js';
	import { localeVersion } from '$lib/locale';

	$localeVersion;

	const addr = email();
	let revealed = $state(false);
	let copied = $state(false);

	async function copyEmail() {
		revealed = true;
		try {
			await navigator.clipboard.writeText(addr);
			copied = true;
			setTimeout(() => (copied = false), 2400);
		} catch {
			/* clipboard blocked — the revealed address is selectable anyway */
		}
	}

	const cards = $derived([
		{ href: LINKS.x, label: m.contact_x_cta(), sub: '@Olyno_', icon: ICONS.x, fill: true },
		{
			href: LINKS.github,
			label: m.contact_github_cta(),
			sub: 'github.com/Olyno',
			icon: ICONS.github,
			fill: true
		},
		{
			href: LINKS.coffee,
			label: m.contact_coffee_cta(),
			sub: 'buymeacoffee',
			icon: ICONS.coffee,
			fill: false
		}
	]);
</script>

<section id="contact" class="relative mx-auto max-w-shell scroll-mt-24 px-5 pb-[10vh] pt-[8vh]">
	<div class="tick card relative overflow-hidden px-6 py-12 sm:px-12 sm:py-16" {@attach reveal()}>
		<p class="data-label mb-3">№ 05 — closing note</p>
		<h2 class="serif max-w-2xl text-[clamp(2.2rem,6.5vw,4.4rem)]">{m.contact_title()}</h2>
		<p class="mt-4 max-w-xl text-[var(--tx-dim)]">{m.contact_lead()}</p>

		<div class="mt-9 flex flex-wrap items-center gap-3">
			<button
				type="button"
				onclick={copyEmail}
				class="btn btn-solid"
				{@attach magnetic(0.16)}
				data-cursor
			>
				{#if copied}
					<span aria-live="polite">{m.contact_copied()}</span>
				{:else if revealed}
					<span class="font-mono text-sm">{addr}</span>
					<span class="opacity-50">— {m.contact_email_cta()}</span>
				{:else}
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"><path d={ICONS.mail}></path></svg
					>
					{m.contact_email_cta()}
				{/if}
			</button>
			<span class="font-mono text-[0.64rem] text-[var(--tx-faint)]">{m.contact_email_hint()}</span>
		</div>

		<div class="mt-10 grid gap-3 sm:grid-cols-3">
			{#each cards as c (c.href)}
				<a
					href={c.href}
					target="_blank"
					rel="noopener noreferrer"
					class="card group flex items-center gap-3 px-4 py-4"
					{@attach reveal(0)}
					data-cursor
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill={c.fill ? 'currentColor' : 'none'}
						stroke={c.fill ? 'none' : 'currentColor'}
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="shrink-0 text-[var(--tx-dim)] transition-colors group-hover:text-[var(--brass)]"
						><path d={c.icon}></path></svg
					>
					<span class="min-w-0">
						<span class="block text-sm font-semibold group-hover:text-[var(--brass)]"
							>{c.label}</span
						>
						<span class="block truncate font-mono text-[0.62rem] text-[var(--tx-faint)]"
							>{c.sub}</span
						>
					</span>
				</a>
			{/each}
		</div>
	</div>
</section>
