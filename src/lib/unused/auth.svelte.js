// auth.store.js
import { browser } from '$app/environment';
import { account } from '$lib/appwrite';

function createAuthStore() {
	let user = $state(null);
	let isLoading = $state(true);
	
	const isAdmin = $derived(user?.labels?.[0] === 'admin');
	const isLoggedIn = $derived(user !== null);
	
	async function init() {
		if (!browser) return;
		
		isLoading = true;
		try {
			user = await account.get();
		} catch {
			user = null;
		} finally {
			isLoading = false;
		}
	}
	
	// Initialize immediately
	init();
	
	return {
		get user() { return user; },
		get isLoading() { return isLoading; },
		get isAdmin() { return isAdmin; },
		get isLoggedIn() { return isLoggedIn; },
		init,
		// ... login, logout methods
	};
}

export const auth = createAuthStore();