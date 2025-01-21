import type { RequestHandler } from "./$types";
import { unlinkSync } from 'fs';
import path from 'path';

export const GET: RequestHandler = async ({ params, locals }) => {
    const { id } = params;
    console.log(`id in db: ${id}`);
    try {
      const loadDataPromise = new Promise((resolve, reject) => {
        const db = locals.db;
        
        if (!db) {
            console.error('Database connection not found');
            throw new Error('Database connection not found');
        }
        const query = "SELECT * FROM News WHERE pk_id = ?";
        db.all(query, [ id ], (err: Error|null, rows) => {
            if(err) {
                console.error('Error fetching news:', err);
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
      const news = await loadDataPromise;
      return new Response(JSON.stringify(news), { status: 200 });
    } catch (error) {
      console.error('Failed to fetch news:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  };

  export const PUT: RequestHandler = async ({ request, locals, params }) => {
    try {
      const db = locals.db;
      const { id } = params;
      const { name, content, raw_content } = await request.json();
      const last_edited = new Date().toISOString();
  
      const result = await db.run(
        'UPDATE News SET name = ?, content = ?, raw_content = ?, last_edited = ? WHERE pk_id = ?',
        [name, content, raw_content, last_edited, id]
      );
  
      return new Response(JSON.stringify({ competition: result }), { status: 201 });
    } catch (error) {
      console.error('Failed to edit news:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  };

  export const DELETE: RequestHandler = async ({ locals, params }) => {
    try {
      const db = locals.db;
      const { id } = params;


      const loadDataPromise = new Promise((resolve, reject) => {
        if (!db) {
            console.error('Database connection not found');
            throw new Error('Database connection not found');
        }
        const query = "SELECT content FROM News WHERE pk_id = ?";
        db.all(query, [ id ], (err: Error|null, rows) => {
            if(err) {
                console.error('Error fetching news:', err);
                reject(err);
                return;
            }
            resolve(rows);
        });
      });
      const response = await loadDataPromise;
      const news = response as Array<{ content: string }>;
      
      const content = JSON.parse(news[0].content);
      let imagesUrl: string[] = [];
      
      content.ops.forEach(async (imgObject: any) => {
        if(imgObject.insert.image) {
          imagesUrl.push(imgObject.insert.image);
        }
      })

      imagesUrl.forEach(async (url: string) => {
        try {
          const uploadDir = path.join(process.cwd(), 'static');
          const filePath = path.join(uploadDir, url);

          unlinkSync(filePath);
        } catch (error) {
          console.error('Error:', error);
        }
      });
  
      const result = await db.run(
        'DELETE FROM News WHERE pk_id = ?',
        [id]
      );
  
      return new Response(JSON.stringify({ result: result }), { status: 201 });
    } catch (error) {
      console.error('Failed to remove news:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  };