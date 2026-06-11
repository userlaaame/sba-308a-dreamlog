import { MOCKAPI_BASE_URL } from './config.js';

// The MockAPI resource that holds journal entries
const ENTRIES_URL = `${MOCKAPI_BASE_URL}/entries`;

// getEntries(): GET the full list
export async function getEntries() {
    const response = await fetch(ENTRIES_URL);
    if (!response.ok) {
        throw new Error(`Failed to load entries: ${response.status}`);
    }
    return await response.json();
}

// createEntry(data): POST a new entry
export async function createEntry(data) {
    const response = await fetch(ENTRIES_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // #1 silent failure if missing
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`Failed to create entry: ${response.status}`);
    }
    return await response.json();
}

// updateEntry(id, data): PUT an existing entry
export async function updateEntry(id, data) {
    const response = await fetch(`${ENTRIES_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`Failed to update entry: ${response.status}`);
    }
    return await response.json();
}

// deleteEntry(id): DELETE an entry
export async function deleteEntry(id) {
    const response = await fetch(`${ENTRIES_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Failed to delete entry: ${response.status}`);
    }
    return await response.json();
}
