import { Client, TablesDB, Account, Storage, ID, Query, Permission, Role } from 'appwrite';
import { env } from '$env/dynamic/public';

const BUCKET_ID = 'pilgrim-documents';
const DATABASE_ID = 'hijrah';

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

export async function createRow(tableId, data) {
	return tablesDB.createRow(DATABASE_ID, tableId, data);
}

export async function getRow(tableId, rowId) {
	try {
		return tablesDB.getRow(DATABASE_ID, tableId, rowId);
	} catch (error) {
		return null;
	}
}

export async function updateRow(tableId, rowId, data) {
	return tablesDB.updateRow(DATABASE_ID, tableId, rowId, data);
}

export async function listRows(tableId, queries = []) {
	return tablesDB.listRows(DATABASE_ID, tableId, queries);
}

/**
 * Upload a file to Appwrite Storage
 * @param {File} file - The file to upload
 * @param {string} userId - The user ID for permissions
 * @returns {Promise<Object>} - The uploaded file object
 */
export async function uploadFile(file, userId) {
	try {
		const result = await storage.createFile(BUCKET_ID, ID.unique(), file, [
			Permission.read(Role.user(userId)),
			Permission.write(Role.user(userId))
		]);
		return result;
	} catch (error) {
		console.error('File upload failed:', error);
		throw error;
	}
}

/**
 * Get file preview/download URL
 * @param {string} fileId - The file ID
 * @returns {string} - The file URL
 */
export function getFileUrl(fileId) {
	// console.log(storage.getFileView(BUCKET_ID, fileId));
	// console.log('HAIDHAKDHk');
	return storage.getFileView(BUCKET_ID, fileId);
	// return `${env.PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/pilgrim-documents/files/${fileId}/view?project=hijrah&mode=admin`;
}

// export function getImageUrl(imageId) {
// 	return `${PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/pilgrim-documents/files/${imageId}/view?project=hijrah&mode=admin`;
// }

/**
 * Delete a file from storage
 * @param {string} fileId - The file ID to delete
 */
export async function deleteFile(fileId) {
	try {
		await storage.deleteFile(BUCKET_ID, fileId);
	} catch (error) {
		console.error('File delete failed:', error);
		throw error;
	}
}
