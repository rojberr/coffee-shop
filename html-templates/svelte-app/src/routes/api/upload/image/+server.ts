import type { RequestHandler } from "./$types";
import { writeFileSync, mkdirSync, unlinkSync } from 'fs';
import path from 'path';

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('image');
        const folder = formData.get('folder') as string; // Pobieramy parametr folder

        if (!file || !(file instanceof Blob)) {
            return new Response(JSON.stringify({ error: 'Invalid file upload' }), { status: 400 });
        }

        // Określenie folderu na podstawie wartości 'folder'
        let targetFolder = '';
        if (folder === 'news') {
            targetFolder = 'uploads/news';
        } else if (folder === 'pages') {
            targetFolder = 'uploads/pages';
        } else {
            return new Response(JSON.stringify({ error: 'Invalid folder specified' }), { status: 400 });
        }

        const uploadDir = path.join(process.cwd(), 'static', targetFolder);
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = path.join(uploadDir, fileName);

        mkdirSync(uploadDir, { recursive: true });
        writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));

        const fileUrl = `/${targetFolder}/${fileName}`;

        console.log(`File uploaded to: ${fileUrl}`);

        return new Response(JSON.stringify({ data: fileUrl }), { status: 200 });
    } catch (error) {
        console.error('Failed to add image:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
    try {
        const { url } = await request.json();

        const uploadDir = path.join(process.cwd(), 'static');
        const filePath = path.join(uploadDir, url);

        unlinkSync(filePath);

        console.log('File removed:', url);

        return new Response(JSON.stringify({ data: `Removed file ${filePath}` }), { status: 200 });
    } catch (error) {
        console.error('Failed to remove image:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};
