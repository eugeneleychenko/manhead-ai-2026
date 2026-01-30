# Manhead AI Presentation - Automated Video Recording

This project creates a fully automated video recording of the Manhead AI Implementation Proposal presentation with perfectly synchronized audio.

## Quick Start

### Create the Final Video (One Command)

```bash
npm run create-video
```

This automatically:
1. Reads MP3 durations (7:53 total)
2. Records silent video with Playwright (~6-7 minutes)
3. Concatenates all 30 audio files
4. Merges video + audio into final MP4

**Output:** `manhead_ai_presentation_final.mp4` (1920x1080, ~150-200 MB)

---

## Prerequisites

Install dependencies once:

```bash
npm install
npx playwright install chromium
```

Verify FFmpeg is installed:
```bash
ffmpeg -version
```

If not installed:
```bash
brew install ffmpeg  # macOS
```

---

## How It Works

### The Problem
- System audio capture requires complex setup (BlackHole, permissions)
- Hardcoded slide timings don't match actual MP3 durations
- Audio quality degrades when re-captured

### The Solution
1. **Read actual MP3 durations** using ffprobe
2. **Record video-only** with Playwright (no audio capture)
3. **Advance slides** based on real MP3 durations
4. **Merge afterward** using FFmpeg for perfect sync

### Benefits
✅ No system audio routing needed
✅ Perfect sync (uses actual MP3 durations)
✅ Original audio quality preserved
✅ Fully automated
✅ Reliable and repeatable

---

## Project Structure

### Core Scripts
- `create_video.js` - Master orchestration script (run this!)
- `get_audio_durations.js` - Reads actual MP3 durations with ffprobe
- `record_final_video.js` - Records silent video with Playwright
- `concat_audio.js` - Concatenates all 30 MP3 files
- `merge_video_audio.js` - Merges video + audio with FFmpeg

### Content Files
- `presentation.html` - Main presentation (30 slides)
- `slide_01.mp3` through `slide_30.mp3` - Voice-over audio
- `voiceover_script.md` - Full script with timings

### Documentation
- `VIDEO_RECORDING_GUIDE.md` - Detailed usage guide
- `README.md` - This file
- `IMPLEMENTATION_SUMMARY.md` - Implementation details
- `RECORDING_INSTRUCTIONS.md` - Original recording instructions

---

## Available Commands

### Main Commands
```bash
npm run create-video    # Full automated process (recommended)
npm run durations       # Check MP3 durations
npm run record          # Record video only
npm run concat-audio    # Concatenate audio only
npm run merge           # Merge video + audio only
```

### Utility Commands
```bash
npm run install-all     # Install all dependencies
```

---

## Step-by-Step (Manual)

If you prefer to run each step individually:

### 1. Check MP3 Durations
```bash
npm run durations
```

### 2. Record Video
```bash
npm run record
```
- Opens browser window (don't interact with it)
- Records for ~6-7 minutes
- Saves to `./recordings/presentation_silent.webm`

### 3. Concatenate Audio
```bash
npm run concat-audio
```
- Creates `full_audio.mp3`

### 4. Merge Video + Audio
```bash
npm run merge
```
- Creates `manhead_ai_presentation_final.mp4`

---

## Output

### Final Video
**File:** `manhead_ai_presentation_final.mp4`
- Resolution: 1920x1080 (Full HD)
- Duration: ~7:53 minutes
- Format: MP4 (H.264 + AAC)
- Size: ~150-200 MB
- Quality: High (CRF 18, visually lossless)

### Intermediate Files
- `./recordings/presentation_silent.webm` - Silent video
- `full_audio.mp3` - Concatenated audio (7.2 MB)
- `audio_concat_list.txt` - FFmpeg concat file

---

## Troubleshooting

### "Missing MP3 files"
Verify all 30 files exist:
```bash
ls slide_*.mp3 | wc -l
# Should return: 30
```

### "ffmpeg not found"
Install FFmpeg:
```bash
brew install ffmpeg  # macOS
```

### "Playwright not installed"
Install Playwright:
```bash
npx playwright install chromium
```

### Audio/Video Out of Sync
This shouldn't happen since we use actual MP3 durations. If it does:
1. Verify durations: `npm run durations`
2. Re-run full process: `npm run create-video`

---

## Technical Details

### Video Quality Settings
```bash
-c:v libx264     # H.264 codec
-preset slow     # Better compression
-crf 18          # High quality (visually lossless)
-c:a aac         # AAC audio
-b:a 192k        # 192 kbps audio bitrate
```

### Architecture
```
MP3 Files → Duration Reader → Durations Object
                                    ↓
Presentation.html?silent=true → Playwright → Silent Video
                                                   ↓
MP3 Files → FFmpeg Concat → Full Audio + Silent Video → Final MP4
```

---

## Presentation Content

**Title:** AI Implementation Proposal for Manhead Merch

**Slides:** 30 total
- Slides 1: Title
- Slides 2-8: Executive Summary
- Slides 9-18: Main Content
- Slides 19-29: Full Menu (Appendix)
- Slide 30: Closing

**Duration:** 7 minutes 53 seconds

**Topics:**
- Current state assessment
- Quick wins (60-90 days)
- Foundation work (data infrastructure)
- Full roadmap (30+ capabilities)
- ROI analysis
- Next steps

---

## Links & Resources

- **Presentation:** `presentation.html` (open in browser)
- **Full Guide:** `VIDEO_RECORDING_GUIDE.md`
- **Voiceover Script:** `voiceover_script.md`

---

## Support

For detailed documentation, see `VIDEO_RECORDING_GUIDE.md`.

For issues:
1. Check prerequisites are installed
2. Verify all 30 MP3 files exist
3. Run steps individually to identify failures
4. Check console output for errors

---

**Created by:** Citadines Group
**For:** Manhead Merch
**Date:** January 2026
