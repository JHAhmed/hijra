import { Client, TablesDB, Account, Storage, ID, Query, Permission, Role } from 'appwrite';
import { env } from '$env/dynamic/public';

const client = new Client();
client
	.setEndpoint(env.PUBLIC_APPWRITE_ENDPOINT)
	.setProject(env.PUBLIC_APPWRITE_PROJECT_ID)
	.setDevKey(env.PUBLIC_APPWRITE_DEV_KEY);

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const storage = new Storage(client);

export { ID, Query, Permission, Role };