<script context="module" lang="ts">
	import AboutMe from '$components/AboutMe.svelte';
	import Footer from '$components/Footer.svelte';
	import Hero from '$components/Hero.svelte';
	import Navbar from '$components/Navbar.svelte';
	import Projects from '$components/Projects.svelte';
</script>

<div class="flex min-h-screen">
	<Navbar />

	<main class="md:w-3/4 w-full bg-background px-12 py-8 font-body">
		<Hero />

		<AboutMe />

		<Projects />

		<!-- <BlogPosts /> -->
	</main>
</div>

<Footer />
