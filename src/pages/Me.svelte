<script>

    import { stacks } from '../data';

    import AnimatedButton from '../components/AnimatedButton.svelte';

    const isHover = {};

</script>

<style>
    .stack-card {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: auto;
        width: 60px;
        height: 60px;
        border-radius: 10px;
        background: #586994;
        box-shadow: 6px 6px 12px #4b597e, -6px -6px 12px #6579aa;
    }
    .stack-card-icon {
        width: 30px;
        height: 30px;
    }
</style>

<div class="section">
    <h1 class="title is-secondary">Who am I?</h1>
</div>

<div class="small-section">
    <div class="columns">

        <div class="column is-5">
            <div class="small-section">
                <div class="columns is-mobile is-multiline is-centered">
                    {#each stacks as stack, id}
                        <div class="column is-3" data-aos="slide-up" data-aos-duration="2000" data-aos-delay="{id}50">
                            <div 
                                class="stack-card contact-card animated"
                                class:jello={isHover[id]}
                                on:mouseenter={() => isHover[id] = true}
                                on:mouseleave={() => isHover[id] = false}
                            >
                                {#if stack.icon}
                                    <i class="stack-card-icon is-secondary {stack.icon}"></i>
                                {:else}
                                    <img class="stack-card-icon" src="{stack.image}" alt="Stack Icon">
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