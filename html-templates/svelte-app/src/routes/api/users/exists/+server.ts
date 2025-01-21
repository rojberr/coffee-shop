import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const db = locals.db;
    const { email_address } = await request.json();
    console.log(`email received: ${email_address}`);

    // Check if the email exists in the database
    const emailExists = await new Promise<boolean>((resolve, reject) => {
      db.get(
        `SELECT email_address FROM Users WHERE email_address = ?`,
        [email_address],
        (err, row) => {
          if (err) {
            console.error('Error checking email existence:', err);
            reject(err);
          } else {
            resolve(!!row); // Returns true if a row is found, otherwise false
          }
        }
      );
    });

    return new Response(JSON.stringify({ emailExists: emailExists }), { status: 200 });
  } catch (error) {
    console.error('Error in checking email:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};