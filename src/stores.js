import { writable } from 'svelte/store';

// Languages

import englishLanguage from '../public/locale/en.json';
import frenchLanguage from '../public/locale/fr.json';

export let defaultLanguage = window.navigator.languages ? window.navigator.languages[0] : null;
defaultLanguage = window.localStorage.getItem('language')
    || defaultLanguage
    || window.navigator.language
    || window.navigator.browserLanguage
    || window.navigator.userLanguage
    || 'en';

if (defaultLanguage.indexOf('-') !== -1) {
    defaultLanguage = defaultLanguage.split('-')[0];
}

if (defaultLanguage.indexOf('_') !== -1) {
    defaultLanguage = defaultLanguage.split('_')[0];
}

export const languages = {
    en: {
        name: 'english',
        translations: englishLanguage
    },
    fr: {
        name: 'français',
        translations: frenchLanguage
    }
};

export const translations = writable(languages[defaultLanguage].translations);
export const language = writable(defaultLanguage);

language.subscribe(newLanguage => {
    window.localStorage.setItem('language', newLanguage);
    translations.update(v => languages[newLanguage].translations);
    return newLanguage;
})