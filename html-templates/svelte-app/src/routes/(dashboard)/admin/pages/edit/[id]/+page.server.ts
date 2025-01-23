import type { Actions, PageServerLoad } from "./$types";
import { json } from "@sveltejs/kit";

// Funkcja `load` do pobrania danych podstrony
export const load: PageServerLoad = async ({ params, fetch, locals }) => {
    const session = await locals.getSession();
    const isAdmin = !!session?.user?.isAdmin;
  const id = params.id;

  if (id === "new") {
    // Nowa podstrona, brak danych do załadowania
    return { pageData: null, isAdmin };
  }

  try {
    // Wysłanie żądania GET do API
    const response = await fetch(`/api/pages?id=${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch page from API");
    }

    const pageData = await response.json();
    return { pageData, isAdmin };
  } catch (error) {
    console.error("Error fetching page:", error);
    throw error;
  }
};

// Akcje do zapisu danych podstrony
export const actions: Actions = {
    save: async ({ request, params, fetch }) => {
      const id = params.id !== "new" ? parseInt(params.id, 10) : null;
      const formData = await request.formData();
  
      const name = formData.get("name") as string;
      const content = formData.get("content") as string;
      const raw_content = formData.get("raw_content") as string;
  
      if (!name || !content || !raw_content) {
        return json({ error: "Missing fields" }, { status: 400 });
      }
  
      try {
        const method = id ? "PUT" : "POST";
        const url = "/api/pages";
  
        const body = JSON.stringify({
          ...(id && { id }), // Dodaj id tylko dla PUT
          name,
          content,
          raw_content,
        });
  
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body,
        });
  
        if (!response.ok) {
          throw new Error(`Failed to ${id ? "update" : "create"} page via API`);
        }
  
        return json({ success: true });
      } catch (error) {
        console.error(`Error saving page via API:`, error);
        return json({ error: "Failed to save page" }, { status: 500 });
      }
    },
  };
  
