import type { Translation } from '../i18n-types';

const fr = {
	navbar: {
		job_title: 'Développeur Full Stack',
		home: 'Accueil',
		about_me: 'A propos de moi',
		projects: 'Projets',
		blog: 'Blog'
	},
	hero: {
		title: "Bonjour, je m'appelle Olyno",
		subtitle: 'Développeur Full Stack & Content Manager',
		scroll: 'Scroller plus bas pour voir plus'
	},
	about_me: {
		title: 'A propos de moi',
		content:
			"J'ai obtenu en 2022 un Bachelor of Web and Mobile Management. En dehors de mon travail régulier, je suis gestionnaire de contenu et modérateur Discord pour les communautés officielles Prisma et Supabase.	Lorsque je ne travaille pas ou que je ne suis pas modérateur, je contribue à des projets open-source sur GitHub, je travaille sur mes projets secondaires et je crée occasionnellement des mèmes."
	},
	projects: {
		title: 'Projets',
		main_languages: 'Principal langage',
		see_more_button: 'Voir plus sur GitHub',
		no_description: 'Pas de description disponible.',
		no_language: 'Non spécifié'
	},
	footer: {
		content: 'Tous droits réservés. Retrouvez-moi sur GitHub et Twitter.'
	}
} satisfies Translation;

export default fr;
