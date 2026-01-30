# Quick Start Guide

## Create Your Video in One Command

```bash
npm run create-video
```

That's it! The script will automatically:
1. ✅ Read MP3 durations
2. 🎬 Record video (7-8 minutes)
3. 🎵 Concatenate audio
4. 🎥 Merge into final MP4

**Output:** `manhead_ai_presentation_final.mp4`

---

## First Time Setup (One Time Only)

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browser
npx playwright install chromium

# 3. Verify FFmpeg is installed
ffmpeg -version

# If FFmpeg not found:
brew install ffmpeg  # macOS
```

---

## What Happens During Recording

1. **Browser opens** - Don't touch it! Recording in progress
2. **Slides advance automatically** - Based on actual MP3 durations
3. **Takes ~7-8 minutes** - One pass through all 30 slides
4. **Browser closes** - Video saved
5. **Audio processing** - Combines all MP3s
6. **Final merge** - Creates your MP4

**Total time: ~10-12 minutes**

---

## Alternative: Run Steps Individually

```bash
# Step 1: Check durations (optional)
npm run durations

# Step 2: Record video
npm run record

# Step 3: Combine audio
npm run concat-audio

# Step 4: Merge video + audio
npm run merge
```

---

## Output

**File:** `manhead_ai_presentation_final.mp4`
- Resolution: 1920x1080 (Full HD)
- Duration: ~7:53
- Size: ~150-200 MB
- Quality: High (visually lossless)

---

## Troubleshooting

### "Missing MP3 files"
```bash
ls slide_*.mp3 | wc -l
# Should show: 30
```

### "ffmpeg not found"
```bash
brew install ffmpeg
```

### "Playwright not installed"
```bash
npx playwright install chromium
```

### Audio/Video Out of Sync
```bash
# Just re-run the process
npm run create-video
```

---

## Need More Help?

- **Detailed Guide:** `VIDEO_RECORDING_GUIDE.md`
- **Full Documentation:** `README.md`
- **Implementation Details:** `AUTOMATED_VIDEO_SYSTEM.md`

---

## That's All!

You're ready to create your video. Just run:

```bash
npm run create-video
```

And wait ~10-12 minutes for your final MP4! 🎉
