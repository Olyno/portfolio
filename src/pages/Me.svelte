<script>

    import { stacks } from '../data';

    import AnimatedButton from '../components/AnimatedButton.svelte';

</script>

<style>
    .stack-icon {
        width: 100px;
        height: 60px;
    }
</style>

<div class="section">
    <h1 class="title is-secondary">About me</h1>
</div>

<div class="small-section">
    <div class="columns">

        <div class="column is-5">
            <div class="small-section">
                <div class="columns is-mobile is-multiline is-centered">
                    {#each stacks as stack, id}
                        <div class="column is-3" data-aos="slide-up" data-aos-duration="2000" data-aos-delay="{id}50">
                            <div class="contact-card">
                                {#if stack.icon}
                                    <i class="stack-icon is-secondary {stack.icon}"></i>
                                {:else}
                                    <img class="stack-icon" src="{window.location.pathname}{stack.image}" alt="Stack Icon">
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <div class="column">
            <div class="small-section">
                <p class="is-secondary" data-aos="slide-left" data-aos-duration="1500">
                    From my real first name Leo, but from my username Olyno, I'm a young French developer.<br>
                    Specialized in frontend, I'm still able to be full stack. I master SvelteJs and ReactJS for the frontend, and NodeJs for the backend.<br>
                </p>
            </div>
        </div>

    </div>
</div>