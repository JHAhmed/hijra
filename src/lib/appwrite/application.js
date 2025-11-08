import { ID, Query } from 'appwrite';
import { tablesDB } from '$lib/appwrite';

const APPLICATIONS_DATABASE_ID = 'applications'; 
const APPLICATIONS_TABLE_ID = 'applications'; 

export async function getUserApplication(userId) {
    // Ensure userId is a valid string before querying
    if (!userId) {
        console.error("User ID is missing, cannot query progress.");
        return { documents: [], total: 0 }; // Return an empty result
    }

    try {
        const userApplications = await tablesDB.getRow(APPLICATIONS_DATABASE_ID, APPLICATIONS_TABLE_ID, userId);
        return userApplications;
    } catch (error) {
        console.error("Error fetching progress details");
        return null; // Return an empty result on error
    }
}


export async function addApplication(userId, title, description) {
	await tablesDB.createRow(APPLICATIONS_DATABASE_ID, APPLICATIONS_TABLE_ID, ID.unique(), {
		userId,
		title,
		description
	});
}

// export async function deleteApplication(id) {
// 	await tablesDB.deleteRow(APPLICATIONS_DATABASE_ID, APPLICATIONS_TABLE_ID, id);
// }