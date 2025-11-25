// import {
// 	Client,
// 	TablesDB,
// 	ID,
// 	Query,
// 	Storage,
// 	Users,
// 	Account,
// 	Permission,
// 	Role
// } from 'node-appwrite';

// import { APPWRITE_API_KEY } from '$env/static/private';
// import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';

// const client = new Client()
// 	.setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
// 	.setProject(PUBLIC_APPWRITE_PROJECT_ID)
// 	.setKey(APPWRITE_API_KEY);

// export const tablesDB = new TablesDB(client);
// export const storage = new Storage(client);
// export const users = new Users(client);
// export const account = new Account(client);

// export const appwrite = {
// 	tablesDB,
// 	storage,
// 	users,
// 	account
// };

// export { ID, Query, Permission, Role };

import { Client, Account, Users } from 'node-appwrite';
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';
import { APPWRITE_API_KEY } from '$env/static/private';

export const SESSION_COOKIE = 'session';

// Admin client - for creating accounts and sessions
export function createAdminClient() {
	const client = new Client()
		.setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
		.setProject(PUBLIC_APPWRITE_PROJECT_ID)
		.setKey(APPWRITE_API_KEY);

	return {
		get account() {
			return new Account(client);
		},
		get users() {
			return new Users(client);
		}
	};
}

// Session client - for authenticated user requests
export function createSessionClient(sessionToken) {
	const client = new Client()
		.setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
		.setProject(PUBLIC_APPWRITE_PROJECT_ID);

	if (sessionToken) {
		client.setSession(sessionToken);
	}

	return {
		get account() {
			return new Account(client);
		}
	};
}
