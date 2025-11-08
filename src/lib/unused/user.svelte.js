import { goto, invalidateAll } from '$app/navigation';
import { account, ID } from '$lib/appwrite';

const isBrowser = typeof window !== 'undefined';

// const createUser = () => {
// 	let currentUser = $state(null);
// 	const isAdmin = $derived(currentUser?.user ? currentUser?.user?.labels?.[0] === 'admin' : false);

// 	async function init() {
// 		if (!isBrowser) return;
// 		try {
// 			currentUser = await account.get();
// 		} catch (e) {
// 			currentUser = null;
// 		}
// 	}

// 	init();

// 	async function register(email, password, name) {
// 		if (!isBrowser) return;
// 		await account.create({
// 			userId: ID.unique(),
// 			email,
// 			password,
// 			name
// 		});
// 		await login(email, password);
// 	}

// 	async function login(email, password) {
// 		if (!isBrowser) return;
// 		await account.createEmailPasswordSession({
// 			email,
// 			password
// 		});

// 		await init();
// 	}

// 	async function logout() {
// 		if (!isBrowser) return;
// 		await account.deleteSession('current');
// 		currentUser = null;
// 		await invalidateAll();
// 		goto('/');
// 	}

// 	return {
// 		get user() {
// 			return currentUser;
// 		},
// 		get isAdmin() {
// 			return isAdmin;
// 		},
// 		register,
// 		login,
// 		logout,
// 		init
// 	};
// };

// export const user = createUser();

// export let user = $state(!isBrowser ? null : await account.get());

let fetchUser = (async () => {
    if (!isBrowser) return null;
    try {
        return await account.get();
    } catch (e) {
        return null;
    }
})

export let user = !isBrowser ? null : await fetchUser();

export let auth = $state({
    isLoading: true,
    isAdmin: false,
    user: null
});

export async function logout() {
    if (!isBrowser) return;
    await account.deleteSession('current');
    auth.user = null;
    auth.isAdmin = false;
    await invalidateAll();
    goto('/');
}

async function init() {
    if (!isBrowser) return;
    auth.isLoading = true;
    try {
        auth.user = await account.get();
        auth.isAdmin = auth.user?.labels?.[0] === 'admin';
    } catch (e) {
        auth.user = null;
        auth.isAdmin = false;
    } finally {
        auth.isLoading = false;
    }
}

export async function register(email, password, name) {
    if (!isBrowser) return;
    await account.create({
        userId: ID.unique(),
        email,
        password,
        name
    });
    await login(email, password);
}

export async function login(email, password) {
    if (!isBrowser) return;
    await account.createEmailPasswordSession({
        email,
        password
    });

    await init();
}


init();

// export let isAdmin = $derived(user?.user ? user?.user?.labels?.[0] === 'admin' : false);

// export const User = async () => {
//     let user = $state(!isBrowser ? null : await account.get());
//     let isAdmin = $derived(user ? user?.labels?.[0] === 'admin' : false);

//     return {
// 		get isAdmin() {
// 			return isAdmin;
// 		},

//         get user() {
//             return user;
//         }
// 	};
// };

// export default User();