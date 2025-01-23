import { redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ fetch, locals }) => {
    const session = await locals.getSession();
    const isAdmin = !!session?.user?.isAdmin;
  try {
    const response = await fetch("/api/pages");
    if (response.ok) {
      const pages = await response.json();
      console.log(pages);
      return { pages, isAdmin };
    } else {
      throw new Error("Failed to load pages");
    }
  } catch (error) {
    console.error(error);
    return { pages: [], isAdmin };
  }
};

export const actions: Actions = {
  delete: async ({ request, fetch }) => {
    const formData = await request.formData();
    const id = formData.get("id");

    if (!id) {
      return { error: "Missing ID" };
    }

    try {
      const response = await fetch(`/api/pages?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        return { success: true };
      } else {
        throw new Error("Failed to delete page");
      }
    } catch (error) {
      console.error(error);
      return { error: "Failed to delete page" };
    }
  },
};
