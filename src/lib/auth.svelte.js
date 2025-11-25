import { goto, invalidateAll } from '$app/navigation';
import { account, ID } from '$lib/appwrite'; // Your Appwrite client setup
import { redirect } from '@sveltejs/kit';

// Create a reactive auth state
class AuthStore {
	user = $state(null);
    isLoading = $state(true);
	
	// Derived value for easy checking
	isAdmin = $derived(this.user?.labels?.[0] === 'admin');
	isLoggedIn = $derived(this.user !== null);

	constructor() {
		// Auto-initialize on client
		if (typeof window !== 'undefined') {
			this.init();
		}
	}

	async init() {
		this.isLoading = true;
		try {
			const user = await account.get();
			this.user = user;
		} catch (error) {
			this.user = null;
		} finally {
			this.isLoading = false;
		}
	}

	async register(email, password, name) {
		try {
			await account.create(ID.unique(), email, password, name);
			await this.login(email, password); 
		} catch (error) {
			this.user = null;
			console.error('Login error:', error);
			throw error;
		}
	}

	async login(email, password) {
		try {
			await account.createEmailPasswordSession(email, password);
			await this.init(); 
            goto('/');
		} catch (error) {
			this.user = null;
			console.error('Login error:', error);
			throw error;
		}
	}

	async logout() {
		try {
			await account.deleteSession('current');
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			this.user = null;
            goto('/');
		}
	}
}

export const auth = new AuthStore();