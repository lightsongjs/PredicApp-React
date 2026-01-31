# Next Steps / Future Improvements

## 1. Audio Compression with Opus 48 kbps

**Goal**: Reduce audio file sizes by 75-85% while maintaining excellent speech quality

**Benefits:**
- Original MP3 (192 kbps): ~25 MB for 30-minute sermon
- Opus (48 kbps): ~4 MB for 30-minute sermon (84% smaller!)
- Quality: Excellent for speech content
- Universal browser support (all modern browsers)

**Implementation Steps:**
1. Install FFmpeg (audio conversion tool)
2. Create batch conversion script to convert all MP3s to Opus
3. Update sermon data to use `.opus` files instead of `.mp3`
4. Upload compressed files to R2 storage
5. Update audio player to handle Opus format (already supported in HTML5 audio)

**FFmpeg conversion command:**
```bash
ffmpeg -i input.mp3 -c:a libopus -b:a 48k output.opus
```

**Expected Results:**
- 75-85% reduction in storage and bandwidth costs
- Faster loading times for users
- No noticeable quality loss for sermon audio
- Better mobile experience with smaller files

---

## 2. Auto-Deploy from GitHub

**Goal**: Automatically deploy to Cloudflare Pages when pushing to GitHub

**Steps:**
1. Go to https://dash.cloudflare.com/
2. Workers & Pages → predicapp-react
3. Settings → Builds & deployments
4. Connect to Git → Select GitHub repo
5. Configure build settings:
   - Build command: `npm run build`
   - Build output: `dist`

**Benefits:**
- No manual deployment needed
- Automatic preview deployments for branches
- Easier collaboration

---

## 3. Update Sermon Images

**Goal**: Replace generic Unsplash photos with proper Orthodox icons

**Resources:**
- [Wikimedia Commons - Pharisee and Publican](https://commons.wikimedia.org/wiki/Category:Pharisee_and_the_Publican)
- [Wikimedia Commons - Icons of Last Judgment](https://commons.wikimedia.org/wiki/Category:Icons_of_Last_Judgment)
- [Wikimedia Commons - Expulsion of Adam and Eve](https://commons.wikimedia.org/wiki/Category:Expulsion_of_Adam_and_Eve)

**Next Actions:**
- Browse Wikimedia Commons for appropriate Orthodox icons
- Download high-quality images
- Update sermon data with new image URLs
- Ensure images are properly licensed (public domain/CC)
