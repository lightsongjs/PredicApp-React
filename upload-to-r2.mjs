import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const SOURCE_DIR = 'C:/Users/User/OneDrive/01-Proiecte-Main/2026-01-31_SermonsApp/SoundCloud Padre Fixed';
const BUCKET = 'prediciduminica';
const R2_PATH = 'audio';

// Get all opus files
const files = readdirSync(SOURCE_DIR).filter(f => f.endsWith('.opus'));

console.log('=============================================');
console.log('   UPLOADING FIXED OPUS FILES TO R2');
console.log('=============================================');
console.log(`Source: ${SOURCE_DIR}`);
console.log(`Bucket: ${BUCKET}`);
console.log(`R2 Path: ${R2_PATH}/`);
console.log(`Total files: ${files.length}`);
console.log('=============================================\n');

let uploaded = 0;
let errors = 0;
let totalSize = 0;

for (const file of files) {
  const localPath = join(SOURCE_DIR, file);
  const r2Path = `${BUCKET}/${R2_PATH}/${file}`;
  const fileSize = statSync(localPath).size;
  totalSize += fileSize;
  const sizeMB = (fileSize / 1024 / 1024).toFixed(2);

  try {
    const progress = ((uploaded + errors + 1) / files.length * 100).toFixed(1);
    console.log(`[${uploaded + errors + 1}/${files.length}] (${progress}%) Uploading: ${file.substring(0, 50)}... (${sizeMB}MB)`);

    execSync(
      `npx wrangler r2 object put "${r2Path}" --file="${localPath}" --remote --content-type="audio/opus"`,
      { stdio: 'pipe', timeout: 120000 }
    );

    uploaded++;
    console.log(`   Uploaded!`);

  } catch (err) {
    errors++;
    console.error(`   ERROR: ${err.message?.substring(0, 80) || 'Unknown error'}`);
  }
}

const totalSizeGB = (totalSize / 1024 / 1024 / 1024).toFixed(2);

console.log('\n=============================================');
console.log('   COMPLETE!');
console.log('=============================================');
console.log(`Uploaded: ${uploaded}`);
console.log(`Errors: ${errors}`);
console.log(`Total size: ${totalSizeGB} GB`);
console.log('\nYour app should now work with the fixed opus files!');
