// src/routes/+layout.server.js
import { appwrite, ID, Permission, Role } from '$lib/server/appwrite';

async function ensureDatabaseEntries(appwriteUser) {
	if (!appwriteUser) return;
	
	try {
		await appwrite.tablesDB.getRow('applications', 'users', appwriteUser.$id);
	} catch (error) {
		if (error.code === 404) {
			console.log(`Creating new Appwrite settings for user: ${appwriteUser.$id}`);
			
			Promise.all([
				appwrite.tablesDB.createRow(
					'applications',
					'users',
					appwriteUser.$id,
					{
						userId: appwriteUser.$id,
						email: appwriteUser.email,
						name: appwriteUser.name ? appwriteUser.name.split(' ')[0] || appwriteUser.name : '',
						// phone: 
					},
					[Permission.read(Role.user(appwriteUser.$id)), Permission.write(Role.user(appwriteUser.$id))]
				),
				appwrite.tablesDB.createRow(
					'applications',
					'applications',
					appwriteUser.$id,
					{
						userId: appwriteUser.$id,
						fullName: appwriteUser.name || '',
						email: appwriteUser.email || ''
					},
					[Permission.read(Role.user(appwriteUser.$id)), Permission.write(Role.user(appwriteUser.$id))]
				),
				appwrite.tablesDB.createRow(
					'applications',
					'progress',
					appwriteUser.$id,
					{
						userId: appwriteUser.$id,
					},
					[Permission.read(Role.user(appwriteUser.$id)), Permission.write(Role.user(appwriteUser.$id))]
				),
				appwrite.tablesDB.createRow(
					'applications',
					'details',
					appwriteUser.$id,
					{
						userId: appwriteUser.$id,
					},
					[Permission.read(Role.user(appwriteUser.$id)), Permission.write(Role.user(appwriteUser.$id))]
				),
				appwrite.tablesDB.createRow(
					'applications',
					'universities',
					appwriteUser.$id,
					{
						userId: appwriteUser.$id
					},
					[Permission.read(Role.user(appwriteUser.$id)), Permission.write(Role.user(appwriteUser.$id))]
				)
			]).catch(console.error);
		} else {
			console.error('Error ensuring database entries:', error);
		}
	}
}

// export async function load({ locals, url }) {

//     if (locals.isAuthenticated && locals.user) {
//         ensureDatabaseEntries(locals.user); // Fire-and-forget
		
//         return {
//             isAuthenticated: locals.isAuthenticated,
//             user: locals.user,
//             url: url.pathname
//         };
//     }

//     // Return data for unauthenticated users
//     return {
//         isAuthenticated: false,
//         user: null,
//         url: url.pathname
//     };
// }

export async function load({ locals }) {
    return {
        user: locals.user
    };
}
