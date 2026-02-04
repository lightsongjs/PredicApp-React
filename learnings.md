# Deployment Learnings

## Quick Deploy (After Initial Setup)

**One-liner to build and deploy:**
```bash
npm run build && npx wrangler pages deploy dist --project-name=predicapp-react --commit-dirty=true
```

**With git commit:**
```bash
git add -A && git commit -m "Your commit message" && git push && npm run build && npx wrangler pages deploy dist --project-name=predicapp-react --commit-dirty=true
```

---

## Deploying to Cloudflare Pages via CLI

### Initial Setup & Deployment

**1. Create GitHub Repository**
```bash
gh repo create PredicApp-React --public --source=. --remote=origin --description="Orthodox Sermon Streaming App - PredicApp React"
```

**2. Push Code to GitHub**
```bash
git push -u origin master
```

**3. Build the Project**
```bash
npm run build
```

**4. Create Cloudflare Pages Project**
```bash
npx wrangler pages project create predicapp-react --production-branch=master
```

**5. Deploy to Cloudflare Pages**
```bash
npx wrangler pages deploy dist --project-name=predicapp-react
```

### Deployment URLs

- **Production URL**: https://predicapp-react.pages.dev
- **Deployment-specific URL**: https://[deployment-id].predicapp-react.pages.dev (may have SSL issues)
- Always use the main production URL for testing

### Re-deploying Changes

For subsequent deployments after making changes:

```bash
# Build the latest changes
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name=predicapp-react
```

### Automatic Deployments (Optional)

To enable automatic deployments on every git push:

1. Go to https://dash.cloudflare.com/
2. Navigate to **Workers & Pages**
3. Click on **predicapp-react** project
4. Go to **Settings** → **Builds & deployments**
5. Click **Connect to Git** and select your GitHub repository

Once connected, every push to the `master` branch will automatically trigger a build and deployment.

### Useful Commands

**List Cloudflare Pages Projects**
```bash
npx wrangler pages project list
```

**List Deployments**
```bash
npx wrangler pages deployment list --project-name=predicapp-react
```

**Check Wrangler Version**
```bash
npx wrangler --version
```

### Testing the Deployed Site

**Update Playwright Config**
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    baseURL: 'https://predicapp-react.pages.dev',
  },
  // Remove webServer section for testing deployed site
});
```

**Run Tests**
```bash
npx playwright test
```

### Notes

- The Vite build output directory is `dist`
- Cloudflare Pages automatically serves the built files
- SSL is handled automatically by Cloudflare
- Use the main domain (predicapp-react.pages.dev) for stable access
- Deployment-specific subdomains may have SSL issues initially

---

## Opus Audio File Playback Issues

**Date:** February 2026
**Time spent debugging:** ~1 day

### The Problem

When playing Opus audio files in the web app, we experienced:
1. **First 3-4 seconds looping** - The audio would repeat the beginning before eventually playing correctly
2. **Wrong duration displayed** - Files showing 16-24 seconds instead of actual 30+ minutes
3. **Erratic buffering behavior** - Browser struggling to buffer and seek correctly

### Root Cause

**Opus files were missing proper Ogg container duration metadata (granule positions).**

When Opus files are created without proper metadata in the Ogg container, browsers cannot determine:
- The total duration of the file
- How to properly buffer the stream
- Where to seek within the file

This causes Chrome/browsers to:
1. Report incorrect duration (based on initial buffered data only)
2. Loop the beginning while trying to figure out the stream
3. Continuously update duration as more data is buffered

### Symptoms to Watch For

```javascript
// In browser console, you'll see duration constantly changing:
[opus] Duration changed: 16
[opus] Duration changed: 24.123
[opus] Duration changed: 32.456
// ... keeps increasing as browser buffers more

// Compare to MP3 which reports correct duration immediately:
[mp3] Duration changed: 1683.72  // Correct from the start
```

### The Solution

**Re-encode Opus files with FFmpeg to add proper metadata:**

```bash
ffmpeg -y -i input.opus -c:a libopus -b:a 64k -vbr on -application audio output.opus
```

Parameters explained:
- `-c:a libopus` - Use the libopus encoder (writes proper Ogg metadata)
- `-b:a 64k` - 64kbps bitrate (good for speech/sermons)
- `-vbr on` - Variable bitrate for better quality
- `-application audio` - Optimize for general audio (vs voip)

### Batch Re-encoding Script

See `reencode-opus.mjs` in this repository for a Node.js script that:
- Processes all Opus files in a directory
- Skips already-processed files (resumable)
- Reports progress and file sizes

### How to Test

1. Check duration metadata:
```bash
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 file.opus
```

2. Compare in browser - create a test HTML page:
```html
<audio id="test" controls src="file.opus"></audio>
<script>
  const audio = document.getElementById('test');
  audio.addEventListener('loadedmetadata', () => {
    console.log('Duration:', audio.duration);
    // Good: Shows correct duration (e.g., 2053.76 for 34min file)
    // Bad: Shows small number (e.g., 16) that keeps changing
  });
</script>
```

### Prevention

When converting audio to Opus format:

1. **Always use FFmpeg with libopus** - Don't use tools that create incomplete Ogg containers
2. **Verify duration after conversion** - Use ffprobe to check the duration is correct
3. **Test playback** - Ensure the file plays without looping at the start

### Code Changes Made

**`src/hooks/useAudio.ts`**
- Added `durationchange` event listener to track duration updates
- Modified `play()` to wait for `canplaythrough` event before playing
- Added race condition protection with loading state tracking

**`src/components/player/AudioPlayer.tsx`**
- Added `parseDuration()` function to parse sermon metadata duration
- Use sermon metadata duration for display (more reliable than Opus stream duration)
- Fall back to audio element duration if metadata unavailable

### File Size Impact

Re-encoding typically increases file size by ~20-30% due to proper metadata being added:
- Original: 7.37MB → Re-encoded: 9.22MB
- Original: 8.50MB → Re-encoded: 10.67MB

This is acceptable because:
1. Files actually work correctly now
2. Still much smaller than MP3 equivalents
3. Proper seeking and duration display

### Key Takeaway

**Opus files need proper Ogg container metadata to work correctly in browsers. Always re-encode with FFmpeg using libopus if you encounter duration/playback issues.**

---

## Cloudflare R2 Worker Range Request Bug (Critical)

**Date:** February 2026
**Time spent debugging:** ~2 hours

### The Problem

Audio would **loop the first ~3 seconds** endlessly while the progress bar kept advancing. Seeking appeared to work (206 responses returned), but audio kept repeating the beginning.

### Root Cause

**The R2 Worker was returning the FULL file body while claiming to return a partial range.**

```js
// ❌ WRONG - Returns full file, lies about Content-Range
const object = await env.R2_BUCKET.get(key);  // Gets FULL object

if (rangeHeader) {
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  return new Response(object.body, { status: 206 });  // Body is FULL, not sliced!
}
```

The browser trusted the `Content-Range` header but received the same initial bytes repeatedly, causing the decoder to replay the same Opus pages.

### Why This Is Subtle

- HTTP response returns `206 Partial Content` ✅
- `Content-Range` header looks correct ✅
- `Content-Length` header looks correct ✅
- But the **body is wrong** - it's the full file, not the requested slice

### The Solution

**R2 requires requesting the range WHEN FETCHING, not after:**

```js
// ✅ CORRECT - Request the range from R2 directly
const rangeOptions = rangeHeader ? {
  offset: start,
  length: end - start + 1
} : undefined;

const object = await env.R2_BUCKET.get(key, { range: rangeOptions });

// Now object.body contains ONLY the requested bytes
return new Response(object.body, { status: 206, headers });
```

### Headers Checklist for Audio Streaming

For proper audio seeking, ALL responses must include:

| Header | Non-Range Request | Range Request |
|--------|-------------------|---------------|
| `Accept-Ranges` | `bytes` | `bytes` |
| `Content-Length` | Full file size | Partial size (`end - start + 1`) |
| `Content-Range` | Not needed | `bytes start-end/total` |
| Status Code | `200` | `206` |

### How to Verify Range Requests Work

```bash
# Request bytes 500000 onwards
curl -I -H "Range: bytes=500000-" "https://your-worker.workers.dev/audio/file.opus"

# Verify response:
# - Status: 206 Partial Content
# - Content-Range: bytes 500000-XXXXX/TOTAL (NOT bytes 0-...)
# - Content-Length: TOTAL - 500000 (NOT full file size)
```

### Why Opus Is More Sensitive Than MP3

- **MP3**: Frame-based, can recover mid-stream, more forgiving
- **Opus in Ogg**: Page-granule based, strongly dependent on correct byte offsets
- Replaying the same Opus pages = audible loop, while MP3 might sound like stuttering

### Key Takeaway

**When serving audio from R2 with range support, you MUST use `env.R2_BUCKET.get(key, { range: { offset, length } })` to fetch only the requested bytes. You cannot slice the body after fetching the full object.**

---

## CSS Specificity with Tailwind Custom Classes

**Date:** February 2026

### The Problem

Play button icon disappeared on hover - background turned red (primary) but icon stayed red too, making it invisible.

### Root Cause

Custom CSS class `.text-primary` in `index.css` was overriding Tailwind's generated `group-hover/btn:text-white` utility due to CSS specificity or load order.

### The Solution

Two approaches:

1. **Use a dedicated class with `!important`** (what we did):
```css
/* index.css */
.group:hover .play-btn span,
.play-btn:hover span {
  color: white !important;
}
```

Then add `play-btn` class to all play buttons.

2. **Avoid mixing custom CSS classes with Tailwind utilities** on the same property.

### Key Takeaway

**When mixing custom CSS with Tailwind, be aware of specificity conflicts. Using a dedicated class with `!important` for critical hover states is a reliable solution.**
