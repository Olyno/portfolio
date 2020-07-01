<script>

    import Sidebar from './components/Sidebar.svelte';
    import Home from './pages/Home.svelte';
    import Me from './pages/Me.svelte';
    import Projects from './pages/Projects.svelte';
    import Comissions from './pages/Comissions.svelte';
    import Contact from './pages/Contact.svelte';

    import Footer from './components/Footer.svelte';

</script>

<div class="columns">
    <div class="column is-1 is-secondary-bg is-sidebar is-hidden-mobile">
        <Sidebar />
    </div>
    <div class="column is-primary-bg">
        <div id="home">
            <Home />
        </div>
        <div id="me">
            <Me />
        </div>
        <div id="projects">
            <Projects />
        </div>
        <div id="comissions_and_donations">
            <Comissions />
        </div>
        <div id="contact">
            <Contact />
        </div>
        <Footer />
    </div>
</div>