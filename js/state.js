// js/state.js single source of truth. The DOM never stores state.

export const state = {
    query: 'nebula',          // current search term
    page: 1,                  // current gallery page (NASA pages start at 1)
    totalHits: 0,             // total results for current query (from API metadata)
    entries: [],              // journal entries loaded from MockAPI
    selectedFragment: null,   // the Fragment object the user clicked (for the entry form)
    editingId: null,          // null = creating; an id = editing that entry
};