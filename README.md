# Dream Log

*A dreamcore field journal for anomalous imagery.*

Dream Log is a single-page web application that treats NASA's public image archive as a collection of **dream fragments** nebulae, auroras, full-disc Earth shots, eclipse passes and lets you catalog them the way the SCP Foundation would: in clinical, containment-style journal entries with a classification level. Browse and search the archive, save a fragment, and log what it looked like *in the dream*.

Built for **Per Scholas SBA 308A: JavaScript Web Application**.

## What it does

- **Search & browse** the NASA Image and Video Library with paginated gallery results.
- **Daily fragment** pulled from NASA's Astronomy Picture of the Day (APOD).
- **Dream journal (full CRUD):** attach an entry to any image title, body, and a classification tag (`Safe` / `Euclid` / `Keter`, repurposed as mood levels). Entries are created, edited, and deleted against a hosted REST resource.
- **Dreamcore presentation:** film grain, bloom, washed gradients, slow dissolves, and SCP-document typography (redaction bars included).

### Stretch features (if time allows)
- **Related Anomalies panel** — keywords from the active journal entry are searched against the SCP Wiki via the community-run [Crom GraphQL API](https://crom.avn.sh/), demonstrating a second API paradigm (GraphQL) alongside REST. SCP Wiki content is licensed [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/); credit to the SCP Foundation community. *Thanks Quinn for the guidance*
- **Spiral-to-list gallery layout** inspired by scroll-driven portfolio design.

## APIs used

| API | Role | Methods |
|---|---|---|
| [NASA Image and Video Library](https://images-api.nasa.gov) (`/search`) | image search + pagination | GET |
| [NASA APOD](https://api.nasa.gov) | daily featured image | GET |
| [MockAPI.io](https://mockapi.io) (`entries` resource) | persistent journal storage | GET, POST, PUT, DELETE |
| [Crom](https://crom.avn.sh) *(stretch)* | SCP Wiki search | POST (GraphQL query — semantically a read) |

## Tech notes

- **Vanilla JavaScript** with the native `fetch` API no frameworks, no Axios.
- **ES modules:** code is organized across separate module files (`nasaApi`, `journalApi`, `ui`, `state`, `main`) using `import`/`export`.
- **Async patterns:** `async/await` throughout; `Promise.all` hydrates the gallery and saved journal concurrently on startup.
- **Event-loop safety:** rapid pagination can let a slow earlier response overwrite a newer one. A latest-wins request token guards against this race condition — stale responses are dropped instead of rendered.
- **Error handling:** every API call is wrapped in `try/catch` with visible UI fallbacks; APOD's occasional `media_type: "video"` days are handled with an embed branch instead of a broken `<img>`.

## Running locally

ES modules will not load over `file://` — the app must be served over HTTP.

1. Clone the repo and `cd` into it.
2. Get a free NASA API key at [api.nasa.gov](https://api.nasa.gov/) (instant email) and place it in `js/config.js`. The key committed here, if any, is rate-limited and for grading convenience only.
3. Serve the folder with any static server, e.g.:
   ```
   python -m http.server 8000
   ```
   or the VS Code **Live Server** extension.
4. Open `http://localhost:8000`.

## Project status

🚧 In active development — see commit history for progress. Build order: core requirements first (API fetch, paginated search, CRUD, modules, error handling), presentation second, stretch features last.

## Reflection

*(To be completed at submission — planning takeaways, hardest requirement, and what I'd add with more time.)*
