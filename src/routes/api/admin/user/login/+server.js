import { account } from '$lib/server/appwrite.js';
import { redirect } from '@sveltejs/kit';

export const POST = async ({ request, cookies }) => {
	const data = await request.formData();
	const email = data.get('email');
	const password = data.get('password');

	const session = await account.createEmailPasswordSession(email, password);

	cookies.set('session', session.secret, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: true, // false if localhost
		maxAge: new Date(session.expire).getTime() - Date.now()
	});

	throw redirect(302, '/');
};
