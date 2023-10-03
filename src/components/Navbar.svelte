<script>
	import LL from '$i18n/i18n-svelte';
</script>

<nav
	class="sticky top-0 w-1/4 bg-primary text-highlight p-6 h-screen overflow-y-auto hidden md:block"
>
	<div class="mb-12">
		<img
			data-src="https://github.com/Olyno.png"
			alt="Olyno's Avatar"
			class="lazyload rounded-full w-32 h-32 mb-4"
		/>
		<h3 class="text-xl">Olyno</h3>
		<p class="text-base">{$LL.navbar.job_title()}</p>
	</div>

	<div class="flex flex-col space-y-8">
		<!-- Placeholder icons, replace with actual icons -->
		<a href="#home" class="hover:text-secondary transition-colors duration-300"
			><i class="icon-home" /> {$LL.navbar.home()}</a
		>
		<a href="#about" class="hover:text-secondary transition-colors duration-300"
			><i class="icon-about" /> {$LL.navbar.about_me()}</a
		>
		<a href="#projects" class="hover:text-secondary transition-colors duration-300"
			><i class="icon-projects" /> {$LL.navbar.projects()}</a
		>
		<!-- <a
    href="#blog"
    class="hover:text-secondary transition-colors duration-300"
    ><i class="icon-blog"></i> {$LL.navbar.blog()}</a
  > -->
	</div>
</nav>
