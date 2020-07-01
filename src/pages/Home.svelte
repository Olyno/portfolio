<script>

    import { onMount } from 'svelte';

    function isInStandaloneMode() {
        return window.matchMedia('(display-mode: standalone)').matches 
            || window.navigator.standalone
            || document.referrer.includes('android-app://');
    }

    async function downloadPwa() {
        pwa.prompt();
    }

    let pwa;
    let shouldInstallPwaTime;

    let shouldScroll = false;
    let shouldInstallPwa = false;
    let scrolled = false;

    onMount(() => {
        document.addEventListener('scroll', () => {
            scrolled = true;
        })
        document.addEventListener('touchstart', () => {
            shouldInstallPwaTime = setTimeout(() => {
                shouldInstallPwa = true
            }, 1000 * 3);
        })
        document.addEventListener('touchend', () => {
            clearTimeout(shouldInstallPwaTime);
        })
        setTimeout(() => {
            if (!scrolled) shouldScroll = true;
        }, 1000 * 10) // 10 seconds
    })

</script>

<style>
    .avatar { width: 130px; }
    .installPwaButton {
        width: 100%;
        animation: installPwa 2s;
    }
    @keyframes installPwa {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>

<svelte:window on:beforeinstallprompt|preventDefault={event => pwa = event} />

<div class="centered">
    <div class="columns">
        <div class="column is-narrow">
            <img class="avatar" src="/images/icons-pwa/icon-512x512.png" alt="Olyno Avatar">
        </div>
        <div class="column">
            <h1 class="title is-secondary" data-aos="slide-left" data-aos-duration="2000">Hi, I'm Olyno</h1>
            <h1 class="subtitle is-secondary" data-aos="slide-left" data-aos-duration="2000" data-aos-delay="100">French Web developer, Freelancer</h1>
            <div class="level">
                <div class="level-left">
                    <a href="#contact"
                        class="button is-secondary-bg level-item"
                        data-aos="slide-left"
                        data-aos-duration="2000"
                        data-aos-delay="200">Contact me</a>
                    <button class:is-hidden={!shouldInstallPwa}
                        class="button installPwaButton is-primary level-item"
                        data-aos="slide-left"
                        data-aos-duration="2000"
                        data-aos-delay="300"
                        on:click={downloadPwa}
                        >Download the PWA</button>
                    <a class:is-hidden={!shouldScroll}
                        href="#me"
                        class="scrollButton level-item"
                        data-aos="slide-left"
                        data-aos-duration="2000"
                        data-aos-delay="200"><span></span></a>
                </div>
            </div>
        </div>
    </div>
</div>