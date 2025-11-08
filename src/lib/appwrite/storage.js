import { storage, ID, Query } from '$lib/appwrite';

const BUCKET_ID = 'marksheets';

export async function getFile(fileId) {
	const result = storage.getFileView({
		bucketId: BUCKET_ID,
		fileId: fileId
	});

	return result;
}
