<script>

    import { onMount } from 'svelte';

    let mounted = false;
    let scrolled = false;

    onMount(() => {
        document.addEventListener('scroll', () => {
            scrolled = true;
        })
        setTimeout(() => {
            if (!scrolled) mounted = true;
        }, 1000 * 10) // 10 seconds
    })

</script>

<style>
    .avatar { width: 130px; }
</style>

<div class="centered">
    <div class="columns">
        <div class="column is-narrow">
            <img class="avatar" src="https://www.github.com/Olyno.png" alt="Olyno Avatar">
        </div>
        <div class="column">
            <h1 class="title is-secondary" data-aos="slide-left" data-aos-duration="2000">Hi, I'm Olyno</h1>
            <h1 class="subtitle is-secondary" data-aos="slide-left" data-aos-duration="2000" data-aos-delay="100">French Web developer, Freelancer</h1>
            <div class="level">
                <div class="level-left">
                    <a href="#contact" class="button is-secondary-bg level-item" data-aos="slide-left" data-aos-duration="2000" data-aos-delay="200">Contact me</a>
                    <a class:is-hidden={!mounted} href="#me" class="scrollButton level-item animated fadeIn" data-aos="slide-left" data-aos-duration="2000" data-aos-delay="200"><span></span></a>
                </div>
            </div>
        </div>
    </div>
</div>