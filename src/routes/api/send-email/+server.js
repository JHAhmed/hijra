import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';
import { PUBLIC_APPWRITE_DATABASE_ID } from '$env/static/public';
import { Permission, Role, ID } from 'node-appwrite';
import { storage, tablesDB } from '$lib/server/appwrite.js';

async function sendContactEmail(email, name, subject, message) {
	const resend = new Resend(RESEND_API_KEY);

	const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">

        <h2 style="color: #4CAF50;">New Contact Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
		<p><strong>Subject:</strong> ${subject}</p>

		<p><strong>Message:</strong> ${message}</p>
		<p style="margin-top: 20px;">You have received a new contact request. Please follow up with the user.</p>
        <div style="margin-top: 30px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50;">
            <p style="font-size: 12px; color: #777;">This email was generated automatically. Please do not reply to this email.</p>
        </div>

    </div>
    `;

	await resend.emails.send({
		from: 'team@hijra-portal.vercel.app',
		to: 'zindaeducation@mail.ru',
		// to: 'jamalhascientist@gmail.com',
		subject: 'New Contact Request',
		html: html
	});

}

async function sendCTAEmail(email, name, phone, countryCode) {
	const resend = new Resend(RESEND_API_KEY);
	const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">

        <h2 style="color: #4CAF50;">New Contact Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong>  ${phone}</p>
        <p><strong>Country Code:</strong> ${countryCode}</p>
        <p style="margin-top: 20px;">You have received a new contact request. Please follow up with the user.</p>
        <div style="margin-top: 30px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50;">
            <p style="font-size: 12px; color: #777;">This email was generated automatically. Please do not reply to this email.</p>
        </div>

    </div>
    `;

	await resend.emails.send({
		from: 'team@hijra-portal.vercel.app',
		to: 'zindaeducation@mail.ru',
		// to: 'jamalhascientist@gmail.com',
		subject: 'New CTA Request',
		html: html
	});
}

async function updateInterstedUsers(email, name, phone, countryCode) {
	try {
		await tablesDB.createRow(
			PUBLIC_APPWRITE_DATABASE_ID,
			'interested',
			ID.unique(),
			{ email, name, phone, countryCode },
			[Permission.read(Role.any()), Permission.update(Role.any()), Permission.delete(Role.any())]
		);
	} catch (error) {
		console.error('Submission failed:', error);
		return new Response(JSON.stringify({ error: 'Submission failed', details: error }), {
			status: 500
		});
	}
}

export async function POST({ request }) {
	const { email, name, phone, cta, countryCode, subject, message } = await request.json();

	if (cta) {
		await sendCTAEmail(email, name, phone, countryCode);
		await updateInterstedUsers(email, name, phone, countryCode);
	} else {
		await sendContactEmail(email, name, subject, message);
		// You can add additional logic for non-CTA emails here if needed
	}

	return new Response(JSON.stringify({ message: 'Email sent successfully' }), { status: 200 });
}
