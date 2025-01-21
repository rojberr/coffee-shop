import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, params }) => {
    const { id } = params;
    console.log(`id: ${id}`)

    try {
        const response = await fetch(`/api/news/${id}`);
        if (!response.ok) {
            console.error('Failed to fetch news`:', response.statusText);
            return { news: null };
        }
        const news = await response.json();
        console.log(`news: ${JSON.stringify(news[0])}`);
        return { news };
    } catch (error) {
        console.error("Error fetching news:", error);
        return { news: null };
    }
};