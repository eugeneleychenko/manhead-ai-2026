# Video Recording Guide

Automated video recording system for the Manhead AI Presentation using Playwright and FFmpeg.

## Quick Start

### One Command (Recommended)

```bash
npm run create-video
```

This runs the entire pipeline automatically:
1. Reads actual MP3 durations
2. Records silent video with precise timing
3. Concatenates all audio files
4. Merges video + audio into final MP4

**Duration:** ~6-7 minutes for recording + 2-3 minutes for processing

---

## Prerequisites

### 1. Install Dependencies

```bash
npm install
npx playwright install chromium
```

### 2. Verify FFmpeg is Installed

```bash
ffmpeg -version
```

If not installed:
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows (use Chocolatey)
choco install ffmpeg
```

---

## How It Works

### The Problem with Previous Approach
- System audio capture is complex (requires permissions, BlackHole, etc.)
- Hardcoded timings don't match actual MP3 durations
- Audio quality degrades when re-captured

### The Solution
1. **Read actual MP3 durations** using ffprobe
2. **Record video-only** using Playwright (no audio capture)
3. **Slides advance** based on real MP3 durations
4. **Merge afterward** using FFmpeg for perfect sync

### Benefits
- ✅ No system audio routing needed
- ✅ Perfect sync (uses actual MP3 durations)
- ✅ Original audio quality preserved
- ✅ Fully automated
- ✅ Reliable and repeatable

---

## Step-by-Step Usage

### Option 1: Full Automated Process

```bash
npm run create-video
```

### Option 2: Manual Step-by-Step

If you want to run each step individually:

#### Step 1: Check MP3 Durations
```bash
npm run durations
```

This reads all 30 MP3 files and displays their durations.

#### Step 2: Record Video
```bash
npm run record
```

- Opens browser window (don't interact with it)
- Records for ~6-7 minutes
- Saves silent video to `./recordings/presentation_silent.webm`

#### Step 3: Concatenate Audio
```bash
npm run concat-audio
```

- Combines all 30 MP3 files into one
- Creates `full_audio.mp3`

#### Step 4: Merge Video + Audio
```bash
npm run merge
```

- Merges silent video with concatenated audio
- Creates final `manhead_ai_presentation_final.mp4`

---

## Output Files

### Final Video
```
manhead_ai_presentation_final.mp4
```
- Resolution: 1920x1080
- Duration: ~6:30 minutes
- Format: MP4 (H.264 + AAC)
- Size: ~150-200 MB

### Intermediate Files
```
./recordings/presentation_silent.webm   # Silent video recording
full_audio.mp3                          # Concatenated audio
audio_concat_list.txt                   # FFmpeg concat file
```

---

## Troubleshooting

### "Missing MP3 files"
Make sure all 30 audio files exist:
```bash
ls slide_*.mp3 | wc -l
# Should return: 30
```

### "ffmpeg not found"
Install FFmpeg:
```bash
# macOS
brew install ffmpeg

# Check installation
ffmpeg -version
```

### "Playwright not installed"
Install Playwright and Chromium:
```bash
npm install
npx playwright install chromium
```

### Browser Window Closes Too Soon
If the recording ends prematurely, the script might have failed. Check:
1. All MP3 files are present
2. Presentation.html exists
3. No errors in the console output

### Audio/Video Out of Sync
This should not happen because we use actual MP3 durations. If sync issues occur:
1. Verify all MP3 files have correct durations: `npm run durations`
2. Check that no slides were skipped during recording
3. Re-run the full process: `npm run create-video`

---

## Quality Settings

The final video uses high-quality encoding:

```bash
# Video codec
-c:v libx264        # H.264 (universal compatibility)
-preset slow        # Better compression (higher quality)
-crf 18             # High quality (0-51 scale, 18 is visually lossless)

# Audio codec
-c:a aac            # AAC audio
-b:a 192k           # 192 kbps bitrate

# Sync
-shortest           # End when audio ends (ensures perfect sync)
```

---

## Technical Details

### Why This Works

1. **Actual MP3 Durations**
   - Uses ffprobe to read exact duration from each file
   - No guessing or hardcoded timings
   - Ensures perfect sync

2. **Playwright Video Recording**
   - Native browser video capture
   - No external screen recording tools
   - Reliable and consistent quality

3. **FFmpeg Processing**
   - Industry-standard video processing
   - Lossless audio concatenation
   - High-quality video encoding

### Architecture

```
[MP3 Files] → [Duration Reader] → [Durations Object]
                                         ↓
[Presentation.html?silent=true] → [Playwright Recording] → [Silent Video]
                                                                 ↓
[MP3 Files] → [FFmpeg Concat] → [Full Audio] + [Silent Video] → [FFmpeg Merge] → [Final MP4]
```

---

## Customization

### Adjust Video Quality

Edit `merge_video_audio.js` and modify the FFmpeg command:

```javascript
// Higher quality (larger file)
-crf 15

// Lower quality (smaller file)
-crf 23
```

### Add Buffer Between Slides

Edit `record_final_video.js`:

```javascript
// Add 500ms buffer after each slide
const waitTime = (duration * 1000) + 500;
```

### Change Video Resolution

Edit `record_final_video.js`:

```javascript
viewport: { width: 1280, height: 720 },  // 720p
recordVideo: {
    dir: recordingDir,
    size: { width: 1280, height: 720 }
}
```

---

## FAQ

**Q: How long does the full process take?**
A: About 9-10 minutes total (6-7 min recording + 2-3 min processing)

**Q: Can I run this on a headless server?**
A: Yes, change `headless: false` to `headless: true` in `record_final_video.js`

**Q: Will this work on Windows/Linux?**
A: Yes, as long as Node.js, Playwright, and FFmpeg are installed

**Q: Can I customize the slide timings?**
A: The timings are based on actual MP3 durations. To adjust, edit the MP3 files themselves

**Q: What if I want to skip certain slides?**
A: Modify `record_final_video.js` to skip specific slide numbers

---

## Support

If you encounter issues:

1. Check all prerequisites are installed
2. Verify all 30 MP3 files exist
3. Run steps individually to identify which step fails
4. Check console output for specific error messages

For more information, see the implementation files:
- `get_audio_durations.js` - MP3 duration reading
- `record_final_video.js` - Playwright recording
- `concat_audio.js` - Audio concatenation
- `merge_video_audio.js` - Final video merge
- `create_video.js` - Master orchestration script
