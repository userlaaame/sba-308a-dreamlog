// Import the API + UI helpers
import { searchImages } from './nasaApi.js';
import { renderGallery, setStatus } from './ui.js';

// App state the single source of truth for what's on screen
const state = {
    query: 'earth',
    page: 1,
    totalHits: 0,
    results: [],   // the items currently rendered looked up on card click
};

// Race guard: each call claims a token; only the newest one is allowed
// to write to the DOM, so a slow earlier request can't clobber a fast later one.
let requestToken = 0;

// loadPage(): fetch the current query/page and render it.
async function loadPage() {
    const token = ++requestToken;           // 1. claim this request
    setStatus('retrieving...');
    try {
        const data = await searchImages(state.query, state.page);
        if (token !== requestToken) return; // 2. a newer request started bail
        state.totalHits = data.totalHits;
        state.results = data.results;
        renderGallery(data.results);
        setStatus('');
    } catch (error) {
        if (token !== requestToken) return; // 3. stale error ignore it
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

// Gallery clicks: ONE delegated listener on the container, not one per card.
// Cards are re-created on every render, so binding here survives re-renders.
document.getElementById('gallery').addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (!card) return;   // clicked the gap between cards ignore
    const item = state.results.find(r => r.nasaId === card.dataset.nasaId);
    if (!item) return;
    console.log('card clicked:', item);   // TODO: open entry dialog for this item
});

// Initial load show the default query right away
loadPage();
