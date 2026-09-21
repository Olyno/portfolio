<script lang="ts">
	/**
	 * The official X mark, used as-is: black artwork on light theme,
	 * white artwork on dark. Two real <img>s toggled by the theme attribute.
	 */
	let { size = 12, cls = '' }: { size?: number; cls?: string } = $props();
</script>

<span class="x-wrap {cls}" style="width:{size}px; height:{size}px">
	<img src="/images/brand/x-logo.png" alt="" class="x-light" width="108" height="108" />
	<img src="/images/brand/x-logo-white.png" alt="" class="x-dark" width="108" height="108" />
</span>

<style>
	.x-wrap {
		position: relative;
		display: inline-block;
		flex-shrink: 0;
	}
	.x-wrap img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	.x-dark {
		display: none;
	}
	:global(html[data-theme='dark']) .x-light {
		display: none;
	}
	:global(html[data-theme='dark']) .x-dark {
		display: block;
	}
</style>
