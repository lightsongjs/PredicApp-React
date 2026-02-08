# Project Notes

## Deployment

This app is deployed via **Cloudflare Pages**, which is connected to GitHub. Pushing to `master` automatically triggers a build and deploy. There is no need to run `npm run build` locally before deploying — just commit and push.

## Audio Storage

Audio files are stored in **Cloudflare R2** bucket `prediciduminica`, served via a Worker at `https://prediciduminica-r2.lightsongjs.workers.dev/`.

- All audio files are `.opus` format, stored under the `audio/` prefix
- The sermon catalog is `complete-sermon-library.json` at the project root
- Use `list-r2.cjs` to list all files in R2 (uses Cloudflare API with local wrangler OAuth token)
- Use `wrangler r2 object put/delete ... --remote` to manage R2 objects (always use `--remote` flag)

## Filenames

Avoid `...` (multiple dots) in R2 object keys — Cloudflare's API and WAF block uploads with consecutive dots in the path. Use dashes instead.
