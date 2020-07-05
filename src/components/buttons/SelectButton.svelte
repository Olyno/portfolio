<script>

    import { onMount, createEventDispatcher } from 'svelte';

    export let direction = 'top';
    export let withIcon;
    export let iconPosition = 'left';
    export let iconColor;
    export let placeholder;
    export let backgroundColor = 'white';
    export let fontSize = 14;
    export let items = [''];
    export let selectedItem;

    let fieldsElement;
    let selectButtonElement;
    let placeholderElement;

    const dispatch = createEventDispatcher();

    async function openSelect() {
        fieldsElement.classList.remove('hideFields');
        if (placeholderElement) {
            placeholderElement.style.top = '-10px';
            placeholderElement.style.left = '15px';
            placeholderElement.style.fontSize = (fontSize / 1.1) + 'px';
            placeholderElement.style.position = 'absolute';
        }
    }

    async function closeSelect() {
        if (!fieldsElement.classList.contains('hideFields')) {
            fieldsElement.classList.add('hideFields');
        }
        if (placeholderElement && !selectedItem) {
            placeholderElement.style.top = '';
            placeholderElement.style.left = '';
            placeholderElement.style.fontSize = '';
            placeholderElement.style.position = '';
        }
    }

    async function toggleSelect() {
        if (fieldsElement.classList.contains('hideFields')) {
            openSelect();
        } else {
            closeSelect();
        }
    }

    async function selectItem(item) {
        selectedItem = item;
        closeSelect();
        dispatch('selected', item);
    }

    onMount(() => {
        placeholderElement = selectButtonElement.querySelector('p.placeholder');
        if (placeholderElement && selectItem) {
            placeholderElement.style.top = '-10px';
            placeholderElement.style.left = '15px';
            placeholderElement.style.fontSize = (fontSize / 1.1) + 'px';
            placeholderElement.style.position = 'absolute';
        }
    })

</script>

<style>
    :root {
        --select-button-border-radius: 10px
    }
    .fields, .select-button {
        position: relative;
        width: 10rem;
        border-radius: var(--select-button-border-radius);
    }
    .fields {
        z-index: 3;
        -webkit-box-shadow: 0px 10px 29px -15px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 10px 29px -15px rgba(0,0,0,0.75);
        box-shadow: 0px 10px 29px -15px rgba(0,0,0,0.75);
    }
    .fields div {
        cursor: pointer;
        padding: 15px 20px;
    }
    .fields div:first-child {
       border-top-left-radius: var(--select-button-border-radius);
       border-top-right-radius: var(--select-button-border-radius);
    }
    .fields div:last-child {
       border-bottom-left-radius: var(--select-button-border-radius);
       border-bottom-right-radius: var(--select-button-border-radius);
    }
    .fields div:hover {
        background-color: #F6F6F6F6;
    }
    .fields div p {
        cursor: pointer;
    }
    .select-button {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 16px 15px;
        border: solid gray 2px;
    }
    .select-button p {
        cursor: pointer;
    }
    .select-button:hover {
        border-color: black;
    }
    .select-button:focus {
        border-color: red;
    }
    .hideFields {
        display: none;
    }
    .placeholder {
        padding: 0 10px;
        transition: top 1s, left 1s;
    }
    .selectIcon {
        width: 20px;
        height: 20px;
    }
</style>

<div class="fields hideFields" style="background-color: {backgroundColor}" bind:this={fieldsElement}>
    {#each items as item}
        <div style="margin-{direction}: 1rem" on:click={() => selectItem(item)}>
            <p style="font-size: {fontSize}px">{item instanceof Array ? item[0] : item}</p>
        </div>
    {/each}
</div>

<div class="select-button" style="background-color: {backgroundColor}" on:click={toggleSelect} bind:this={selectButtonElement}>
    {#if withIcon && iconPosition.toLowerCase() === 'left'}
        <div class="selectIcon">
            <i style="color: {iconColor}" class="{withIcon}"></i>
        </div>
    {/if}
    {#if placeholder}
        <p class="placeholder" style="font-size: {fontSize}px; background-color: {backgroundColor}">{placeholder}</p>
    {/if}
    {#if selectedItem}
        <p style="font-size: {fontSize}px">{selectedItem instanceof Array ? selectedItem[0] : selectedItem}</p>
    {/if}
    {#if withIcon && iconPosition.toLowerCase() === 'right'}
        <div class="selectIcon">
            <i style="color: {iconColor}" class="{withIcon}"></i>
        </div>
    {/if}
</div>