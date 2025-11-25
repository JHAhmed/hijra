import { goto } from '$app/navigation';
import { account } from '$lib/appwrite';

// function createAuthStore() {
// 	let user = $state(null);
// 	let isLoading = $state(true);
// 	let isAdmin = $derived(user?.labels?.[0] === 'admin');
// 	let isAuthenticated = $derived(user !== null);

// 	async function init() {
// 		try {
// 			const currentUser = await account.get();
// 			user = currentUser;
// 		} catch (error) {
// 			user = null;
// 		} finally {
// 			isLoading = false;
// 		}
// 	}

// 	async function register(email, password, name) {
// 		await account.create(ID.unique(), email, password, name);
// 		await login(email, password);
// 	}

// 	async function login(email, password) {
// 		await account.createEmailPasswordSession(email, password);
// 		user = await account.get();
// 		goto('/');
// 	}

// 	async function logout() {
// 		await account.deleteSession('current');
// 		user = null;
// 		goto('/');
// 	}

// 	return {
// 		get user() {
// 			return user;
// 		},
// 		get isLoading() {
// 			return isLoading;
// 		},
// 		get isAuthenticated() {
// 			return isAuthenticated;
// 		},
// 		get isAdmin() {
// 			return isAdmin;
// 		},
// 		init,
// 		login,
// 		logout
// 	};
// }

// export const authStore = createAuthStore();


function createAuthStore() {
    let user = $state(null);
    let isLoading = $state(true);
    let isAuthenticated = $derived(user !== null);
	let isAdmin = $derived(user?.labels?.includes('admin') || false);
    // Initialize from server-provided data
    function initFromServer(serverUser) {
        user = serverUser;
        isLoading = false;
    }

    // Update user after login (will be set by form action redirect)
    function setUser(newUser) {
        user = newUser;
    }

    // Clear user on logout
    function clearUser() {
        user = null;
    }

    return {
        get user() { return user; },
        get isLoading() { return isLoading; },
        get isAuthenticated() { return isAuthenticated; },
		get isAdmin() { return isAdmin; },
        initFromServer,
        setUser,
        clearUser
    };
}

export const authStore = createAuthStore();
