<script lang="ts">
	import { LINKS } from '$lib/links';
	import { ICONS } from '$lib/icons';
	import { reveal } from '$lib/attach';
	import { m } from '$lib/paraglide/messages.js';
	import { localeVersion } from '$lib/locale';

	$localeVersion;

	const email = LINKS.email;
	let copied = $state(false);

	async function copyEmail() {
		try {
			await navigator.clipboard.writeText(email);
		} catch {
			/* clipboard unavailable — the address is visible on the button anyway */
		}
		copied = true;
		setTimeout(() => (copied = false), 2200);
	}

	const cards = $derived([
		{
			href: LINKS.x,
			label: m.contact_x_cta(),
			sub: '@Olyno_',
			icon: ICONS.x,
			fill: true
		},
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
			sub: 'buymeacoffee.com/olyno',
			icon: ICONS.coffee,
			fill: false
		}
	]);
</script>

<section id="contact" class="relative mx-auto max-w-shell scroll-mt-24 px-5 pb-[6vh] pt-[10vh]">
	<div class="glass relative overflow-hidden px-6 py-14 text-center sm:px-12 sm:py-20">
		<div
			class="pointer-events-none absolute -top-32 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl"
		></div>
		<p class="eyebrow mono-label justify-center text-gold">04 — hello@world</p>
		<h2 class="display mx-auto mt-3 max-w-2xl text-[clamp(2.1rem,6vw,4.2rem)]">
			{m.contact_title()}
		</h2>
		<p class="mx-auto mt-4 max-w-xl text-cream-dim">{m.contact_lead()}</p>

		<div class="mt-9 flex flex-wrap items-center justify-center gap-3">
			<button type="button" onclick={copyEmail} class="btn btn-solid" data-cursor>
				{#if copied}
					<span aria-live="polite">{m.contact_copied()}</span>
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
					<span class="font-mono text-xs opacity-70">{email}</span>
				{/if}
			</button>
		</div>

		<div class="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
			{#each cards as c (c.href)}
				<a
					href={c.href}
					target="_blank"
					rel="noopener noreferrer"
					class="glass card-lift group flex flex-col items-center gap-1.5 !rounded-xl px-4 py-5"
					{@attach reveal(0)}
				>
					<svg
						width="17"
						height="17"
						viewBox="0 0 24 24"
						fill={c.fill ? 'currentColor' : 'none'}
						stroke={c.fill ? 'none' : 'currentColor'}
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-cream-dim transition-colors group-hover:text-gold"
						><path d={c.icon}></path></svg
					>
					<span class="text-sm font-semibold text-cream transition-colors group-hover:text-gold"
						>{c.label}</span
					>
					<span class="font-mono text-[0.62rem] text-cream-faint">{c.sub}</span>
				</a>
			{/each}
		</div>
	</div>
</section>
