import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async ({ fetch, params, url }) => {
    const { id } = params;

    console.log(`id: ${id}`);

    try {
        // Użycie pełnego adresu URL
        const apiUrl = `${url.origin}/api/pages?id=${id}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            console.error('Failed to fetch pageData:', response.statusText);
            return { pageData: null };
        }

        const pageData = await response.json();
        console.log(pageData);
        return { pageData };
    } catch (error) {
        console.error("Error fetching pageData:", error);
        return { pageData: null };
    }
};