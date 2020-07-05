<script>

    import { onMount } from 'svelte';
    import { translations as _ } from '../stores';

    let shouldScroll = false;
    let scrolled = false;

    onMount(() => {
        document.addEventListener('scroll', () => {
            scrolled = true;
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

<div class="centered">
    <div class="columns">
        <div class="column is-narrow">
            <img class="avatar" src="/images/icons-pwa/icon-512x512.png" alt="Olyno Avatar">
        </div>
        <div class="column">
            <h1 class="title is-secondary" data-aos="slide-left" data-aos-duration="2000">{$_.about_me.welcome}</h1>
            <h1 class="subtitle is-secondary" data-aos="slide-left" data-aos-duration="2000" data-aos-delay="100">{$_.about_me.fast_description}</h1>
            <div class="level">
                <div class="level-left">
                    <a href="#contact"
                        class="button is-secondary-bg level-item"
                        data-aos="slide-left"
                        data-aos-duration="2000"
                        data-aos-delay="200">{$_.contact.title}</a>
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