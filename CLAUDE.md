# Project Notes

## Release / Deployment

**Live site: https://predici.pages.dev**

Cloudflare Pages is connected to GitHub. **Pushing to `master` IS the release** — it
triggers the build and deploy automatically. Do not run `npm run build` locally first;
Pages does it. There is no staging environment, so anything pushed to `master` is live
within a minute or two.

### Release steps

```bash
npx tsc -b                 # must be clean; 3 pre-existing eslint errors are expected
git status --short          # check nothing unwanted is staged
git add -A
git commit                  # conventional commits: fix:, feat:, refactor:, docs:, chore:
git push origin master     # this deploys
```

### Verifying the deploy actually landed

Do not assume the push deployed, and do not trust a browser reload (cache). Fetch the
served bundle and grep it for a string that only exists in the new code:

```js
const html = await (await fetch('https://predici.pages.dev', { cache: 'no-store' })).text();
const js = html.match(/src="([^"]+\.js)"/)[1];             // e.g. /assets/index-XXXX.js
const code = await (await fetch('https://predici.pages.dev' + js, { cache: 'no-store' })).text();
console.log(code.includes('some string added in this change'));
```

The bundle minifies imported JSON to a JS object literal with **unquoted** keys
(`{metadata:{totalFiles:345`), so it cannot be `JSON.parse`d. Check for quoted string
*values* (titles, dates, ids), not for `"key":` patterns. Beware of reading fields from
a character window around a match — object boundaries are not where you expect and
fields bleed in from neighbouring entries.

### Don't get lost looking for the URL

The live URL is `predici.pages.dev` and nowhere else. Previously `learnings.md` claimed
`predicapp-react.pages.dev` and `DEPLOYMENT.md` mentioned `predicileparintelui.ro`;
neither resolves. Both have been corrected — if you find another URL in a doc, distrust
the doc, not this file.

## Audio Storage

Audio files are stored in **Cloudflare R2** bucket `prediciduminica`, served via a Worker at `https://prediciduminica-r2.lightsongjs.workers.dev/`.

- All audio files are `.opus` format, stored under the `audio/` prefix
- The sermon catalog is `complete-sermon-library.json` at the project root
- Use `list-r2.cjs` to list all files in R2 (uses Cloudflare API with local wrangler OAuth token)
- Use `wrangler r2 object put/delete ... --remote` to manage R2 objects (always use `--remote` flag)

**Never conclude a file is missing from a local listing.** `r2-files.txt` is a gitignored
local snapshot that goes stale as soon as files are re-uploaded or renamed — it once made
five perfectly working audio files look broken. To check whether a file exists, HEAD the
worker URL:

```js
const r = await fetch('https://prediciduminica-r2.lightsongjs.workers.dev/audio/' + encodeURIComponent(name), { method: 'HEAD' });
```

Also note `fileSize` in the catalog is stale for many entries (the audio was re-encoded
after the catalog was generated) and `duration` values are rounded estimates, not measured
durations — the player uses `duration` as `knownDuration`.

## Filenames

Avoid `...` (multiple dots) in R2 object keys — Cloudflare's API and WAF block uploads with consecutive dots in the path. Use dashes instead.
