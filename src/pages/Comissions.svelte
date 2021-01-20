<script>

    import { translations as _ } from '../stores';

</script>

<style>
    .ko-fi-button img {
        width: 400px;
    }
</style>

<div class="section">
    <h1 class="title is-secondary" data-aos="slide-right" data-aos-duration="1000">{$_.comissions.title}</h1>
</div>

<div class="small-section">
    <div class="columns is-centered has-text-centered">
        <div class="column">
            <h1 class="subtitle is-secondary" data-aos="fade-up" data-aos-duration="2000">{$_.comissions.description}</h1>
            <a aria-label="{$_.links['ko-fi']}"
                data-aos="fade-up"
                data-aos-duration="2000"
                class="ko-fi-button"
                rel="noreferrer"
                target="_blank"
                href="https://ko-fi.com/olyno">
                <picture>
                    <source data-srcset="/images/logos/buymeakofi.avif" type="image/avif">
                    <source data-srcset="/images/logos/buymeakofi.webp" type="image/webp">
                    <img class="lazyload"
                        data-sizes="auto"
                        data-aos="fade-up"
                        data-aos-duration="2000"
                        data-src="/images/logos/buymeakofi.png"
                        alt="Ko-Fi Comission Button" />
                </picture>
            </a>
        </div>
    </div>
</div>