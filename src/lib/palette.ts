import { writable } from 'svelte/store';

/** Global command-palette open state (⌘K / Ctrl+K / click). */
export const paletteOpen = writable(false);
