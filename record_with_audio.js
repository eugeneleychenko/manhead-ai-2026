/**
 * Playwright + FFmpeg: Automated Presentation Recording with Audio
 *
 * This script:
 * 1. Opens the presentation in a browser
 * 2. Uses ffmpeg to record screen + audio (macOS)
 * 3. Advances through slides based on audio timing
 * 4. Exports final MP4 video with synchronized audio
 */

const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Slide timings (in milliseconds) based on voiceover_script.md
const SLIDE_TIMINGS = {
    1: 10000, 2: 25000, 3: 30000, 4: 30000, 5: 35000,
    6: 25000, 7: 20000, 8: 20000, 9: 12000, 10: 10000,
    11: 10000, 12: 12000, 13: 12000, 14: 10000, 15: 12000,
    16: 10000, 17: 12000, 18: 10000, 19: 8000, 20: 10000,
    21: 10000, 22: 10000, 23: 10000, 24: 10000, 25: 10000,
    26: 10000, 27: 10000, 28: 10000, 29: 8000, 30: 10000
};

const TRANSITION_BUFFER = 500; // 0.5 seconds between slides

// Calculate total duration
const TOTAL_DURATION = Object.values(SLIDE_TIMINGS).reduce((a, b) => a + b, 0) + 3000; // +3s for ending

async function startScreenRecording() {
    console.log('🎥 Starting screen + audio recording with ffmpeg...\n');

    // macOS screen recording with audio using avfoundation
    // This captures the screen and system audio
    const ffmpegArgs = [
        '-f', 'avfoundation',
        '-capture_cursor', '1',
        '-capture_mouse_clicks', '1',
        '-i', '1:0', // Screen:Audio device (1 is typically main screen, 0 is first audio device)
        '-r', '30', // 30 fps
        '-c:v', 'libx264',
        '-preset', 'ultrafast', // Fast encoding during recording
        '-crf', '18', // High quality
        '-c:a', 'aac',
        '-b:a', '192k',
        '-ar', '44100',
        'manhead_ai_presentation_recording.mp4'
    ];

    console.log('Note: If recording fails, you may need to grant screen recording permissions');
    console.log('      Go to: System Preferences > Security & Privacy > Screen Recording\n');

    const ffmpeg = spawn('ffmpeg', ffmpegArgs, {
        stdio: ['ignore', 'pipe', 'pipe']
    });

    ffmpeg.stderr.on('data', (data) => {
        // Suppress ffmpeg verbose output
    });

    return ffmpeg;
}

async function recordPresentation() {
    console.log('=' .repeat(70));
    console.log('🎬 AUTOMATED PRESENTATION RECORDING');
    console.log('=' .repeat(70));
    console.log();

    // Check if ffmpeg is installed
    try {
        require('child_process').execSync('ffmpeg -version', { stdio: 'ignore' });
    } catch (error) {
        console.error('❌ ffmpeg is not installed!');
        console.error('   Install with: brew install ffmpeg\n');
        process.exit(1);
    }

    // Launch browser
    const browser = await chromium.launch({
        headless: false,
        args: [
            '--autoplay-policy=no-user-gesture-required',
            '--start-fullscreen',
            '--kiosk' // True fullscreen
        ]
    });

    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    // Navigate to presentation
    const presentationPath = path.resolve(__dirname, 'presentation.html');
    await page.goto(`file://${presentationPath}`);

    console.log('✓ Presentation loaded');
    console.log('✓ Browser in fullscreen mode\n');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Click on page to allow audio autoplay
    await page.click('body');
    await page.waitForTimeout(1000);

    console.log('⏱️  Countdown before recording starts...');
    console.log('   Get ready to start screen recording manually!');
    console.log('   3...');
    await page.waitForTimeout(1000);
    console.log('   2...');
    await page.waitForTimeout(1000);
    console.log('   1...');
    await page.waitForTimeout(1000);
    console.log('\n📹 RECORDING NOW!\n');

    // Optional: Start ffmpeg recording automatically (macOS only)
    let ffmpegProcess = null;
    const autoRecord = process.argv.includes('--auto-record');

    if (autoRecord) {
        try {
            ffmpegProcess = await startScreenRecording();
            await page.waitForTimeout(2000); // Give ffmpeg time to start
        } catch (error) {
            console.error('Warning: Could not start automatic recording. Continue with manual recording.');
        }
    }

    console.log('Timeline:');
    console.log('-'.repeat(70));

    let totalTime = 0;

    // Go through each slide
    for (let slideNum = 1; slideNum <= 30; slideNum++) {
        const duration = SLIDE_TIMINGS[slideNum];
        const slideSeconds = (duration / 1000).toFixed(1);
        totalTime += duration;
        const totalMinutes = (totalTime / 1000 / 60).toFixed(2);

        console.log(`Slide ${slideNum.toString().padStart(2, '0')}: ${slideSeconds}s | Total: ${totalMinutes}m`);

        // Wait for the audio to play
        await page.waitForTimeout(duration);

        // Advance to next slide
        if (slideNum < 30) {
            await page.keyboard.press('ArrowRight');
            await page.waitForTimeout(TRANSITION_BUFFER);
        }
    }

    // Hold on final slide
    console.log('\nFinal slide - holding for 3 seconds...');
    await page.waitForTimeout(3000);

    console.log('\n' + '='.repeat(70));
    console.log('✅ RECORDING COMPLETE');
    console.log('='.repeat(70));
    console.log(`Total duration: ${(totalTime / 1000 / 60).toFixed(2)} minutes`);
    console.log();

    // Stop ffmpeg if we started it
    if (ffmpegProcess) {
        ffmpegProcess.kill('SIGINT');
        console.log('✓ Video saved: manhead_ai_presentation_recording.mp4');
    } else {
        console.log('Stop your screen recording now!');
        console.log('The video file should contain the complete presentation with audio.');
    }

    console.log('\nClosing browser in 5 seconds...');
    await page.waitForTimeout(5000);

    await context.close();
    await browser.close();

    console.log('\n🎉 Done!\n');
}

// Run the recording
recordPresentation().catch(error => {
    console.error('❌ Error during recording:', error);
    process.exit(1);
});
