// Import the API + UI helpers
import { searchImages } from './nasaApi.js';
import { getEntries, createEntry, updateEntry, deleteEntry } from './journalApi.js';
import { renderGallery, renderEntries, setStatus } from './ui.js';

// App state the single source of truth for what's on screen
const state = {
    query: 'earth',
    page: 1,
    totalHits: 0,
    results: [],            // gallery items currently rendered — looked up on card click
    entries: [],            // saved journal entries from the API
    selectedFragment: null, // the NASA item a new entry is being created from
    editingId: null,        // id of the entry being edited, or null when creating
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
        setStatus('The archive is unreachable. Fragment lost.');
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

// --- Entry dialog references ---
const dialog = document.getElementById('entry-form-dialog');
const form = document.getElementById('entry-form');
const titleInput = document.getElementById('entry-title');
const bodyInput = document.getElementById('entry-body');
const classificationInput = document.getElementById('entry-classification');

// closeDialog(): close + reset everything so the next open starts clean.
function closeDialog() {
    dialog.close();
    form.reset();
    state.editingId = null;
    state.selectedFragment = null;
}

// Gallery clicks: ONE delegated listener on the container, not one per card.
// Cards are re-created on every render, so binding here survives re-renders.
document.getElementById('gallery').addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (!card) return;   // clicked the gap between cards ignore
    const item = state.results.find(r => r.nasaId === card.dataset.nasaId);
    if (!item) return;
    // Card click → start a NEW entry from this fragment
    state.selectedFragment = item;
    state.editingId = null;
    form.reset();
    dialog.showModal();
});

// Entry list clicks: ONE delegated listener handling both Edit and Delete.
document.getElementById('entries-list').addEventListener('click', async (event) => {
    const article = event.target.closest('.entry');
    if (!article) return;
    const id = article.dataset.id;

    if (event.target.closest('.edit-btn')) {
        // Edit → prefill the form from the entry, remember which one we're editing
        const entry = state.entries.find(e => e.id === id);
        if (!entry) return;
        state.editingId = id;
        state.selectedFragment = null;
        titleInput.value = entry.title;
        bodyInput.value = entry.body;
        classificationInput.value = entry.classification;
        dialog.showModal();
    } else if (event.target.closest('.delete-btn')) {
        // Delete → remove on the server, then drop from state and re-render
        try {
            await deleteEntry(id);
            state.entries = state.entries.filter(e => e.id !== id);
            renderEntries(state.entries);
        } catch (error) {
            setStatus('The fragment resists deletion. It remains contained.');
        }
    }
});

// Form submit: branches create-vs-update on state.editingId.
form.addEventListener('submit', async (event) => {
    event.preventDefault();   // CRITICAL: a plain <form> would reload the page and wipe state

    // The fields the user typed
    const fields = {
        title: titleInput.value,
        body: bodyInput.value,
        classification: classificationInput.value,
    };

    try {
        if (state.editingId) {
            // UPDATE: merge over the existing entry so PUT doesn't drop
            // nasaId / imageUrl / createdAt (PUT replaces the whole record).
            const existing = state.entries.find(e => e.id === state.editingId);
            const updated = await updateEntry(state.editingId, { ...existing, ...fields });
            const idx = state.entries.findIndex(e => e.id === state.editingId);
            if (idx !== -1) state.entries[idx] = updated;
        } else {
            // CREATE: combine the typed fields with the selected fragment + a timestamp
            const newEntry = {
                ...fields,
                nasaId: state.selectedFragment?.nasaId,
                imageUrl: state.selectedFragment?.imageUrl,
                createdAt: new Date().toISOString(),
            };
            const created = await createEntry(newEntry);
            state.entries.push(created);
        }
        renderEntries(state.entries);
        closeDialog();   // clears editingId / selectedFragment after
    } catch (error) {
        setStatus('Containment failed. The entry was not logged.');
    }
});

// New Entry button → open a blank dialog (no fragment, not editing)
document.getElementById('new-entry-btn').addEventListener('click', () => {
    state.selectedFragment = null;
    state.editingId = null;
    form.reset();
    dialog.showModal();
});

// Cancel just closes + clears, no save
document.getElementById('entry-cancel-btn').addEventListener('click', closeDialog);

// --- Startup ---
// Promise.all here because the gallery and the saved entries are INDEPENDENT
// requests and we want BOTH before the first paint — neither supersedes the other,
// so we fire them together and wait for the pair.
// (Contrast loadPage's latest-wins token guard: rapid prev/next clicks SUPERSEDE
//  each other — there we only want the LATEST response, not all of them. Different
//  problem, different tool: Promise.all for "want both", token guard for "want latest".)
(async () => {
    setStatus('retrieving...');
    try {
        const [search, entries] = await Promise.all([
            searchImages(state.query, state.page),
            getEntries(),
        ]);
        state.totalHits = search.totalHits;
        state.results = search.results;
        state.entries = entries;
        renderGallery(search.results);
        renderEntries(entries);
        setStatus('');
    } catch (error) {
        setStatus('The archive is unreachable. Fragment lost.');
    }
})();
