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
