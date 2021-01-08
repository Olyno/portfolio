import App from './App.svelte';
import 'lazysizes';
import 'bulma/css/bulma.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init();

export default new App({
	target: document.body
});