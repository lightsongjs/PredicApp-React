import { execSync, spawn } from 'child_process';
import { readdirSync, statSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';

const SOURCE_DIR = 'C:/Users/User/OneDrive/01-Proiecte-Main/2026-01-31_SermonsApp/SoundCloud Padre';
const OUTPUT_DIR = 'C:/Users/User/OneDrive/01-Proiecte-Main/2026-01-31_SermonsApp/SoundCloud Padre Fixed';

// Create output directory
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created output directory: ${OUTPUT_DIR}\n`);
}

// Get all opus files
const files = readdirSync(SOURCE_DIR)
  .filter(f => f.endsWith('.opus'))
  .sort();

console.log('=============================================');
console.log('   OPUS RE-ENCODING SCRIPT');
console.log('=============================================');
console.log(`Source: ${SOURCE_DIR}`);
console.log(`Output: ${OUTPUT_DIR}`);
console.log(`Total files: ${files.length}`);
console.log('=============================================\n');

let processed = 0;
let skipped = 0;
let errors = 0;

for (const file of files) {
  const inputPath = join(SOURCE_DIR, file);
  const outputPath = join(OUTPUT_DIR, file);

  // Skip if already processed
  if (existsSync(outputPath)) {
    const inputSize = statSync(inputPath).size;
    const outputSize = statSync(outputPath).size;
    // Skip if output exists and is reasonable size (at least 50% of input)
    if (outputSize > inputSize * 0.5) {
      skipped++;
      console.log(`[${processed + skipped}/${files.length}] SKIP: ${file} (already exists)`);
      continue;
    }
  }

  processed++;
  const progress = ((processed + skipped) / files.length * 100).toFixed(1);
  console.log(`\n[${processed + skipped}/${files.length}] (${progress}%) Encoding: ${file}`);

  try {
    // Re-encode with FFmpeg
    // -y: overwrite output
    // -i: input file
    // -c:a libopus: use opus codec
    // -b:a 64k: 64kbps bitrate (good quality for speech)
    // -vbr on: variable bitrate for better quality
    // -application audio: optimize for audio (vs voip)
    execSync(
      `ffmpeg -y -i "${inputPath}" -c:a libopus -b:a 64k -vbr on -application audio "${outputPath}"`,
      { stdio: 'pipe' }
    );

    const inputSize = (statSync(inputPath).size / 1024 / 1024).toFixed(2);
    const outputSize = (statSync(outputPath).size / 1024 / 1024).toFixed(2);
    console.log(`   Done! ${inputSize}MB -> ${outputSize}MB`);

  } catch (err) {
    errors++;
    console.error(`   ERROR: ${err.message}`);
  }
}

console.log('\n=============================================');
console.log('   COMPLETE!');
console.log('=============================================');
console.log(`Processed: ${processed}`);
console.log(`Skipped: ${skipped}`);
console.log(`Errors: ${errors}`);
console.log(`\nOutput files are in: ${OUTPUT_DIR}`);
console.log('\nNext step: Upload the fixed files to R2 to replace the originals.');
