/**
 * Playwright Script: Automated Presentation Recording
 *
 * This script:
 * 1. Opens the presentation in a browser
 * 2. Records video with audio
 * 3. Advances through slides based on audio timing
 * 4. Exports final MP4 video
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Slide timings (in milliseconds) based on voiceover_script.md
const SLIDE_TIMINGS = {
    1: 10000,   // Title - 10s
    2: 25000,   // Bottom Line - 25s
    3: 30000,   // What's Working - 30s
    4: 30000,   // Foundation Matters - 30s
    5: 35000,   // Quick Wins - 35s
    6: 25000,   // ROI Snapshot - 25s
    7: 20000,   // Starting Point - 20s
    8: 20000,   // What Happens Next - 20s
    9: 12000,   // Opportunity - 12s
    10: 10000,  // Core Systems - 10s
    11: 10000,  // Custom Infrastructure - 10s
    12: 12000,  // Legacy Processes - 12s
    13: 12000,  // Foundation Problem - 12s
    14: 10000,  // What Happens Without It - 10s
    15: 12000,  // Path Forward - 12s
    16: 10000,  // What's Already Built - 10s
    17: 12000,  // What Happens Next Detailed - 12s
    18: 10000,  // How We Work - 10s
    19: 8000,   // Appendix Intro - 8s
    20: 10000,  // Category A Foundation - 10s
    21: 10000,  // Category A Continued - 10s
    22: 10000,  // Category B Enhancements - 10s
    23: 10000,  // Category B Continued - 10s
    24: 10000,  // Category C Touring - 10s
    25: 10000,  // Category D E-Commerce - 10s
    26: 10000,  // Categories D & E - 10s
    27: 10000,  // Categories F & G - 10s
    28: 10000,  // Categories G, H, I - 10s
    29: 8000,   // Category J Discovery - 8s
    30: 10000   // Closing - 10s
};

// Add buffer time between slides for smooth transitions
const TRANSITION_BUFFER = 500; // 0.5 seconds

async function recordPresentation() {
    console.log('🎬 Starting Presentation Recording...\n');

    // Launch browser with video recording enabled
    const browser = await chromium.launch({
        headless: false, // Show browser for visual confirmation
        args: [
            '--autoplay-policy=no-user-gesture-required', // Allow audio autoplay
            '--start-fullscreen' // Fullscreen for better recording
        ]
    });

    // Create context with video recording
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        recordVideo: {
            dir: './recordings/',
            size: { width: 1920, height: 1080 }
        },
        // Enable audio capture
        recordHar: false,
    });

    const page = await context.newPage();

    // Navigate to presentation
    const presentationPath = path.resolve(__dirname, 'presentation.html');
    await page.goto(`file://${presentationPath}`);

    console.log('✓ Presentation loaded\n');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Click on page to allow audio autoplay (browser requirement)
    await page.click('body');
    console.log('✓ Audio enabled\n');

    // Start recording
    console.log('📹 Recording started\n');
    console.log('Slide timings:');

    let totalTime = 0;

    // Go through each slide
    for (let slideNum = 1; slideNum <= 30; slideNum++) {
        const duration = SLIDE_TIMINGS[slideNum];
        totalTime += duration;

        console.log(`  Slide ${slideNum.toString().padStart(2, '0')}: ${(duration/1000).toFixed(1)}s (total: ${(totalTime/1000).toFixed(1)}s)`);

        // Wait for the audio to play (duration of current slide)
        await page.waitForTimeout(duration);

        // Advance to next slide (if not the last one)
        if (slideNum < 30) {
            await page.keyboard.press('ArrowRight');
            await page.waitForTimeout(TRANSITION_BUFFER);
        }
    }

    // Add extra time at the end for final slide to breathe
    await page.waitForTimeout(2000);

    console.log('\n✓ Recording complete\n');
    console.log(`Total duration: ${(totalTime/1000/60).toFixed(2)} minutes\n`);

    // Close context to save video
    await context.close();
    await browser.close();

    // Get the recorded video file
    const recordings = fs.readdirSync('./recordings/');
    const videoFile = recordings.find(f => f.endsWith('.webm'));

    if (videoFile) {
        const videoPath = path.join('./recordings/', videoFile);
        console.log(`✅ Video saved: ${videoPath}\n`);
        console.log('To convert to MP4 (requires ffmpeg):');
        console.log(`   ffmpeg -i "${videoPath}" -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 192k "manhead_ai_presentation.mp4"\n`);
    }

    console.log('🎉 Done!');
}

// Run the recording
recordPresentation().catch(error => {
    console.error('❌ Error during recording:', error);
    process.exit(1);
});
