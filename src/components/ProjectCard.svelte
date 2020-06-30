<script>

    import { onMount } from 'svelte';

    import AnimatedButton from './AnimatedButton.svelte';

    export let project;

</script>

<style>
    .project-card {
        color: white;
        margin: auto;
        border-radius: 10px;
        background-color: #586994;
        position: relative;
    }

    .actions-buttons {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 1rem;
        right: 1.5rem;
    }

    .card .card-content .content {
        width: 80%
    }
</style>

<div class="card project-card animate pulse">
    <div class="actions-buttons">
        <p><i class="is-secondary fas fa-eye"></i> {project.watchers_count}</p>
        <p><i class="is-secondary fas fa-star"></i> {project.stargazers_count}</p>
        <p><i class="is-secondary fas fa-code-branch"></i> {project.stargazers_count}</p>
    </div>
    <div class="card-content">
        <div class="media">
            <div class="media-content">
                <a class="title is-4 is-secondary isHoveringTitle" href="{project.html_url}">
                    {project.name}
                </a>
            </div>
        </div>
        <div class="content">
            <p>{project.description}</p>
        </div>
    </div>
</div>