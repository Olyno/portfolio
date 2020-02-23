<script>

    import AnimatedButton from './AnimatedButton.svelte';

    let visible = false;

</script>

<style>

    .sidebar, .burger { position: fixed; }
    .sidebar, .sidebar * { display: flex; flex-direction: column; }

    .burger {
        z-index: 1;
        margin-left: 4.5%;
        margin-top: 3%;
        background-color: transparent;
        transition-property: margin-left;
        transition-duration: 1s;
    }

    /* 40% mobile view */
    .sidebar {
        z-index: 1;
        justify-content: space-around;
        background-color: #E5E8B6;
        width: inherit !important;
        height: 100vh;
        outline: none;
    }

    .sidebar-link {
        padding-top: 20px;
        padding-left: 10px;
    }

    .sidebar-icon {
        width: 30px;
        height: 30px;
    }

</style>

<div class="sidebar is-flex has-text-centered animated slideInLeft" class:is-hidden-mobile={!visible}>
    <div class="sidebar-header"></div>
    <div class="sidebar-content">
        <div class="sidebar-link">
            <AnimatedButton href="#home" animation="flip" isBlank={false}>
                <i class="sidebar-icon is-primary fas fa-home"></i>
            </AnimatedButton>
        </div>
        <div class="sidebar-link">
            <AnimatedButton href="#me" animation="flip" isBlank={false}>
                <i class="sidebar-icon is-primary fas fa-user"></i>
            </AnimatedButton>
        </div>
        <div class="sidebar-link">
            <AnimatedButton href="#projects" animation="flip" isBlank={false}>
                <i class="sidebar-icon is-primary fas fa-folder"></i>
            </AnimatedButton>
        </div>
        <div class="sidebar-link">
            <AnimatedButton href="#contact" animation="flip" isBlank={false}>
                <i class="sidebar-icon is-primary fas fa-phone"></i>
            </AnimatedButton>
        </div>
    </div>
    <div class="sidebar-footer"></div>
</div>

<button class="button is-primary-bg burger is-hidden-tablet" on:click={() => visible = !visible}>
    <span class="icon">
        <i class="fas fa-bars sidebar-icon"></i>
    </span>
</button>