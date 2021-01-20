import App from './App.svelte';
import 'lazysizes';
import AOS from 'aos';

import 'bulma/css/bulma.min.css';
import 'aos/dist/aos.css';
import './styles/global.styl';
import './styles/fixes.styl';
import './styles/animations.styl';

AOS.init();

export default new App({
	target: document.body
});