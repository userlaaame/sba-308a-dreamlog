// DOM references grabbed once, reused everywhere
const gallery = document.getElementById('gallery');
const status = document.getElementById('status');

// renderGallery(results): clear the gallery, build one card per result,
// and commit them all to the DOM in a single append.
export function renderGallery(results) {
    // 1. Clear whatever was there before
    gallery.replaceChildren();

    // 2. Build all cards off-screen in a fragment (no reflow per card)
    const fragment = document.createDocumentFragment();

    for (const { imageUrl, title } of results) {
        const card = document.createElement('article');
        card.className = 'card';

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

// setStatus(msg) / clearStatus(): tiny helpers used everywhere later
export function setStatus(msg) {
    status.textContent = msg;
}

export function clearStatus() {
    status.textContent = '';
}
