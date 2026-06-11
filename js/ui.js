// DOM references grabbed once, reused everywhere
const gallery = document.getElementById('gallery');
const status = document.getElementById('status');
const entriesList = document.getElementById('entries-list');

// renderGallery(results): clear the gallery, build one card per result,
// and commit them all to the DOM in a single append.
export function renderGallery(results) {
    // 1. Clear whatever was there before
    gallery.replaceChildren();

    // 2. Build all cards off-screen in a fragment (no reflow per card)
    const fragment = document.createDocumentFragment();

    for (const { nasaId, imageUrl, title } of results) {
        const card = document.createElement('article');
        card.className = 'card';
        card.dataset.nasaId = nasaId;   // lets delegated clicks identify the card

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = title;
        img.loading = 'lazy';

        const heading = document.createElement('h3');
        heading.textContent = title;

        card.append(img, heading);
        fragment.append(card);
    }

    // 3. One append at the end the only DOM write
    gallery.append(fragment);
}

// renderEntries(entries): clear #entries-list and rebuild every saved entry —
// thumb + title + classification badge + body + Edit/Delete buttons.
// Same fragment pattern: build off-screen, one append at the end.
export function renderEntries(entries) {
    entriesList.replaceChildren();

    const fragment = document.createDocumentFragment();

    for (const { id, title, body, classification, imageUrl } of entries) {
        const article = document.createElement('article');
        article.className = 'entry';
        article.dataset.id = id;   // lets delegated Edit/Delete clicks find the entry

        const thumb = document.createElement('img');
        thumb.className = 'entry-thumb';
        thumb.src = imageUrl;
        thumb.alt = title;
        thumb.loading = 'lazy';

        const heading = document.createElement('h3');
        heading.textContent = title;

        const badge = document.createElement('span');
        badge.className = `badge badge-${classification}`;
        badge.textContent = classification;

        const bodyEl = document.createElement('p');
        bodyEl.textContent = body;

        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';

        article.append(thumb, heading, badge, bodyEl, editBtn, deleteBtn);
        fragment.append(article);
    }

    entriesList.append(fragment);
}

// setStatus(msg) / clearStatus(): tiny helpers used everywhere later
export function setStatus(msg) {
    status.textContent = msg;
}

export function clearStatus() {
    status.textContent = '';
}
