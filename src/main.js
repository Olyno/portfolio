import App from './App.svelte';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'animate.css/animate.min.css';
import 'bulma/css/bulma.min.css';

AOS.init({
	once: true
});

export default new App({
	target: document.body
});