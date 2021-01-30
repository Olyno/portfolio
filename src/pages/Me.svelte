<script>

    import { stacks } from '../data';
    import { translations as _ } from '../stores';

</script>

<style>
    .stack-icon {
        width: 50%;
        height: 50%;
    }
    .description-text {
        font-size: 18px;
    }
</style>

<div class="section">
    <h1 class="title is-secondary" data-aos="slide-right" data-aos-duration="1000">{$_.about_me.title}</h1>
</div>

<div class="small-section">
    <div class="columns">

        <div class="column is-5">
            <div class="small-section">
                <div class="columns is-mobile is-multiline is-centered">
                    {#each stacks as stack, id}
                        <div class="column is-4">
                            <div data-aos="fade-up" data-aos-duration="2000" data-aos-delay="{id}00">
                                {#if stack.icon}
                                    <i class="stack-icon is-secondary {stack.icon}"></i>
                                {:else}
                                    <img class="stack-icon lazyload"
                                        data-sizes="auto"
                                        data-src="/{stack.image}"
                                        alt="Stack Icon">
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <div class="column">
            <div class="small-section">
                <p class="is-secondary description-text" data-aos="fade-up" data-aos-duration="2000">
                    {@html $_.about_me.description.replace(/\n/g, '<br>')}
                </p>
            </div>
        </div>

    </div>
</div>