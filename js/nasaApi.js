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
    return await response.json();
}   