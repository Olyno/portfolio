<script lang="ts">
	/**
	 * Official X (Twitter) mark, extracted from the brand logo.
	 * Rendered as a CSS alpha-mask so it tints with `currentColor` in both themes.
	 */
	let { size = 12, cls = '' }: { size?: number; cls?: string } = $props();
</script>

<span
	class="x-mark inline-block shrink-0 bg-current {cls}"
	style="width:{size}px; height:{size}px"
	aria-hidden="true"
></span>

<style>
	.x-mark {
		-webkit-mask: url('/images/brand/x-logo.png') center / contain no-repeat;
		mask: url('/images/brand/x-logo.png') center / contain no-repeat;
	}
</style>
