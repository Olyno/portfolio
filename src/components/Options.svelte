<script>

    import { onMount } from 'svelte';
    import { language, translations as _ } from '../stores';

    import Language from './options/Language.svelte';

    function isInStandaloneMode() {
        return window.matchMedia('(display-mode: standalone)').matches 
            || window.navigator.standalone
            || document.referrer.includes('android-app://');
    }

    async function showOptionsList() {
        showOptions = !showOptions;
        if (!showOptions) {
            selectedOption = null;
        }
    }

    async function downloadPwa() {
        pwa.prompt();
    }

    let showOptions = false;
    let selectedOption = null;
    
    let pwa;
    let shouldInstallPwaTime;
    let shouldInstallPwa = false;

    onMount(() => {
        document.addEventListener('touchstart', () => {
            shouldInstallPwaTime = setTimeout(() => {
                shouldInstallPwa = true
            }, 1000 * 3);
        })
        document.addEventListener('touchend', () => {
            clearTimeout(shouldInstallPwaTime);
        })
    })

</script>

<style>
    .options {
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        z-index: 3;
    }
    button {
        position: relative;
        width: 50px;
        height: 50px;
        border-style: none;
        cursor: pointer;
        border-radius: 50%;
        outline: none;
    }
    button:hover {
        filter: brightness(90%);
    }
    .optionsList {
        position: absolute;
        right: 4rem;
        bottom: 0;
    }
    .optionsList button {
        margin-top: 1rem;
    }
    .optionsList .optionIcon {
        width: 20px;
        height: 20px;
    }
    .optionsSelect {
        position: absolute;
        right: 8rem;
        bottom: 0;
    }
</style>

<svelte:window on:beforeinstallprompt|preventDefault={event => pwa = event} />

<div class="options">
    <button aria-label="{$_.options.title}" class="is-secondary-bg" on:click={showOptionsList}>
        <i class="is-primary fas fa-cogs"></i>
    </button>
    <div class="optionsList" class:is-hidden={!showOptions}>
        <button aria-label="{$_.options.language}" class="is-secondary-bg is-primary" on:click={() => selectedOption = 'language'}>
            <i class="optionIcon fas fa-comment-dots"></i>
        </button>
        <button aria-label="{$_.contact.pwa}" class="is-secondary-bg is-primary" class:is-hidden={!shouldInstallPwa} on:click={downloadPwa}>
            <i class="fas fa-download"></i>
        </button>
    </div>
    <div class="optionsSelect" class:is-hidden={selectedOption === null}>
        <div class:is-hidden={selectedOption && selectedOption !== 'language'}>
            <Language />
        </div>
    </div>
</div>