<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { localeVersion } from '$lib/locale';
	import { ICONS } from '$lib/icons';
	import XLogo from '$components/XLogo.svelte';
	import { LINKS } from '$lib/links';
	import { scrollToEl } from '$lib/scroller';

	$localeVersion;
</script>

<footer class="relative z-10 border-t border-[var(--line)] bg-[var(--panel)]">
	<div
		class="mx-auto flex max-w-shell flex-col items-center justify-between gap-5 px-5 py-8 sm:flex-row"
	>
		<p class="font-mono text-[0.66rem] text-[var(--tx-faint)]">{m.footer_rights()}</p>

		<nav class="flex items-center gap-2" aria-label="social">
			<a
				href={LINKS.x}
				target="_blank"
				rel="noopener noreferrer"
				class="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-[var(--tx-dim)] transition-colors hover:border-[var(--brass)] hover:text-[var(--brass)]"
				aria-label={m.a11y_x()}
			>
				<XLogo size={12} />
			</a>
			<a
				href={LINKS.github}
				target="_blank"
				rel="noopener noreferrer"
				class="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-[var(--tx-dim)] transition-colors hover:border-[var(--brass)] hover:text-[var(--brass)]"
				aria-label={m.a11y_github()}
			>
				<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"
					><path d={ICONS.github}></path></svg
				>
			</a>
			<!-- email stays behind the reveal button in contact — no mailto leaks into HTML -->
			<a
				href="#contact"
				class="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-[var(--tx-dim)] transition-colors hover:border-[var(--brass)] hover:text-[var(--brass)]"
				aria-label={m.contact_email_cta()}
			>
				<svg
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"><path d={ICONS.mail}></path></svg
				>
			</a>
		</nav>

		<div class="flex items-center gap-5">
			<p class="hidden font-mono text-[0.62rem] text-[var(--tx-faint)] md:block">
				{m.footer_built()}
			</p>
			<button
				type="button"
				onclick={() => scrollToEl(0)}
				class="group inline-flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-widest text-[var(--tx-dim)] transition-colors hover:text-[var(--brass)]"
			>
				{m.footer_back_top()}
				<span class="inline-block -rotate-90 transition-transform group-hover:-translate-y-0.5">
					<svg
						width="13"
						height="13"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.2"
						stroke-linecap="round"
						stroke-linejoin="round"><path d={ICONS.chevron}></path></svg
					>
				</span>
			</button>
		</div>
	</div>
</footer>
