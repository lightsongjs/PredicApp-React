import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

(async () => {
  const browser = await chromium.launch({
    headless: false,
    devtools: true
  });

  const page = await browser.newPage();

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[mp3]') || text.includes('[opus]')) {
      console.log(`\x1b[33m${text}\x1b[0m`);
    }
  });

  console.log('\n=============================================');
  console.log('   MP3 vs OPUS FORMAT COMPARISON TEST');
  console.log('=============================================');
  console.log('');
  console.log('Test both audio players:');
  console.log('1. Click play on MP3 - check if it loops');
  console.log('2. Click play on Opus - check if it loops');
  console.log('3. Compare behavior');
  console.log('');
  console.log('Press Ctrl+C to stop');
  console.log('=============================================\n');

  const testFile = join(__dirname, 'test-mp3-vs-opus.html');
  await page.goto(`file://${testFile}`);

  console.log('>>> Test page loaded <<<\n');

  while (true) {
    await page.waitForTimeout(5000);
  }
})();
