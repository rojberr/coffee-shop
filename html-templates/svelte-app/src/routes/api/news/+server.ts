import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
      
      const db = locals.db;
      const { name, content, raw_content } = await request.json();
      const created_at = new Date().toISOString();
      const last_edited = created_at;
  
      const result = await db.run(
        'INSERT INTO News (name, content, raw_content, created_at, last_edited) VALUES (?, ?, ?, ?, ?)',
        [ name, content, raw_content, created_at, last_edited ]
      );
  
      return new Response(JSON.stringify({ news: result }), { status: 201 });
    } catch (error) {
      console.error('Failed to create news:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  };

  export const GET: RequestHandler = async ({ locals }) => {
    try {
      const loadDataPromise = new Promise((resolve, reject) => {
          const db = locals.db;
          if (!db) {
              console.error('Database connection not found');
              throw new Error('Database connection not found');
          }
          const query = "SELECT * FROM News";
          db.all(query, (err: Error|null, rows) => {
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