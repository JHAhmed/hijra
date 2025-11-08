import { env } from '$env/dynamic/public';
import { Client, Account, Storage, TablesDB, Permission, Role, ID, Query } from 'node-appwrite';
import { storage, tablesDB } from '$lib/server/appwrite.js';

export async function POST({ request }) {

    const form = await request.formData();
    const userId = form.get('userId');

    const paymentReceiptFile = form.get('paymentReceipt');
    const paymentLevel = form.get('paymentLevel');

    try {
        let paymentReceiptFileId = null;
        if (paymentReceiptFile && paymentReceiptFile.size > 0) {
            const paymentReceiptFileUploaded = await storage.createFile(
                env.PUBLIC_APPWRITE_BUCKET_ID,
                ID.unique(),
                paymentReceiptFile
            );
            paymentReceiptFileId = paymentReceiptFileUploaded.$id;
        }
    

        if (paymentLevel === 'first') {
            await tablesDB.updateRow(
                env.PUBLIC_APPWRITE_DATABASE_ID,
                "details",
                userId,
                { firstPaymentReceiptId: paymentReceiptFileId, firstPaymentCompleted: true },
                [Permission.read(Role.user(userId)), Permission.update(Role.user(userId))]
            );
        } else if (paymentLevel === 'second') {
            await tablesDB.updateRow(
                env.PUBLIC_APPWRITE_DATABASE_ID,
                "details",
                userId,
                { secondPaymentReceiptId: paymentReceiptFileId, secondPaymentCompleted: true },
                [Permission.read(Role.user(userId)), Permission.update(Role.user(userId))]
            );
        } else {
            throw new Error('Invalid payment level');
        }


    } catch (error) {
        console.error('Update failed:', error);
        return new Response(JSON.stringify({ error: 'Update failed', details: error }), {
            status: 500
        });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
}
