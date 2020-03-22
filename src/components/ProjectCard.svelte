<script>

    import AnimatedButton from './AnimatedButton.svelte';

    export let project;

    let modalIsVisible = false;

    console.log(/https?/g.test(project.logo.link) ? project.logo.link : window.location.pathname + project.logo.link);

</script>

<style>
    .project-card {
        color: white;
        margin: auto;
        border-radius: 50px;
        background-color: #586994;
        /* box-shadow: 0px -15px 40px #4b597e, 15px 15px 40px #6579aa */
    }
    .project-card-icon {
        width: 25px;
        height: 25px;
    }
    .card-footer, .card-footer-item { 
        border: none !important;
    }
    /* .modal-card-head { border-bottom: none !important; } */
    .modal-card-foot { border-top: none !important; }
    .modal-content {
        color: white;
        overflow-wrap: break-word;
    }
    .is-rounded {
        border-radius: 50%;
    }
</style>

<div class="card project-card animate pulse">
    <div class="card-content">
        <div class="media">
            <div class="media-left">
                <figure class="image is-48x48">
                    <img
                        class:is-rounded={project.logo['is-rounded']}
                        src="{/https?/g.test(project.logo.link) ? project.logo.link : window.location.pathname}{project.logo.link}"
                        alt="Project Logo"
                    />
                </figure>
            </div>
            <div class="media-content">
                <p class="title is-4 is-secondary">{project.title}</p>
            </div>
        </div>
        <div class="content">
            <p>{project.description}</p>
        </div>
    </div>
    <footer class="card-footer">
        <div class="card-footer-item">
            <AnimatedButton animation="tada" on:click={() => modalIsVisible = true}>
                <i class="project-card-icon is-secondary fas fa-info-circle"></i>
            </AnimatedButton>
        </div>
        {#each project.links as link}
            <div class="card-footer-item">
                <AnimatedButton animation="tada" href="{link.link}">
                    {#if link.link_type === 'website'}
                        <i class="project-card-icon is-secondary fas fa-external-link-alt"></i>
                    {:else if link.link_type === 'github'}
                        <i class="project-card-icon is-secondary fab fa-github"></i>
                    {/if}
                </AnimatedButton>
            </div>
        {/each}
    </footer>
</div>

<div class="modal" class:is-active={modalIsVisible}>
    <div class="modal-background" on:click={() => modalIsVisible = false}></div>
    <div class="modal-card">
        <div class="modal-card-head is-primary-bg">
            <div class="modal-card-title">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <p class="is-secondary">Project {project.title}</p>
                        </div>
                        <div class="level-item">
                            <figure class="image is-32x32">
                                <img
                                    class:is-rounded={project.logo['is-rounded']}
                                    src="{/https?/g.test(project.logo.link) ? project.logo.link : window.location.pathname}{project.logo.link}"
                                    alt="Project Logo"
                                />
                            </figure>
                        </div>
                    </div>
                </div>
            </div>
            <button class="delete" on:click={() => modalIsVisible = false}></button>
        </div>
        <div class="modal-card-body is-primary-bg is-clipped">
            <div class="small-section modal-content">
                <h1 class="title is-secondary">Description</h1>
                <p>{project.description}</p>
            </div>
            <div class="small-section">
                <h2 class="subtitle is-secondary">Technologies used: <span class="modal-content">{project.technologies.join(', ')}</span></h2>
            </div>
        </div>
        <div class="modal-card-foot is-primary-bg">
            {#each project.links as link}
                <a class="button is-dark is-rounded" href="{link.link}">
                    {#if link.link_type === 'website'}
                        <i class="fas fa-external-link-alt is-icon"></i>
                    {:else if link.link_type === 'github'}
                        <i class="fab fa-github is-icon"></i>
                    {/if}
                </a>
            {/each}
        </div>
    </div>
</div>