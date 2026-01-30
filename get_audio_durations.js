const { execSync } = require('child_process');
const fs = require('fs');

/**
 * Reads the actual duration of each MP3 file using ffprobe
 * Returns an object mapping slide numbers to durations in seconds
 */
function getMP3Duration(filename) {
    try {
        const cmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filename}"`;
        const output = execSync(cmd, { encoding: 'utf8' });
        return parseFloat(output.trim());
    } catch (error) {
        console.error(`Error reading duration for ${filename}:`, error.message);
        return null;
    }
}

function getAllAudioDurations() {
    const durations = {};

    console.log('Reading MP3 durations...\n');

    for (let i = 1; i <= 30; i++) {
        const slideNum = String(i).padStart(2, '0');
        const filename = `slide_${slideNum}.mp3`;

        if (!fs.existsSync(filename)) {
            console.error(`❌ Missing file: ${filename}`);
            continue;
        }

        const duration = getMP3Duration(filename);

        if (duration !== null) {
            durations[i] = duration;
            console.log(`✓ Slide ${slideNum}: ${duration.toFixed(2)}s`);
        } else {
            console.error(`✗ Failed to read duration for slide ${slideNum}`);
        }
    }

    console.log(`\n✅ Read durations for ${Object.keys(durations).length} slides\n`);

    // Calculate total duration
    const totalDuration = Object.values(durations).reduce((sum, d) => sum + d, 0);
    const minutes = Math.floor(totalDuration / 60);
    const seconds = Math.floor(totalDuration % 60);
    console.log(`Total duration: ${minutes}:${String(seconds).padStart(2, '0')}\n`);

    return durations;
}

// If run directly (not imported)
if (require.main === module) {
    getAllAudioDurations();
}

module.exports = { getAllAudioDurations, getMP3Duration };
