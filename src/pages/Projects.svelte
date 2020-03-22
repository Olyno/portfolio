<script>

    import { projects } from '../data';

    import ProjectCard from '../components/ProjectCard.svelte';

</script>

<div class="section">
    <h1 class="title is-secondary">My Projects</h1>
</div>

<div class="section">
    <div class="columns is-multiline is-centered">
        {#each projects as project, id}
            <div class="column is-4" data-aos="fade-down" data-aos-duration="2000" data-aos-delay="{id}50">
                <ProjectCard {project} /> 
            </div>
        {/each}
        <div class="column is-4 has-text-centered is-vcentered" data-aos="fade-down" data-aos-duration="2000" data-aos-delay="250">
            <a href="https://www.github.com/Olyno" class="is-secondary-bg button animate pulse">See more projects</a>
        </div>
    </div>
</div>