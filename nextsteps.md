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

---

## 4. Standardize Sermon File Naming Convention

**Goal**: Rename all sermon audio files with a consistent, liturgically-correct naming convention

**Recommended Format**: `[Week Designation] - [Special Name] - [Year].mp3`

**Benefits:**
- Chronological sorting - files sort in calendar order
- Complete liturgical context - both week number and special name
- Easy gap detection - missing weeks are immediately visible
- Search-friendly - can search by week number OR special name
- Educational - helps users learn the Orthodox calendar structure
- App flexibility - can display either designation in UI

**Examples:**

**Pentecostarion (Post-Pascha):**
```
Duminica I după Paști - Tomii - 2019.mp3
Duminica II după Paști - Mironosițelor - 2019.mp3
Duminica III după Paști - Slăbănogului - 2019.mp3
Duminica IV după Paști - Samarinencii - 2019.mp3
Duminica V după Paști - Orbului - 2019.mp3
Duminica VI după Paști - 2019.mp3
Duminica VII după Paști - Sfinților Părinți - 2019.mp3
```

**After Pentecost (no special names):**
```
Duminica I după Rusalii - 2019.mp3
Duminica II după Rusalii - 2019.mp3
Duminica III după Rusalii - 2019.mp3
```

**Triodion (Pre-Lent) - already have special names:**
```
Duminica Vameșului și Fariseului - 2016.mp3
Duminica Fiului Risipitor - 2016.mp3
Duminica Înfricoșătoarei Judecăți - 2020.mp3
Duminica Iertării - 2016.mp3
```

**Great Lent:**
```
Duminica I din Post - Ortodoxiei - 2019.mp3
Duminica II din Post - Sfântul Grigorie Palama - 2019.mp3
Duminica III din Post - Închinarea Sfintei Cruci - 2019.mp3
Duminica IV din Post - Sfântul Ioan Scărarul - 2019.mp3
Duminica V din Post - Sfânta Maria Egipteanca - 2019.mp3
```

**Major Feasts:**
```
Nașterea Domnului - 2019.mp3
Botezul Domnului - 2020.mp3
Învierea Domnului - 2016.mp3
Înălțarea Domnului - 2019.mp3
Pogorârea Sfântului Duh - 2019.mp3
```

**Implementation Steps:**
1. Create Python script to analyze current filenames
2. Generate mapping of old → new names based on sermon metadata
3. Create batch rename script
4. Verify all mappings are correct
5. Execute rename operation
6. Update all sermon data JSON files with new filenames
7. Update R2 storage filenames to match
