<script>

    import { language, languages } from '../../stores';

    import SelectButton from '../buttons/SelectButton.svelte';

    const languagesListItems = Object.keys(languages).map(lang =>
        [languages[lang].name.charAt(0).toUpperCase() + languages[lang].name.slice(1), lang]
    );

    async function changeLanguage(e) {
        $language = e.detail[1];
    }

</script>

<SelectButton
    items={languagesListItems}
    placeholder="Language"
    selectedItem={languagesListItems.filter(lang => lang[1] === $language)[0]}
    backgroundColor="#E5E8B6"
    on:selected={changeLanguage}
/>