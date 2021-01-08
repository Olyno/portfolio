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
</style>

<div class="centered">
    <div class="columns">
        <div class="column is-narrow">
            <picture class="avatar" data-aos="fade-right" data-aos-duration="2000">
                <source data-srcset="/images/icons-pwa/icon-152x152.avif" type="image/avif">
                <source data-srcset="/images/icons-pwa/icon-152x152.webp" type="image/webp">
                <img class="lazyload" data-sizes="auto" data-src="/images/icons-pwa/icon-152x152.png" alt="Olyno Avatar">
            </picture>
        </div>
        <div class="column">
            <h1 class="title is-secondary" data-aos="fade-left" data-aos-duration="2000">{$_.about_me.welcome}</h1>
            <h1 class="subtitle is-secondary" data-aos="fade-left" data-aos-duration="2000">{$_.about_me.fast_description}</h1>
            <div class="level">
                <div class="level-left">
                    <a aria-label="{$_.contact.title}" href="#contact"
                        class="button is-secondary-bg level-item"
                        data-aos="fade-left"
                        data-aos-duration="2000"
                       >{$_.contact.title}</a>
                    <a aria-label="{$_.about_me.button}" class:is-hidden={!shouldScroll}
                        href="#me"
                        data-aos="fade-left"
                        data-aos-duration="2000"
                        class="scrollButton level-item"
                       ><span></span></a>
                </div>
            </div>
        </div>
    </div>
</div>