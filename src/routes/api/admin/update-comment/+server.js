import { env } from '$env/dynamic/public';
import { tablesDB } from '$lib/server/appwrite.js';

export async function POST({ request }) {

    const { userId, comment } = await request.json();

    try {
        await tablesDB.updateRow(
            env.PUBLIC_APPWRITE_DATABASE_ID,
            "details",
            userId,
            { adminComments: comment }
        );

    } catch (error) {
        console.error("Submission failed:", error);
        return new Response(JSON.stringify({ error: 'Submission failed', details: error }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}
