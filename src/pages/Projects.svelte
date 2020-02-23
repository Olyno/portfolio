<script>

    import { projects } from '../data';

    import ProjectCard from '../components/ProjectCard.svelte';
    import AnimatedButton from '../components/AnimatedButton.svelte';

</script>

<div class="section">
    <h1 class="title is-secondary">My Projects</h1>
</div>

<div class="section">
    <div class="columns is-multiline is-centered is-vcentered">
        {#each projects as project, id}
            <div class="column is-4" data-aos="fade-down" data-aos-duration="2000" data-aos-delay="{id}50">
                <ProjectCard {project} /> 
            </div>
        {/each}
        <div class="column is-4 has-text-centered" data-aos="fade-down" data-aos-duration="2000" data-aos-delay="250">
            <AnimatedButton href="https://www.github.com/Olyno" class="is-secondary-bg" animation="pulse">
                See more projects
            </AnimatedButton>
        </div>
    </div>
</div>