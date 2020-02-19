<script>

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let clazz = '';
    let isHover = false;

    export let animation = 'jello';
    export let href;
    export let isBlank = true;
    export { clazz as class };

</script>

<style>
    .button {
        background-color: transparent;
        border-style: none;
    }
</style>

{#if href}
    <a 
        {href}
        target={isBlank ? "_blank" : ""}
        class="{clazz} {isHover ? animation : ''} animated button"
        on:mouseenter={() => isHover = true}
        on:mouseleave={() => isHover = false}
        on:click={() => dispatch('click')}
    >
        <slot></slot>
    </a>
{:else}
    <button
        class="{clazz} {isHover ? animation : ''} animated button"
        on:mouseenter={() => isHover = true}
        on:mouseleave={() => isHover = false}
        on:click={() => dispatch('click')}
    >
        <slot></slot>
    </button>
{/if}

