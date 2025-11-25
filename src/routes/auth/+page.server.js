import { createAdminClient, SESSION_COOKIE } from '$lib/server/appwrite';
import { redirect, fail } from '@sveltejs/kit';
import { ID } from 'node-appwrite';

export const actions = {
    login: async ({ request, cookies }) => {
        const formData = await request.formData();
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const { account } = createAdminClient();
            const session = await account.createEmailPasswordSession(email, password);

            // Set the session cookie with the secret
            cookies.set(SESSION_COOKIE, session.secret, {
                sameSite: 'strict',
                expires: new Date(session.expire),
                secure: true,
                httpOnly: true,
                path: '/'
            });

            return {
                success: true

            } 
            
        } catch (error) {
            console.error('Login failed:', error);
            return fail(400, {
                error: error.message || 'Invalid credentials'
            });
        }
    },

    register: async ({ request, cookies }) => {
        const formData = await request.formData();
        const email = formData.get('email');
        const password = formData.get('password');
        const name = formData.get('name');

        try {
            const { account } = createAdminClient();

            // Create the user account
            await account.create(ID.unique(), email, password, name);

            // Create session immediately after registration
            const session = await account.createEmailPasswordSession(email, password);

            // Set the session cookie
            cookies.set(SESSION_COOKIE, session.secret, {
                sameSite: 'strict',
                expires: new Date(session.expire),
                secure: true,
                httpOnly: true,
                path: '/'
            });

            return {
                success: true
            };
        } catch (error) {
            console.error('Registration failed:', error);
            return fail(400, {
                error: error.message || 'Registration failed'
            });
        }
    },

    logout: async ({ cookies }) => {
        const sessionCookie = cookies.get(SESSION_COOKIE);
        
        if (sessionCookie) {
            try {
                const { account } = createAdminClient();
                await account.deleteSession('current');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        }

        cookies.delete(SESSION_COOKIE, { path: '/' });
        throw redirect(303, '/auth');
    }
};
