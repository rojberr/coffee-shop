import { type RequestHandler } from "@sveltejs/kit";
import sqlite3 from 'sqlite3';

export const GET: RequestHandler = async ({ url, locals }) => {
  try {
    const db = locals.db;
    const id = url.searchParams.get("id");

    if (id) {
      // Pobranie pojedynczej podstrony
      return new Promise<Response>((resolve, reject) => {
        db.get("SELECT * FROM Pages WHERE pk_id = ?", [id], (err: Error | null, page: any) => {
          if (err) {
            console.error("Błąd podczas pobierania podstrony:", err.message);
            reject(new Response(JSON.stringify({ error: "Failed to fetch page" }), { status: 500 }));
          } else if (!page) {
            console.error("Podstrona nie została znaleziona");
            resolve(new Response(JSON.stringify({ error: "Page not found" }), { status: 404 }));
          } else {
            console.log("Pobrano podstronę:", page);
            resolve(new Response(JSON.stringify(page), { status: 200 }));
          }
        });
      });
    }

    // Pobranie wszystkich podstron
    return new Promise<Response>((resolve, reject) => {
      db.all("SELECT * FROM Pages", (err: Error | null, pages: any[]) => {
        if (err) {
          console.error("Błąd podczas pobierania podstron:", err.message);
          reject(new Response(JSON.stringify({ error: "Failed to fetch pages" }), { status: 500 }));
        } else {
          console.log("Pobrano wszystkie podstrony:", pages);
          resolve(new Response(JSON.stringify(pages), { status: 200 }));
        }
      });
    });
  } catch (error) {
    const err = error as Error; // Rzutowanie typu na Error
    console.error("Nieoczekiwany błąd:", err.message);
    return new Response(JSON.stringify({ error: "Unexpected server error" }), { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  const db = locals.db;
  try {
    const { name, content, raw_content } = await request.json();

    if (!name || !content || !raw_content) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    // Dodawanie rekordu z callbackiem dla lastID
    return new Promise<Response>((resolve, reject) => {
      db.run(
        "INSERT INTO Pages (name, content, raw_content) VALUES (?, ?, ?)",
        [name, content, raw_content],
        function (this: sqlite3.Statement, err: Error | null) {
          if (err) {
            console.error("Błąd podczas dodawania podstrony:", err.message);
            reject(new Response(JSON.stringify({ error: "Failed to create page" }), { status: 500 }));
          } else {
            console.log(`Dodano rekord o ID: ${(this as any).lastID}`);
            resolve(
              new Response(
                JSON.stringify({ success: true, id: (this as any).lastID }),
                { status: 201 }
              )
            );
          }
        }
      );
    });
  } catch (error) {
    const err = error as Error; // Rzutowanie typu na Error
    console.error("Błąd serwera podczas dodawania podstrony:", err.message);
    return new Response(JSON.stringify({ error: "Failed to create page" }), { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ request, locals }) => {
  const db = locals.db;

  try {
    const { id, name, content, raw_content } = await request.json();

    if (!id || !name || !content || !raw_content) {
      console.error("Brak wymaganych pól");
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    // Aktualizowanie rekordu z callbackiem
    return new Promise<Response>((resolve, reject) => {
      db.run(
        "UPDATE Pages SET name = ?, content = ?, raw_content = ? WHERE pk_id = ?",
        [name, content, raw_content, id],
        function (this: sqlite3.Statement, err: Error | null) {
          if (err) {
            console.error("Błąd podczas aktualizowania podstrony:", err.message);
            reject(new Response(JSON.stringify({ error: "Failed to update page" }), { status: 500 }));
          } else if ((this as any).changes === 0) {
            console.error("Nie znaleziono rekordu do zaktualizowania");
            resolve(new Response(JSON.stringify({ error: "Page not found" }), { status: 404 }));
          } else {
            console.log(`Zaktualizowano ${(this as any).changes} rekord(ów).`);
            resolve(new Response(JSON.stringify({ success: true }), { status: 200 }));
          }
        }
      );
    });
  } catch (error) {
    const err = error as Error; // Rzutowanie typu na Error
    console.error("Nieoczekiwany błąd:", err.message);
    return new Response(JSON.stringify({ error: "Unexpected server error" }), { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ url, locals }) => {
  const db = locals.db;

  try {
    const id = url.searchParams.get("id");

    if (!id) {
      console.error("Brak ID w żądaniu");
      return new Response(JSON.stringify({ error: "Missing ID" }), { status: 400 });
    }

    // Usuwanie rekordu z callbackiem
    return new Promise<Response>((resolve, reject) => {
      db.run("DELETE FROM Pages WHERE pk_id = ?", [id], function (this: sqlite3.Statement, err: Error | null) {
        if (err) {
          console.error("Błąd podczas usuwania podstrony:", err.message);
          reject(new Response(JSON.stringify({ error: "Failed to delete page" }), { status: 500 }));
        } else if ((this as any).changes === 0) {
          console.error("Nie znaleziono rekordu do usunięcia");
          resolve(new Response(JSON.stringify({ error: "Page not found" }), { status: 404 }));
        } else {
          console.log(`Usunięto ${(this as any).changes} rekord(ów).`);
          resolve(new Response(JSON.stringify({ success: true }), { status: 200 }));
        }
      });
    });
  } catch (error) {
    const err = error as Error; // Rzutowanie typu na Error
    console.error("Nieoczekiwany błąd:", err.message);
    return new Response(JSON.stringify({ error: "Unexpected server error" }), { status: 500 });
  }
};
