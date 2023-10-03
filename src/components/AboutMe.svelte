<script>
	import LL from '$i18n/i18n-svelte';
</script>

<section id="about" class="mt-24">
	<h2 class="text-2xl mb-4">{$LL.about_me.title()}</h2>
	<p>
		{$LL.about_me.content()}
	</p>
</section>
