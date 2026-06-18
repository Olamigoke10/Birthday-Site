# ✦ Birthday Memory Site

A beautiful, romantic birthday memory website built with vanilla HTML/CSS/JS, deployable on Vercel in minutes.

## Features

- **Hero** — animated falling petals, elegant typography, smooth scroll
- **Handwritten Letters** — envelope-style card gallery; drop scanned images into `assets/letters/`
- **Photo Memories** — filterable masonry grid with lightbox; drop photos into `assets/photos/`
- **Music Player** — simulated playlist player (wire up real audio files in `script.js`)
- **AI Guest Book** — messages are polished by `claude-sonnet-4-6` via a secure serverless proxy

---

## Quick Start

```bash
# No build step needed — open directly in a browser for local preview
open index.html

# Or serve with any static server
npx serve .
```

---

## Deploy to Vercel

### 1. Add your API key

In the [Vercel dashboard](https://vercel.com):  
`Project → Settings → Environment Variables`

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` |

### 2. Deploy

```bash
npm i -g vercel
vercel
```

That's it. The `/api/polish` serverless function picks up the env var automatically.

---

## Adding Content

### Letters
Drop scanned letter images into `assets/letters/`. Update the `<img src="...">` paths in `index.html` for each `.letter-card`.

### Photos
Drop memory photos into `assets/photos/`. Update `<img src="...">` paths in the photos grid. Each card has a `data-cat` attribute for filtering: `travel`, `celebrations`, or `everyday`.

### Music
The player is currently a simulated demo. To connect real audio files:
1. Add `.mp3` files to `assets/`
2. In `script.js`, add an `<audio>` element per track and hook the play/pause/seek controls to it.

---

## Project Structure

```
birthday-site/
├── index.html          # All sections (Hero → Letters → Photos → Music → Guest Book)
├── style.css           # Design system, all component styles, responsive breakpoints
├── script.js           # Interactions, music player, photo filter, guest book logic
├── vercel.json         # Build config: static files + Node serverless functions
├── .env.example        # Template — copy to .env for local testing
├── api/
│   └── polish.js       # Serverless function: proxies Anthropic API (key stays server-side)
└── assets/
    ├── letters/        # Drop scanned letter images here
    └── photos/         # Drop memory photos here
```

---

## Customisation Tips

- **Name & date** — search `My Darling` and `June 18` in `index.html` to update
- **Palette** — all colours are CSS custom properties at the top of `style.css`
- **Fonts** — swap Google Fonts links in `<head>` and update `--font-display` / `--font-body`
- **Track list** — edit the `TRACKS` array in `script.js`
- **AI tone** — adjust `systemPrompt` in `api/polish.js` to change how messages are polished

---

*Made with love · claude-sonnet-4-6*
