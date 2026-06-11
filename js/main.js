// Import the API + UI helpers
import { searchImages } from './nasaApi.js';
import { renderGallery, setStatus } from './ui.js';

// App state the single source of truth for what's on screen
const state = {
    query: 'earth',
    page: 1,
    totalHits: 0,
};

// Race guard: each call claims a token; only the newest one is allowed
// to write to the DOM, so a slow earlier request can't clobber a fast later one.
let latestToken = 0;

// loadPage(): fetch the current query/page and render it.
async function loadPage() {
    const token = ++latestToken;           // 1. claim this request
    setStatus('retrieving...');
    try {
        const data = await searchImages(state.query, state.page);
        if (token !== latestToken) return; // 2. a newer request started bail
        state.totalHits = data.totalHits;
        renderGallery(data.results);
        setStatus('');
    } catch (error) {
        if (token !== latestToken) return; // 3. stale error ignore it
        setStatus(error.message);
    }
}

// --- Wire up the controls ---
const searchInput = document.getElementById('search-input');

document.getElementById('search-btn').addEventListener('click', () => {
    state.query = searchInput.value;
    state.page = 1;
    loadPage();
});

document.getElementById('next-btn').addEventListener('click', () => {
    state.page++;
    loadPage();
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (state.page > 1) state.page--;
    loadPage();
});

// Initial load show the default query right away
loadPage();
