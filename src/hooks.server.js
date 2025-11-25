import { Account } from 'node-appwrite';
import { createAdminClient } from '$lib/server/appwrite';

export async function handle({ event, resolve }) {
	const sessionCookie = event.cookies.get('session');

	event.locals.user = null;

	if (sessionCookie) {
		try {
			const { account } = createAdminClient();
			account.setSession(sessionCookie);
			event.locals.user = await account.get();
		} catch (error) {
			event.cookies.delete('session', { path: '/' });
		}
	}

	return resolve(event);
}
