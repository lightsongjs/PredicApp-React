# Deployment Guide - PredicApp React

## Production Build Complete ✅

The application has been successfully built for production:
- **Build size**: 251.78 KB (gzipped: 79.66 KB)
- **CSS size**: 22.79 KB (gzipped: 4.83 KB)
- **Build output**: `dist/` directory

## Quick Start

### Local Development
```bash
npm install
npm run dev
```
Access at: http://localhost:5173/

### Production Build
```bash
npm run build
npm run preview
```

## Deployment Options

### Option 1: Cloudflare Pages (Recommended)

#### Via GitHub
1. Push your code to GitHub repository
2. Go to Cloudflare Pages dashboard
3. Click "Create a project"
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
   - **Node version**: 18 or higher

#### Direct Upload (Wrangler)
```bash
# Install Wrangler CLI (if not already installed)
npm install -g wrangler

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name predicapp
```

### Option 2: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Build settings:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Option 3: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

Build settings:
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### Option 4: Static File Hosting (AWS S3, Azure, etc.)

Simply upload the contents of the `dist/` folder to your static hosting service.

## Environment Configuration

No environment variables are currently required. All sermon URLs are hardcoded in `src/data/sermons.ts`.

To add environment variables in the future:
1. Create `.env` file in project root
2. Prefix variables with `VITE_` (e.g., `VITE_API_URL`)
3. Access in code with `import.meta.env.VITE_API_URL`

## Custom Domain Setup

### Cloudflare Pages
1. Go to your project in Cloudflare Pages
2. Click "Custom domains"
3. Add your domain (e.g., `predicileparintelui.ro`)
4. Follow DNS setup instructions
5. SSL certificate is automatic

### Other Providers
Follow your provider's documentation for custom domain setup. Most providers offer automatic SSL certificates via Let's Encrypt.

## Performance Optimization

### Current Performance
- ✅ Gzipped JavaScript: 79.66 KB
- ✅ Gzipped CSS: 4.83 KB
- ✅ Total page size: <85 KB
- ✅ Lighthouse score: Expected 90+

### Future Optimizations
- [ ] Enable brotli compression on server
- [ ] Add service worker for offline support (PWA)
- [ ] Implement code splitting for routes
- [ ] Add image optimization (WebP format)
- [ ] Enable HTTP/3 on CDN

## CDN & Caching

### Cloudflare Pages (Automatic)
- Automatic CDN distribution
- Edge caching
- DDoS protection
- Analytics included

### Recommended Cache Headers
```
Cache-Control: public, max-age=31536000, immutable
```
For static assets in `/assets/`

```
Cache-Control: no-cache, must-revalidate
```
For `index.html`

## Audio Streaming

Audio files are served from Cloudflare R2:
```
https://prediciduminica-r2.lightsongjs.workers.dev/audio/[filename].mp3
```

### CORS Configuration
Ensure R2 bucket has CORS enabled for your domain:
```json
{
  "AllowedOrigins": ["https://predicileparintelui.ro"],
  "AllowedMethods": ["GET", "HEAD"],
  "AllowedHeaders": ["Range"],
  "ExposeHeaders": ["Content-Length", "Content-Range"]
}
```

## Monitoring

### Recommended Tools
- **Cloudflare Analytics** - Built-in with Cloudflare Pages
- **Google Analytics** - Add to `index.html` if needed
- **Sentry** - Error tracking (optional)

### Health Check
Monitor:
- `/` - Homepage loads
- `/player/s004` - Player page loads
- Audio URLs return 200 OK

## Rollback

### Cloudflare Pages
- Go to "Deployments" tab
- Click "Rollback" on any previous deployment

### Git-based Deployments
```bash
git revert HEAD
git push
```

## Post-Deployment Checklist

- [ ] Visit deployed URL and test homepage
- [ ] Click on featured sermon and verify player loads
- [ ] Test audio playback
- [ ] Test skip forward/backward
- [ ] Test volume control
- [ ] Test progress bar seek
- [ ] Navigate to Library page
- [ ] Test on mobile device
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Verify SSL certificate is active
- [ ] Check Lighthouse performance score

## Support

For deployment issues:
- Check build logs in your deployment platform
- Verify all dependencies are installed
- Ensure Node.js version is 18+
- Check that `dist/` folder was generated correctly

## Security

### Headers to Add (Optional)
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

Most hosting providers add these automatically.

## Future: PWA Support

To enable offline support:
1. Install `vite-plugin-pwa`
2. Add service worker configuration
3. Add `manifest.json`
4. Update icons in `/public`

## Estimated Costs

### Cloudflare Pages
- **Free tier**: 500 builds/month, unlimited bandwidth
- Perfect for this project

### Cloudflare R2
- **Free tier**: 10GB storage, 10 million reads/month
- More than sufficient for sermon audio

### Total Monthly Cost
**$0** (within free tier limits)

## Contact

For deployment support, contact the development team.
