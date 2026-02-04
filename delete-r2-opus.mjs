import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const files = readFileSync('opus-files-to-delete.txt', 'utf8')
  .split('\n')
  .filter(f => f.trim());

console.log('=============================================');
console.log('   DELETING OPUS FILES FROM R2');
console.log('=============================================');
console.log(`Total files to delete: ${files.length}`);
console.log('=============================================\n');

let deleted = 0;
let errors = 0;

for (const file of files) {
  const objectPath = `prediciduminica/${file}`;

  try {
    console.log(`[${deleted + errors + 1}/${files.length}] Deleting: ${file}`);
    execSync(`npx wrangler r2 object delete "${objectPath}" --remote`, {
      stdio: 'pipe',
      timeout: 30000
    });
    deleted++;
    console.log(`   Deleted!`);
  } catch (err) {
    errors++;
    console.error(`   ERROR: ${err.message?.substring(0, 100) || 'Unknown error'}`);
  }
}

console.log('\n=============================================');
console.log('   COMPLETE!');
console.log('=============================================');
console.log(`Deleted: ${deleted}`);
console.log(`Errors: ${errors}`);
