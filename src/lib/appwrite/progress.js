import { ID, Query } from 'appwrite';
import { tablesDB } from '$lib/appwrite';

const APPLICATIONS_DATABASE_ID = 'applications'; // Replace with your database ID
const PROGRESS_TABLE_ID = 'progress'; // Replace with your table ID

export async function getUserProgress(userId) {
    // Ensure userId is a valid string before querying
    if (!userId) {
        console.error("User ID is missing, cannot query progress.");
        return { documents: [], total: 0 }; // Return an empty result
    }

    try {
        const progressDetails = await tablesDB.getRow(APPLICATIONS_DATABASE_ID, PROGRESS_TABLE_ID, userId);
        return progressDetails;
    } catch (error) {
        console.error("Error fetching progress details");
        return null; // Return an empty result on error
    }
}

export async function addProgress(userId, title, description) {
    await tablesDB.createRow(APPLICATIONS_DATABASE_ID, PROGRESS_TABLE_ID, ID.unique(), {
        userId,
        title,
        description
    });
}

// export async function deleteApplication(id) {
// 	await tablesDB.deleteRow(APPLICATIONS_DATABASE_ID, APPLICATIONS_TABLE_ID, id);
// }