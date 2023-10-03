<script lang="ts">
	import LL from '$i18n/i18n-svelte';
</script>

<footer class="w-full bg-highlight text-primary py-6 px-8">
	<div class="text-center">
		<p>
			&copy; 2023 Olyno. {@html $LL.footer
				.content()
				.replaceAll(
					'GitHub',
					`<a
						href="https://github.com/Olyno"
						target="_blank"
						class="text-secondary hover:text-background transition-colors duration-300"
					>
						GitHub
					</a>`
				)
				.replaceAll(
					'Twitter',
					`<a
						href="https://twitter.com/OlynoWorker"
						target="_blank"
						class="text-secondary hover:text-background transition-colors duration-300"
					>
						Twitter
					</a>`
				)}
		</p>
	</div>
</footer>
