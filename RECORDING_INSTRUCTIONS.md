# Recording Instructions: Automated Presentation with Voiceover

## Quick Start (Recommended Method)

The **simplest and most reliable** way to record the presentation with audio:

### Option 1: Manual Screen Recording (macOS QuickTime)

1. **Open the presentation:**
   ```bash
   open presentation.html
   ```

2. **Start QuickTime screen recording:**
   - Open QuickTime Player
   - File > New Screen Recording
   - Click Options > select audio input (to capture system audio, you may need BlackHole or similar)
   - Click Record button
   - Select the browser window

3. **Start the presentation:**
   - Click on the presentation to enable audio
   - Press spacebar or arrow keys to advance through slides
   - Audio plays automatically for each slide

4. **Stop recording** when presentation ends

---

## Option 2: Automated Playwright Recording

### Prerequisites

```bash
# Install Node.js dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# (Optional) Install ffmpeg for audio capture
brew install ffmpeg
```

### Method A: Playwright with Manual Screen Recording

This method automates slide advancement while you record manually:

```bash
# Run the automation script
node record_with_audio.js
```

**What happens:**
1. Browser opens in fullscreen
2. Presentation loads with audio enabled
3. 3-second countdown
4. Slides advance automatically with perfect timing
5. You manually record with your preferred tool (QuickTime, OBS, etc.)

**Steps:**
1. Run the command above
2. Start your screen recording tool when countdown begins
3. Let the script run through all 30 slides
4. Stop your recording when script completes

### Method B: Fully Automated (Advanced - macOS only)

Requires ffmpeg and screen recording permissions:

```bash
# Automated recording with ffmpeg
node record_with_audio.js --auto-record
```

**Note:** On first run, macOS will ask for screen recording permissions. You must:
1. Go to System Preferences > Security & Privacy > Screen Recording
2. Grant Terminal (or your terminal app) screen recording access
3. Restart the terminal and run again

---

## Option 3: Use OBS Studio (Professional Quality)

For highest quality recording with full control:

### Setup

1. **Install OBS Studio:**
   ```bash
   brew install --cask obs
   ```

2. **Configure OBS:**
   - Add "Window Capture" source (select browser window)
   - Add "Audio Input Capture" (system audio)
   - Set output to 1920x1080, 30fps
   - Choose MP4 format in Settings > Output

3. **Run automation script:**
   ```bash
   node record_with_audio.js
   ```

4. **Start recording in OBS** when countdown begins

5. **Stop recording** when automation completes

---

## Recording Configuration

### Slide Timings

The automation uses these timings (from `voiceover_script.md`):

```
Slides 1:    10s  (Title)
Slides 2-8:  20-35s each (Executive Summary - detailed)
Slides 9-18: 10-12s each (Main Content - faster)
Slides 19-29: 8-10s each (Appendix - quick)
Slide 30:    10s  (Closing)

Total: ~6:30 minutes
```

### Customizing Timings

Edit `record_with_audio.js` and modify the `SLIDE_TIMINGS` object:

```javascript
const SLIDE_TIMINGS = {
    1: 10000,  // milliseconds
    2: 25000,
    // ... etc
};
```

---

## Troubleshooting

### Audio doesn't play
- Click on the presentation page to allow autoplay
- Check browser audio isn't muted
- Verify MP3 files are in the same directory as presentation.html

### Screen recording has no audio (macOS)
- **System audio requires BlackHole or similar:**
  ```bash
  brew install blackhole-2ch
  ```
- Configure Audio MIDI Setup to route audio through BlackHole
- Or use OBS Studio which handles audio capture better

### Slides don't advance
- Ensure browser window is focused
- Check that presentation.html loaded correctly
- Try running in non-headless mode to see what's happening

### Recording quality is poor
- Use OBS Studio for better quality
- Increase bitrate in recording settings
- Record at native resolution (1920x1080)

### FFmpeg permission denied (macOS)
```bash
# Grant screen recording permissions:
# System Preferences > Security & Privacy > Screen Recording
# Enable Terminal (or iTerm, etc.)
```

---

## Output Files

### Using Playwright alone:
- Creates `.webm` video file in `./recordings/`
- Convert to MP4 with:
  ```bash
  ffmpeg -i recordings/video.webm -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 192k manhead_presentation.mp4
  ```

### Using manual recording:
- Saved wherever your tool saves (usually ~/Desktop or ~/Movies)
- Already in MP4 or MOV format

### Using OBS:
- Saved to configured output directory
- Already in MP4 format

---

## Recommended Workflow

**For quick recording:**
```bash
node record_with_audio.js
# + QuickTime or OBS manual recording
```

**For highest quality:**
1. Use OBS Studio for recording
2. Run Playwright automation for perfect timing
3. Record in 1920x1080, 30fps, high bitrate
4. Export as MP4

**For fully automated (if working):**
```bash
node record_with_audio.js --auto-record
```

---

## Tips for Best Results

### Before Recording
- Close unnecessary applications
- Disable notifications (Do Not Disturb mode)
- Test audio levels
- Run through presentation once to check timing

### During Recording
- Don't click or type (automation handles everything)
- Keep mouse cursor off screen if possible
- Ensure stable lighting if recording in a room

### After Recording
- Trim beginning/end if needed
- Check audio sync throughout
- Export at high quality settings
- Test final video before sending

---

## File Checklist

Before recording, ensure these files are present:

```
✓ presentation.html
✓ slide_01.mp3 through slide_30.mp3
✓ record_with_audio.js
✓ package.json
```

---

## Next Steps After Recording

1. **Review the video** - Watch the full recording
2. **Check audio sync** - Verify audio matches slides throughout
3. **Trim if needed** - Remove countdown or ending
4. **Export final version** - High quality MP4
5. **Test playback** - Ensure it works on target devices
6. **Deliver to Steve** - Send video file or upload to sharing platform

---

## Alternative: No Recording Needed

Remember: The presentation works standalone!
- Send the entire "Manhead AI Roadmap" folder to Steve
- He can open `presentation.html` in any browser
- Audio plays automatically as he navigates
- Works offline, no recording needed

**Recording is only needed if you want a standalone video file for:**
- Uploading to video platforms
- Embedding in emails
- Sharing with multiple people
- Creating a permanent artifact

---

## Support

**Recording issues?**
- Check audio files are present: `ls slide_*.mp3`
- Verify Node.js and Playwright installed: `node --version && npx playwright --version`
- Test presentation manually first: `open presentation.html`

**Need help?**
- See troubleshooting section above
- Check Playwright docs: https://playwright.dev
- OBS Studio guides: https://obsproject.com/wiki/

---

**Status: Ready to Record** 🎥

Choose your preferred method and start recording!
