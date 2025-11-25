// src/routes/dashboard/+page.server.js
import { redirect } from '@sveltejs/kit';
import { createSessionClient, SESSION_COOKIE } from '$lib/server/appwrite';

export const actions = {
    logout: async ({ cookies }) => {
        const sessionCookie = cookies.get(SESSION_COOKIE);
        
        if (sessionCookie) {
            try {
                const { account } = createSessionClient(sessionCookie);
                await account.deleteSession('current');
            } catch (error) {
                // Ignore errors
            }
        }

        cookies.delete(SESSION_COOKIE, { path: '/' });
        throw redirect(303, '/auth');
    }
};
