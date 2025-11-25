import { Client, TablesDB, Account, Storage, ID, Query, Permission, Role } from 'appwrite';
import { env } from '$env/dynamic/public';

const BUCKET_ID = 'files';

const client = new Client();
client
	.setEndpoint(env.PUBLIC_APPWRITE_ENDPOINT)
	.setProject(env.PUBLIC_APPWRITE_PROJECT_ID)
	.setDevKey(env.PUBLIC_APPWRITE_DEV_KEY);

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const storage = new Storage(client);

export { ID, Query, Permission, Role };

export async function getFile(fileId) {
	const result = storage.getFileView({
		bucketId: BUCKET_ID,
		fileId: fileId
	});

	return result;
}
