# Quantum Developer Day — Static Site

A lightweight, single-page site for Quantum Developer Day. Built with plain HTML/CSS and deployable anywhere.

## Local preview

Open `index.html` in a browser, or serve locally:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy: GitHub Pages

1. Create a new GitHub repository and push these files.
2. Ensure a `.nojekyll` file exists at the repo root (included).
3. In GitHub → Settings → Pages:
   - Source: Deploy from a branch
   - Branch: `main` (or default) → `/root`
4. After a minute, your site will be live at the Pages URL.

### Custom domain
- In GitHub → Settings → Pages, add your domain (e.g., `quantumdeveloperday.com`).
- Configure DNS with a `CNAME` to `<username>.github.io` and optional `A` records per GitHub docs.

## Deploy: Netlify (recommended)

1. Netlify → New site from Git → select your repo.
2. Build command: (none). Publish directory: `/`.
3. Deploy. Assign custom domain in Netlify → Domain settings.

## Favicons & social previews

- Update `favicon.svg` (and optionally PNGs) in the project root.
- Open Graph/Twitter tags are set in `index.html`. Replace `og:image` with a 1200×630 PNG for best results.

## Editing content

All content and styles live in `index.html`. No build step required.
