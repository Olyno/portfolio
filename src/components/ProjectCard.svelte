<script>

    import { translations as _, defaultLanguage } from '../stores';

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

<div class="card project-card animate pulse" data-aos="fade-up" data-aos-duration="2000">
    <div class="actions-buttons">
        <p><i class="is-secondary fas fa-eye"></i> {project.watchers_count}</p>
        <p><i class="is-secondary fas fa-star"></i> {project.stargazers_count}</p>
        <p><i class="is-secondary fas fa-code-branch"></i> {project.stargazers_count}</p>
    </div>
    <div class="card-content">
        <div class="media">
            <div class="media-content">
                <a aria-label="{$_.links.project}" class="title is-4 is-secondary isHoveringTitle" href="{project.html_url}">
                    {project.name}
                </a>
                <i>{project.language}</i>
            </div>
        </div>
        <div class="content">
            <i>{$_.projects.since} {new Date(project.created_at).toLocaleDateString(defaultLanguage.toLowerCase() + '-' + defaultLanguage.toUpperCase())}</i>
            <br /><br />
            <p>{project.description}</p>
        </div>
    </div>
</div>