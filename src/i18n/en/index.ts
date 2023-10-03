import type { BaseTranslation } from '../i18n-types';

const en = {
	navbar: {
		job_title: 'Full Stack Developer',
		home: 'Home',
		about_me: 'About me',
		projects: 'Projects',
		blog: 'Blog'
	},
	hero: {
		title: "Hi, I'm Olyno",
		subtitle: 'Full Stack Developer & Content Manager',
		scroll: 'Scroll down to see more'
	},
	about_me: {
		title: 'About me',
		content:
			"I graduated in 2022 with a Bachelor of Web and Mobile Management. Outside of my regular work, I'm a content manager and a Discord moderator for the official Prisma and Supabase communities.	When I'm not working or moderating, I contribute to open-source projects on GitHub, work on my side projects, and occasionally craft some memes."
	},
	projects: {
		title: 'Projects',
		main_languages: 'Main language',
		see_more_button: 'See more on Github',
		no_description: 'No description provided.',
		no_language: 'Not specified'
	},
	footer: {
		content: 'All rights reserved. Connect with me on GitHub and Twitter.'
	}
} satisfies BaseTranslation;

export default en;
