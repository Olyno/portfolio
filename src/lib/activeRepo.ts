import { writable } from 'svelte/store';

/** Repo currently highlighted (hovered card ↔ hovered 3D orb, bidirectional). */
export const activeRepo = writable<string | null>(null);
