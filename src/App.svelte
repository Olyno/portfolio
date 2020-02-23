<script>

    import Sidebar from './components/Sidebar.svelte';
    import Home from './pages/Home.svelte';
    import Me from './pages/Me.svelte';
    import Projects from './pages/Projects.svelte';
    import Contact from './pages/Contact.svelte';

</script>

<div class="columns">
    <div class="column is-1">
        <Sidebar />
    </div>
    <div class="column">
        <div id="home">
            <Home />
        </div>
        <div id="me">
            <Me />
        </div>
        <div id="projects">
            <Projects />
        </div>
        <div id="contact">
            <Contact />
        </div>
    </div>
</div>

<div class="section">

</div>