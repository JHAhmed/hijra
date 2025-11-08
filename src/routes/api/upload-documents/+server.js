import { env } from '$env/dynamic/public';
import { Client, Account, Storage, TablesDB, Permission, Role, ID, Query } from 'node-appwrite';
import { storage, tablesDB } from '$lib/server/appwrite.js';

export async function POST({ request }) {

    const form = await request.formData();
    const userId = form.get('userId');

    const aadharCardFile = form.get('aadharCard');
    const schoolDetailsFile = form.get('schoolDetails');
    const hivCertificateFile = form.get('hivCertificate');
    const passportSizePhotoFile = form.get('passportSizePhoto');

    try {
        let aadharCardFileId = null;
        let schoolDetailsFileId = null;
        let hivCertificateFileId = null;
        let passportSizePhotoFileId = null;

        if (aadharCardFile && aadharCardFile.size > 0) {
            const aadharCardFileUploaded = await storage.createFile(
                env.PUBLIC_APPWRITE_BUCKET_ID,
                ID.unique(),
                aadharCardFile
            );
            aadharCardFileId = aadharCardFileUploaded.$id;
        }

        if (schoolDetailsFile && schoolDetailsFile.size > 0) {
            const schoolDetailsFileUploaded = await storage.createFile(
                env.PUBLIC_APPWRITE_BUCKET_ID,
                ID.unique(),
                schoolDetailsFile
            );
            schoolDetailsFileId = schoolDetailsFileUploaded.$id;
        }

        if (hivCertificateFile && hivCertificateFile.size > 0) {
            const hivCertificateFileUploaded = await storage.createFile(
                env.PUBLIC_APPWRITE_BUCKET_ID,
                ID.unique(),
                hivCertificateFile
            );
            hivCertificateFileId = hivCertificateFileUploaded.$id;
        }

        if (passportSizePhotoFile && passportSizePhotoFile.size > 0) {
            const passportSizePhotoFileUploaded = await storage.createFile(
                env.PUBLIC_APPWRITE_BUCKET_ID,
                ID.unique(),
                passportSizePhotoFile
            );
            passportSizePhotoFileId = passportSizePhotoFileUploaded.$id;
        }
        
        // 3. Prepare the data object for the database
        const detailsData = {
            ...(aadharCardFileId && { aadharCardId: aadharCardFileId }),
            ...(schoolDetailsFileId && { schoolDetailsId: schoolDetailsFileId }),
            ...(hivCertificateFileId && { hivCertificateId: hivCertificateFileId }),
            ...(passportSizePhotoFileId && { passportSizePhotoId: passportSizePhotoFileId }),
        };

        // 4. Update the document in the database
        await tablesDB.updateRow(
            env.PUBLIC_APPWRITE_DATABASE_ID,
            "details",
            userId,
            detailsData,
            [Permission.read(Role.user(userId)), Permission.update(Role.user(userId))]
        );

        await tablesDB.updateRow(
            env.PUBLIC_APPWRITE_DATABASE_ID,
            "progress",
            userId, 
            {
                documentsUploaded: true
            },
            [Permission.read(Role.user(userId)), Permission.update(Role.user(userId))]
        );


    } catch (error) {
        console.error('Update failed:', error);
        return new Response(JSON.stringify({ error: 'Update failed', details: error }), {
            status: 500
        });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
}
