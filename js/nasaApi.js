import { NASA_API_KEY, NASA_IMAGES_BASE_URL } from './config.js';

export async function searchImages(query = 'earth', page = 1) {
    // 1. Build the NASA API URL using the URL class
    const nasaUrl = new URL(`${NASA_IMAGES_BASE_URL}/search`);

    // 2. Use searchParams to safely append query strings
    nasaUrl.searchParams.set('q', query);
    nasaUrl.searchParams.set('media_type', 'image');
    nasaUrl.searchParams.set('page', page);

    // 3. Fetch from the constructed URL
    const response = await fetch(nasaUrl.toString());

    if (!response.ok) {
        throw new Error(`NASA search failed: ${response.status}`);
    }

    // 4. Parse and return the data
    const data = await response.json();

    // 5. Clean: filter + map into Fragment shape
    const results = data.collection.items
        .filter(item => item.links?.[0]?.href)
        .map(item => ({
            nasaId: item.data[0].nasa_id,
            title: item.data[0].title,
            description: item.data[0].description,
            imageUrl: item.links[0].href,
        }));
    // 6. Return the clean shape
    return { results, totalHits: data.collection.metadata.total_hits };
}   //build URL -> set params -> fetch -> !ok throw -> parse into data -> transform data into results -> return the clean object. 