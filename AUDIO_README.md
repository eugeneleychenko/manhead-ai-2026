# AI Presentation with Voiceover

This presentation includes automatically generated voiceover narration using ElevenLabs AI.

## Files

- **presentation.html** - Main presentation file with integrated audio playback
- **voiceover_script.md** - Complete script with timing and voice direction notes
- **slide_01.mp3 through slide_30.mp3** - Individual audio files for each slide
- **generate_audio.py** - Script to regenerate audio files if needed

## How It Works

Each slide has its own MP3 audio file that plays automatically when you navigate to that slide:
- **Slide 1-8:** Executive Summary (detailed narration, 20-35 seconds each)
- **Slide 9-18:** Main Content (faster pace, 10-12 seconds each)
- **Slide 19-29:** Appendix (quick overview, 8-10 seconds each)
- **Slide 30:** Closing (10 seconds)

**Total Runtime:** ~6:30 minutes

## Usage

### Opening the Presentation

1. Open `presentation.html` in a modern web browser (Chrome, Safari, Firefox, Edge)
2. Audio will start automatically when you load the first slide
3. Navigate through slides using:
   - **Arrow keys** (← →) or **Spacebar**
   - **Scroll** with mouse/trackpad
   - **Navigation dots** on the right side

### Audio Controls

Two buttons appear at the bottom of the screen:

- **🔊 Audio On / 🔇 Audio Off** - Toggle audio playback on/off
- **↻ Replay** - Replay the current slide's audio

### Auto-Advance (Optional)

The presentation can auto-advance to the next slide when audio finishes. To enable this:

1. Open `presentation.html` in a text editor
2. Find the `playAudioForSlide` method
3. Uncomment these lines:
   ```javascript
   this.currentAudio.addEventListener('ended', () => {
       if (this.currentSlideIndex < this.slides.length - 1) {
           setTimeout(() => this.nextSlide(), 500);
       }
   });
   ```
4. Save and reload the presentation

### Browser Autoplay Policies

Modern browsers block autoplay until user interaction. If audio doesn't start automatically:
1. Click anywhere on the page
2. Press the space bar or arrow key
3. Click the "Replay" button

## Regenerating Audio

If you need to regenerate the audio files (e.g., script changes, different voice):

1. Install Python 3 and requests library:
   ```bash
   pip3 install requests
   ```

2. Update the script in `generate_audio.py` if needed

3. Run the generation script:
   ```bash
   python3 generate_audio.py
   ```

This will regenerate all 30 MP3 files using your ElevenLabs API key and voice ID.

## Voice Settings

The current audio uses these ElevenLabs settings:
- **Voice ID:** 41r4aLCZsFMNZdz2qXUq
- **Stability:** 0.5 (moderate variance for natural speech)
- **Similarity Boost:** 0.75 (high consistency)
- **Style:** 0.0 (neutral, executive briefing tone)
- **Speaker Boost:** Enabled

## Presentation Mode Tips

### For Recording/Screen Capture:
1. Open in fullscreen (F11 in most browsers)
2. Start recording
3. Let audio play automatically or manually advance slides
4. Audio and slides stay perfectly synced

### For Live Presentation:
1. Toggle audio off if presenting live with your own voice
2. Use audio for rehearsal/timing practice
3. Replay button useful for repeating key slides

### For Sending to Client:
1. Share the entire folder (presentation.html + all MP3 files)
2. Client can view locally in browser
3. Works offline once files are downloaded
4. No external dependencies or hosting needed

## Technical Details

- Audio files are loaded dynamically as needed (not preloaded)
- Previous audio stops when advancing to new slide
- No overlap or echo between slides
- Smooth transitions with scroll-based navigation
- Works on desktop and tablet (mobile may have limited autoplay support)

## Troubleshooting

**Audio doesn't play:**
- Click anywhere on the page to allow autoplay
- Check that MP3 files are in the same directory as presentation.html
- Try clicking the "Replay" button

**Audio cuts off or overlaps:**
- This shouldn't happen, but if it does, toggle audio off and back on

**Wrong audio for slide:**
- Ensure all MP3 files are named correctly: slide_01.mp3, slide_02.mp3, etc.
- File numbers should match slide order (1-30)

**Can't regenerate audio:**
- Verify ElevenLabs API key is valid and has credits
- Check internet connection
- Review generate_audio.py for any error messages

## File Structure

```
Manhead AI Roadmap/
├── presentation.html          # Main presentation (open this)
├── voiceover_script.md        # Full script with notes
├── generate_audio.py          # Audio generation script
├── AUDIO_README.md           # This file
├── slide_01.mp3              # Title slide audio
├── slide_02.mp3              # Bottom line audio
├── slide_03.mp3              # What's working audio
├── ...
└── slide_30.mp3              # Closing audio
```

## Next Steps

1. **Preview:** Open presentation.html and review audio sync
2. **Adjust:** If timing feels off, edit voiceover_script.md and regenerate
3. **Deliver:** Send folder to Steve or record a video for distribution
4. **Practice:** Use for rehearsal before live discussion

---

**Questions?** Review the script in voiceover_script.md for detailed timing and emphasis notes.
