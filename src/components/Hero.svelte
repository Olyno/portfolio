<script lang="ts">
	import { LL } from '$i18n/i18n-svelte';
	import { onMount } from 'svelte';

	let shouldScroll = false;

	onMount(() => {
		const scrollTimeout = setTimeout(() => (shouldScroll = true), 5000);

		const handleScroll = () => {
			shouldScroll = false;
			clearTimeout(scrollTimeout);
			document.removeEventListener('scroll', handleScroll);
		};

		document.addEventListener('scroll', handleScroll);

		return () => {
			clearTimeout(scrollTimeout);
			document.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<section id="home" class="flex flex-col justify-center items-center h-screen">
	<img
		data-src="https://github.com/Olyno.png"
		alt="Olyno's Avatar"
		class="lazyload rounded-full w-48 h-48 mb-8 self-center"
	/>
	<h1 class="text-4xl">{$LL.hero.title()}</h1>
	<p class="text-xl">{$LL.hero.subtitle()}</p>

	{#if shouldScroll}
		<p class="mt-5">
			<a
				aria-label={$LL.hero.scroll()}
				href="#about"
				data-aos="fade-up"
				data-aos-duration="2000"
				class="scrollButton"
			>
				<span />
			</a>
		</p>
	{/if}
</section>
