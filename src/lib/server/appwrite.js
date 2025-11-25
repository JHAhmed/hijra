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
