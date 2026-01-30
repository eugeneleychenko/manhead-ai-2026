const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function concatenateAudio() {
    console.log('=== Audio Concatenation ===\n');

    // Step 1: Verify all MP3 files exist
    console.log('Step 1: Verifying MP3 files...');
    const missingFiles = [];

    for (let i = 1; i <= 30; i++) {
        const slideNum = String(i).padStart(2, '0');
        const filename = `slide_${slideNum}.mp3`;

        if (!fs.existsSync(filename)) {
            missingFiles.push(filename);
        }
    }

    if (missingFiles.length > 0) {
        console.error(`\n❌ Missing MP3 files: ${missingFiles.join(', ')}`);
        process.exit(1);
    }

    console.log('✓ All 30 MP3 files found\n');

    // Step 2: Create concat list file
    console.log('Step 2: Creating ffmpeg concat list...');
    const concatListPath = path.join(__dirname, 'audio_concat_list.txt');
    let concatContent = '';

    for (let i = 1; i <= 30; i++) {
        const slideNum = String(i).padStart(2, '0');
        const filename = `slide_${slideNum}.mp3`;
        // Use relative path for ffmpeg
        concatContent += `file '${filename}'\n`;
    }

    fs.writeFileSync(concatListPath, concatContent);
    console.log(`✓ Created: ${concatListPath}\n`);

    // Step 3: Concatenate using ffmpeg
    console.log('Step 3: Concatenating audio files...');
    const outputPath = path.join(__dirname, 'full_audio.mp3');

    try {
        // Remove existing output file if it exists
        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
        }

        // Run ffmpeg concat
        const cmd = `ffmpeg -f concat -safe 0 -i "${concatListPath}" -c copy "${outputPath}"`;
        execSync(cmd, { stdio: 'inherit' });

        console.log(`\n✅ Audio concatenation complete: ${outputPath}`);

        // Get file size
        const stats = fs.statSync(outputPath);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`   File size: ${fileSizeMB} MB\n`);

        console.log('Next step:');
        console.log('  Run: node merge_video_audio.js\n');

    } catch (error) {
        console.error('\n❌ Error concatenating audio:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    concatenateAudio();
}

module.exports = { concatenateAudio };
