<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { localeVersion } from '$lib/locale';
	import { ICONS } from '$lib/icons';
	import { scrollToEl } from '$lib/scroller';

	$localeVersion;
</script>

<footer class="relative z-10 border-t border-ink-line bg-ink-soft/70 backdrop-blur-md">
	<div
		class="mx-auto flex max-w-shell flex-col items-center justify-between gap-5 px-5 py-8 sm:flex-row"
	>
		<p class="text-sm text-cream-faint">{m.footer_rights()}</p>
		<p class="font-mono text-[0.66rem] text-cream-faint">{m.footer_built()}</p>
		<button
			type="button"
			onclick={() => scrollToEl(0)}
			class="group inline-flex items-center gap-2 text-sm text-cream-dim transition-colors hover:text-gold"
		>
			{m.footer_back_top()}
			<span class="inline-block -rotate-90 transition-transform group-hover:-translate-y-0.5">
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.4"
					stroke-linecap="round"
					stroke-linejoin="round"><path d={ICONS.chevron} /></svg
				>
			</span>
		</button>
	</div>
</footer>
