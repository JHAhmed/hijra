import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { redirect } from '@sveltejs/kit';
import { authStore } from '$lib/auth.svelte';

/**
 * @param {string} [redirectTo='/auth'] - The path to redirect to if the user is not logged in.
 */
export function requireAuth(redirectTo = '/auth') {
	if (!authStore.isAuthenticated) {
		throw redirect(303, redirectTo);
	}
}

/**
 * @param {string} [redirectTo='/'] - The path to redirect to if the user is logged in.
 */
export function requireGuest(redirectTo = '/') {
	if (authStore.isAuthenticated) {
		throw redirect(303, redirectTo);
	}
}

/**
 * @param {...(string | null | undefined | {[key: string]: boolean} | any[])} inputs - The class inputs.
 * @returns {string} The merged and optimized class string.
 */
export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

/**
 * @param {string} s - The input string.
 * @returns {string} The string converted to title case.
 */
export function toTitleCase(s) {
	return s
		.toLowerCase()
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}
