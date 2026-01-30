const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { getAllAudioDurations } = require('./get_audio_durations');

async function recordPresentation() {
    console.log('=== Automated Presentation Recording ===\n');

    // Step 1: Get actual MP3 durations
    console.log('Step 1: Reading MP3 durations...');
    const durations = getAllAudioDurations();

    if (Object.keys(durations).length !== 30) {
        console.error('\n❌ Error: Could not read all 30 MP3 files. Aborting.');
        process.exit(1);
    }

    // Step 2: Setup recording directory
    const recordingDir = path.join(__dirname, 'recordings');
    if (!fs.existsSync(recordingDir)) {
        fs.mkdirSync(recordingDir);
    }

    console.log('\nStep 2: Launching browser with video recording...');

    // Step 3: Launch browser with recording enabled
    const browser = await chromium.launch({
        headless: false, // Show browser so we can see progress
        args: ['--start-maximized']
    });

    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        recordVideo: {
            dir: recordingDir,
            size: { width: 1920, height: 1080 }
        },
        deviceScaleFactor: 1
    });

    const page = await context.newPage();

    // Step 4: Open presentation in silent mode
    const presentationPath = path.join(__dirname, 'presentation.html');
    const presentationURL = `file://${presentationPath}?silent=true`;

    console.log('\nStep 3: Loading presentation...');
    await page.goto(presentationURL, { waitUntil: 'networkidle' });

    // Wait for presentation to fully initialize
    await page.waitForTimeout(2000);

    console.log('\nStep 4: Recording slides with precise timing...\n');

    // Step 5: Record each slide with accurate timing
    for (let i = 1; i <= 30; i++) {
        const duration = durations[i];

        if (!duration) {
            console.error(`❌ Missing duration for slide ${i}, skipping...`);
            continue;
        }

        console.log(`📹 Slide ${i}/30 - ${duration.toFixed(2)}s`);

        // Wait for the duration of the audio
        // Convert seconds to milliseconds
        const waitTime = duration * 1000;
        await page.waitForTimeout(waitTime);

        // Advance to next slide (unless on last slide)
        if (i < 30) {
            await page.keyboard.press('ArrowRight');
            // Small pause after navigation
            await page.waitForTimeout(300);
        }
    }

    console.log('\n✅ Recording complete! Finalizing video...\n');

    // Step 6: Close browser to save video
    await context.close();
    await browser.close();

    // Step 7: Find the recorded video file
    const files = fs.readdirSync(recordingDir);
    const videoFile = files.find(f => f.endsWith('.webm'));

    if (videoFile) {
        const videoPath = path.join(recordingDir, videoFile);
        const newVideoPath = path.join(recordingDir, 'presentation_silent.webm');

        // Rename to a predictable name
        if (fs.existsSync(newVideoPath)) {
            fs.unlinkSync(newVideoPath);
        }
        fs.renameSync(videoPath, newVideoPath);

        console.log(`✅ Video saved: ${newVideoPath}\n`);
        console.log('Next steps:');
        console.log('  1. Run: node concat_audio.js');
        console.log('  2. Run: node merge_video_audio.js\n');
    } else {
        console.error('❌ Error: Could not find recorded video file');
        process.exit(1);
    }
}

// Run the recording
recordPresentation().catch(error => {
    console.error('\n❌ Recording failed:', error);
    process.exit(1);
});
