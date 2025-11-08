import { tablesDB, ID, Query } from '$lib/appwrite';

const APPLICATIONS_DATABASE_ID = 'applications'; 
const UNIVERSITIES_TABLE_ID = 'universities'; 

export async function getUserUniversities(userId) {
    // Ensure userId is a valid string before querying
    if (!userId) {
        console.error("User ID is missing, cannot query universities.");
        return { documents: [], total: 0 }; // Return an empty result
    }

    try {
        const userApplications = await tablesDB.getRow(APPLICATIONS_DATABASE_ID, UNIVERSITIES_TABLE_ID, userId);
        return userApplications;
    } catch (error) {
        console.error("Error fetching progress details");
        return null; // Return an empty result on error
    }
}


export async function addApplication(userId, title, description) {
	await tablesDB.createRow(APPLICATIONS_DATABASE_ID, UNIVERSITIES_TABLE_ID, ID.unique(), {
		userId,
		title,
		description
	});
}

// export async function deleteApplication(id) {
// 	await tablesDB.deleteRow(APPLICATIONS_DATABASE_ID, UNIVERSITIES_TABLE_ID, id);
// }