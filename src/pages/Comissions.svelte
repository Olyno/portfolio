<script>

    import { translations as _ } from '../stores';

</script>

<style>
    .ko-fi-button img {
        width: 400px;
    }
</style>

<div class="section">
    <h1 class="title is-secondary">{$_.comissions.title}</h1>
</div>

<div class="small-section">
    <div class="columns is-centered has-text-centered">
        <div class="column" data-aos="fade-up" data-aos-duration="2000">
            <h1 class="subtitle is-secondary">{$_.comissions.description}</h1>
            <a class="ko-fi-button" rel="noreferrer" target="_blank" href="https://ko-fi.com/olyno">
                <img src="/images/buymeakofi.png" alt="Ko-Fi Comission Button">
            </a>
        </div>
    </div>
</div>