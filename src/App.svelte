<script>

    import { Route } from 'tinro';
    import Sidebar from './components/Sidebar.svelte';
    import Home from './pages/Home.svelte';
    import Me from './pages/Me.svelte';
    import Projects from './pages/Projects.svelte';
    import Comissions from './pages/Comissions.svelte';
    import Contact from './pages/Contact.svelte';

    import Options from './components/Options.svelte';
    import Footer from './components/Footer.svelte';

</script>

<style>
    .big-padding {
        padding: 0 9rem;
    }
    .min-height {
        min-height: 100vh;
        min-width: 100vw;
    }
</style>

<Options />

<div class="columns">
    <div class="column is-1 is-secondary-bg is-sidebar is-hidden-mobile">
        <Sidebar />
    </div>
    <div class="min-height">
        <div class="column is-primary-bg is-hidden-touch big-padding">
            <Route path="/">
                <Home />
            </Route>
            <Route path="/me">
                <Me />
            </Route>
            <Route path="/projects">
                <Projects />
            </Route>
            <Route path="/comissions_and_donations">
                <Comissions />
            </Route>
            <Route path="/contact">
                <Contact />
            </Route>
            <Footer />
        </div>
        <div class="column is-primary-bg is-hidden-desktop">
            <Route path="/">
                <Home />
            </Route>
            <Route path="/me">
                <Me />
            </Route>
            <Route path="/projects">
                <Projects />
            </Route>
            <Route path="/comissions_and_donations">
                <Comissions />
            </Route>
            <Route path="/contact">
                <Contact />
            </Route>
            <Footer />
        </div>
    </div>
</div>