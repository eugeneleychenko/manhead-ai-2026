const { execSync } = require('child_process');
const path = require('path');

console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║     Automated Video Creator for Manhead AI Presentation    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);

async function createVideo() {
    try {
        // Step 1: Read MP3 durations
        console.log('\n📊 STEP 1/4: Reading MP3 durations...');
        console.log('─────────────────────────────────────────────────────\n');
        execSync('node get_audio_durations.js', { stdio: 'inherit' });

        // Step 2: Record video
        console.log('\n🎬 STEP 2/4: Recording presentation video...');
        console.log('─────────────────────────────────────────────────────');
        console.log('This will open a browser window. Please do not interact with it.');
        console.log('Recording will take approximately 6-7 minutes.\n');

        // Need to use require here to handle async
        const { recordPresentation } = require('./record_final_video');
        // The recording script will run automatically when required

        // Wait for recording to complete
        await new Promise((resolve, reject) => {
            const child = require('child_process').spawn('node', ['record_final_video.js'], {
                stdio: 'inherit'
            });

            child.on('exit', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Recording failed with code ${code}`));
                }
            });
        });

        // Step 3: Concatenate audio
        console.log('\n🎵 STEP 3/4: Concatenating audio files...');
        console.log('─────────────────────────────────────────────────────\n');
        execSync('node concat_audio.js', { stdio: 'inherit' });

        // Step 4: Merge video + audio
        console.log('\n🎬 STEP 4/4: Merging video + audio...');
        console.log('─────────────────────────────────────────────────────\n');
        execSync('node merge_video_audio.js', { stdio: 'inherit' });

        // Success!
        console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║                    ✅  SUCCESS!                            ║
║                                                            ║
║     Your final video is ready:                             ║
║     manhead_ai_presentation_final.mp4                      ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);

    } catch (error) {
        console.error('\n❌ Error creating video:', error.message);
        console.error('\nTroubleshooting:');
        console.error('  1. Make sure all 30 MP3 files exist (slide_01.mp3 through slide_30.mp3)');
        console.error('  2. Make sure Playwright is installed: npx playwright install chromium');
        console.error('  3. Make sure ffmpeg is installed: ffmpeg -version');
        console.error('  4. You can run steps individually:');
        console.error('     - node get_audio_durations.js');
        console.error('     - node record_final_video.js');
        console.error('     - node concat_audio.js');
        console.error('     - node merge_video_audio.js\n');
        process.exit(1);
    }
}

// Run the full process
createVideo();
