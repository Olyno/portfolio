<script lang="ts">
	import { page } from '$app/stores';
	import LL from '$i18n/i18n-svelte';

	const repositories: any[] = $page.data.repositories;
</script>

<section id="projects" class="mt-24">
	<h2 class="text-2xl mb-8">{$LL.projects.title()}</h2>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each repositories.slice(0, 6) as repository, index}
			<div
				class="p-4 border border-primary rounded-md"
				data-aos="fade-up"
				data-aos-delay={index * 100}
			>
				<h3 class="text-xl mb-2">{repository.name}</h3>
				<p class="h-20 overflow-y-auto">
					{repository.description || $LL.projects.no_description()}
				</p>
				<p class="mt-4 text-secondary">
					{$LL.projects.main_languages()}: {repository.language || $LL.projects.no_language()}
				</p>
			</div>
		{/each}
	</div>

	<!-- See more button -->
	<div class="mt-6 text-center">
		<a
			href="https://github.com/Olyno?tab=repositories"
			target="_blank"
			data-aos="fade-up"
			data-aos-delay="600"
			class="bg-primary text-highlight px-6 py-2 rounded-md hover:bg-secondary"
		>
			{$LL.projects.see_more_button()}
		</a>
	</div>
</section>
