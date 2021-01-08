<script>

    import axios from 'axios';
    import { translations as _ } from '../stores';

    import ProjectCard from '../components/ProjectCard.svelte';

    const languageOrder = [
        'typescript',
        'javascript',
        'html',
        'java',
        'dart',
        'php'
    ].reverse();

    const forgotProjects = [
        "coq-francais",
        "repro-rollup-issue",
        "javascript_courses",
        "datsocialmedia",
        "portfolio"
    ]

    const projectsFilter = axios.get('https://api.github.com/users/Olyno/repos')
        .then(({ data: repositories }) => {
            const filteredRepositories = repositories
                .filter(repository => repository.language !== null && !forgotProjects.includes(repository.name) && !repository.fork)
                .sort((a, b) => {
                    const languageA = a.language.toLowerCase();
                    const languageB = b.language.toLowerCase();
                    if (languageOrder.includes(languageA) && languageOrder.includes(languageB)) {
                        return languageOrder.indexOf(languageB) - languageOrder.indexOf(languageA);
                    } else {
                        return languageOrder.includes(languageB) ? 1 : -1;
                    }
                })
            window.localStorage.setItem('repositories', JSON.stringify(filteredRepositories));
            return filteredRepositories;
        }).catch(err => {
            return JSON.parse(window.localStorage.getItem('repositories')) || [];
        })

</script>

<div class="section">
    <h1 class="title is-secondary" data-aos="slide-right" data-aos-duration="1000">{$_.projects.title}</h1>
</div>

<div class="section">
    <div class="columns is-multiline is-centered">
        {#await projectsFilter}
            <h1 class="subtitle is-secondary">{$_.projects.loading}</h1>
        {:then projects}
            {#each projects as project, id}
                <div class="column is-4">
                    <ProjectCard {project} /> 
                </div>
            {/each}
        {/await}
        <div class="column is-4 has-text-centered is-vcentered">
            <a rel="noreferrer"
                data-aos="fade-up"
                data-aos-duration="2000"
                aria-label="{$_.links.github}"
                href="https://www.github.com/Olyno"
                class="is-secondary-bg button">{$_.projects.see_more}</a>
        </div>
    </div>
</div>