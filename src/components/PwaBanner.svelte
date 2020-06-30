<script>

    let hiddingPwaBanner = window.localStorage.getItem('pwa_banner_visibility') || false;
    let pwa;

    async function downloadPwa() {
        event.prompt();
    }

    async function hidePwaBanner() {
        window.localStorage.setItem('pwa_banner_visibility', false);
        hidding = true;
    }

</script>

<style>
    .banner {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 50px;
    }
</style>

<svelte:window on:beforeinstallprompt|preventDefault={event => pwa = event} />

<div class="banner is-secondary-bg is-primary" class:is-hidden={hiddingPwaBanner}>
    <h1>My portfolio is available as PWA if your are interested!</h1>
    <div class="buttons">
        <button class="button is-primary" on:click={downloadPwa}>Download PWA</button>
        <button class="button" on:click={hidePwaBanner}>Close that</button>
    </div>
</div>