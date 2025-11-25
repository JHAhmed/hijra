import { createSessionClient } from '$lib/server/appwrite';

export async function handle({ event, resolve }) {
    const sessionCookie = event.cookies.get('session');
    
    event.locals.user = null;
    
    if (sessionCookie) {
        try {
            const { account } = createSessionClient(sessionCookie);
            event.locals.user = await account.get();
        } catch (error) {
            event.cookies.delete('session', { path: '/' });
        }
    }
    
    return resolve(event);
}
