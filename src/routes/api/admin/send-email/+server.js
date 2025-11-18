import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';

async function sendEmail(recipient, subject = '', message) {
	const resend = new Resend(RESEND_API_KEY);

	const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">${subject}</h2>
		<p style="margin-top: 20px;">${message}</p>
		<p style="margin-top: 20px;">You have received a notification. Please check your progress in <a href="https://hijra-portal.vercel.app/hijra-portal">https://hijra-portal.vercel.app/hijra-portal</a>.</p>
        <div style="margin-top: 30px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50;">
            <p style="font-size: 12px; color: #777;">This email was generated automatically. Please do not reply to this email.</p>
        </div>
    </div>
    `;

	await resend.emails.send({
		from: 'team@hijra-portal.vercel.app',
		to: recipient,
		// to: 'jamalhascientist@gmail.com',
		subject: subject,
		html: html
	});
}

export async function POST({ request }) {
	const { recipient, subject, message } = await request.json();

	if (!subject) subject = 'New Email from Hijra!';

	try {
		await sendEmail(recipient, subject, message);
		return new Response(JSON.stringify({ message: 'Email sent successfully' }), { status: 200 });
	} catch (error) {
		console.error('Error sending email:', error);
		return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
	}
}
