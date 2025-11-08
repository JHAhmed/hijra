import { Client, TablesDB, ID, Query, Storage, Users, Account, Permission, Role } from 'node-appwrite';

import { APPWRITE_API_KEY } from '$env/static/private';
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';

const client = new Client()
	.setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
	.setProject(PUBLIC_APPWRITE_PROJECT_ID)
	.setKey(APPWRITE_API_KEY);

export const tablesDB = new TablesDB(client);
export const storage = new Storage(client);
export const users = new Users(client);
export const account = new Account(client);

export const appwrite = {
	tablesDB,
	storage,
	users,
	account,
};

export { ID, Query, Permission, Role };