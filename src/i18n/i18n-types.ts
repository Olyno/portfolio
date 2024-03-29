// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType
export type BaseLocale = 'en'

export type Locales =
	| 'en'
	| 'fr'

export type Translation = RootTranslation

export type Translations = RootTranslation

type RootTranslation = {
	navbar: {
		/**
		 * F​u​l​l​ ​S​t​a​c​k​ ​D​e​v​e​l​o​p​e​r
		 */
		job_title: string
		/**
		 * H​o​m​e
		 */
		home: string
		/**
		 * A​b​o​u​t​ ​m​e
		 */
		about_me: string
		/**
		 * P​r​o​j​e​c​t​s
		 */
		projects: string
		/**
		 * B​l​o​g
		 */
		blog: string
	}
	hero: {
		/**
		 * H​i​,​ ​I​'​m​ ​O​l​y​n​o
		 */
		title: string
		/**
		 * F​u​l​l​ ​S​t​a​c​k​ ​D​e​v​e​l​o​p​e​r​ ​&​ ​C​o​n​t​e​n​t​ ​M​a​n​a​g​e​r
		 */
		subtitle: string
		/**
		 * S​c​r​o​l​l​ ​d​o​w​n​ ​t​o​ ​s​e​e​ ​m​o​r​e
		 */
		scroll: string
	}
	about_me: {
		/**
		 * A​b​o​u​t​ ​m​e
		 */
		title: string
		/**
		 * I​ ​g​r​a​d​u​a​t​e​d​ ​i​n​ ​2​0​2​2​ ​w​i​t​h​ ​a​ ​B​a​c​h​e​l​o​r​ ​o​f​ ​W​e​b​ ​a​n​d​ ​M​o​b​i​l​e​ ​M​a​n​a​g​e​m​e​n​t​.​ ​O​u​t​s​i​d​e​ ​o​f​ ​m​y​ ​r​e​g​u​l​a​r​ ​w​o​r​k​,​ ​I​'​m​ ​a​ ​c​o​n​t​e​n​t​ ​m​a​n​a​g​e​r​ ​a​n​d​ ​a​ ​D​i​s​c​o​r​d​ ​m​o​d​e​r​a​t​o​r​ ​f​o​r​ ​t​h​e​ ​o​f​f​i​c​i​a​l​ ​P​r​i​s​m​a​ ​a​n​d​ ​S​u​p​a​b​a​s​e​ ​c​o​m​m​u​n​i​t​i​e​s​.​	​W​h​e​n​ ​I​'​m​ ​n​o​t​ ​w​o​r​k​i​n​g​ ​o​r​ ​m​o​d​e​r​a​t​i​n​g​,​ ​I​ ​c​o​n​t​r​i​b​u​t​e​ ​t​o​ ​o​p​e​n​-​s​o​u​r​c​e​ ​p​r​o​j​e​c​t​s​ ​o​n​ ​G​i​t​H​u​b​,​ ​w​o​r​k​ ​o​n​ ​m​y​ ​s​i​d​e​ ​p​r​o​j​e​c​t​s​,​ ​a​n​d​ ​o​c​c​a​s​i​o​n​a​l​l​y​ ​c​r​a​f​t​ ​s​o​m​e​ ​m​e​m​e​s​.
		 */
		content: string
	}
	projects: {
		/**
		 * P​r​o​j​e​c​t​s
		 */
		title: string
		/**
		 * M​a​i​n​ ​l​a​n​g​u​a​g​e
		 */
		main_languages: string
		/**
		 * S​e​e​ ​m​o​r​e​ ​o​n​ ​G​i​t​h​u​b
		 */
		see_more_button: string
		/**
		 * N​o​ ​d​e​s​c​r​i​p​t​i​o​n​ ​p​r​o​v​i​d​e​d​.
		 */
		no_description: string
		/**
		 * N​o​t​ ​s​p​e​c​i​f​i​e​d
		 */
		no_language: string
	}
	footer: {
		/**
		 * A​l​l​ ​r​i​g​h​t​s​ ​r​e​s​e​r​v​e​d​.​ ​C​o​n​n​e​c​t​ ​w​i​t​h​ ​m​e​ ​o​n​ ​G​i​t​H​u​b​ ​a​n​d​ ​T​w​i​t​t​e​r​.
		 */
		content: string
	}
}

export type TranslationFunctions = {
	navbar: {
		/**
		 * Full Stack Developer
		 */
		job_title: () => LocalizedString
		/**
		 * Home
		 */
		home: () => LocalizedString
		/**
		 * About me
		 */
		about_me: () => LocalizedString
		/**
		 * Projects
		 */
		projects: () => LocalizedString
		/**
		 * Blog
		 */
		blog: () => LocalizedString
	}
	hero: {
		/**
		 * Hi, I'm Olyno
		 */
		title: () => LocalizedString
		/**
		 * Full Stack Developer & Content Manager
		 */
		subtitle: () => LocalizedString
		/**
		 * Scroll down to see more
		 */
		scroll: () => LocalizedString
	}
	about_me: {
		/**
		 * About me
		 */
		title: () => LocalizedString
		/**
		 * I graduated in 2022 with a Bachelor of Web and Mobile Management. Outside of my regular work, I'm a content manager and a Discord moderator for the official Prisma and Supabase communities.	When I'm not working or moderating, I contribute to open-source projects on GitHub, work on my side projects, and occasionally craft some memes.
		 */
		content: () => LocalizedString
	}
	projects: {
		/**
		 * Projects
		 */
		title: () => LocalizedString
		/**
		 * Main language
		 */
		main_languages: () => LocalizedString
		/**
		 * See more on Github
		 */
		see_more_button: () => LocalizedString
		/**
		 * No description provided.
		 */
		no_description: () => LocalizedString
		/**
		 * Not specified
		 */
		no_language: () => LocalizedString
	}
	footer: {
		/**
		 * All rights reserved. Connect with me on GitHub and Twitter.
		 */
		content: () => LocalizedString
	}
}

export type Formatters = {}
