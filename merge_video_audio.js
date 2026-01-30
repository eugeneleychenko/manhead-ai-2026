const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function mergeVideoAudio() {
    console.log('=== Video + Audio Merge ===\n');

    // Step 1: Verify input files exist
    console.log('Step 1: Verifying input files...');

    const videoPath = path.join(__dirname, 'recordings', 'presentation_silent.webm');
    const audioPath = path.join(__dirname, 'full_audio.mp3');

    if (!fs.existsSync(videoPath)) {
        console.error(`❌ Error: Video file not found: ${videoPath}`);
        console.error('   Run: node record_final_video.js first');
        process.exit(1);
    }

    if (!fs.existsSync(audioPath)) {
        console.error(`❌ Error: Audio file not found: ${audioPath}`);
        console.error('   Run: node concat_audio.js first');
        process.exit(1);
    }

    console.log('✓ Video file found');
    console.log('✓ Audio file found\n');

    // Step 2: Merge with ffmpeg
    console.log('Step 2: Merging video + audio with ffmpeg...');
    console.log('   (This may take a few minutes)\n');

    const outputPath = path.join(__dirname, 'manhead_ai_presentation_final.mp4');

    try {
        // Remove existing output file if it exists
        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
        }

        // FFmpeg command with high quality settings
        const cmd = `ffmpeg -i "${videoPath}" -i "${audioPath}" \
            -c:v libx264 -preset slow -crf 18 \
            -c:a aac -b:a 192k \
            -shortest \
            "${outputPath}"`;

        execSync(cmd, { stdio: 'inherit' });

        console.log(`\n✅ Video merge complete!\n`);
        console.log(`📹 Final video: ${outputPath}`);

        // Get file info
        const stats = fs.statSync(outputPath);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`   File size: ${fileSizeMB} MB`);

        // Get video duration
        try {
            const durationCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${outputPath}"`;
            const duration = parseFloat(execSync(durationCmd, { encoding: 'utf8' }).trim());
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            console.log(`   Duration: ${minutes}:${String(seconds).padStart(2, '0')}\n`);
        } catch (e) {
            // Duration check failed, not critical
        }

        console.log('🎉 All done! Open the video to verify audio/video sync.\n');

    } catch (error) {
        console.error('\n❌ Error merging video and audio:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    mergeVideoAudio();
}

module.exports = { mergeVideoAudio };
