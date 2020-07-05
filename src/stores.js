import { writable } from 'svelte/store';

// Languages

import englishLanguage from '../public/locale/en.json';
import frenchLanguage from '../public/locale/fr-FR.json';

const defaultLanguage = window.localStorage.getItem('language') || navigator.language || navigator.userLanguage;

export const languages = {
    en: {
        name: 'english',
        translations: englishLanguage
    },
    'fr-FR': {
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