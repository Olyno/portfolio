import App from './App.svelte';
import AOS from 'aos';
import './global.styl';
import 'aos/dist/aos.css';
import 'animate.css/animate.min.css';
import 'bulma/css/bulma.min.css';

AOS.init();

export default new App({
	target: document.body
});