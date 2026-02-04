import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({
    headless: false,
    devtools: true
  });

  const page = await browser.newPage();

  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type().toUpperCase();
    if (type === 'ERROR') {
      console.log(`\x1b[31m[${type}] ${text}\x1b[0m`);
    } else {
      console.log(`\x1b[33m[${type}] ${text}\x1b[0m`);
    }
  });

  console.log('\n=============================================');
  console.log('   OPUS FIX VERIFICATION TEST');
  console.log('=============================================');
  console.log('\nComparing:');
  console.log('1. ORIGINAL: From R2 (has duration/looping issues)');
  console.log('2. RE-ENCODED: FFmpeg fixed (should work correctly)');
  console.log('=============================================\n');

  await page.goto('http://localhost:5173/test-opus-fixed.html');

  console.log('>>> Test page loaded <<<\n');
  console.log('Watch for:');
  console.log('- Original should show BAD duration (< 100s)');
  console.log('- Fixed should show GOOD duration (~2053s / 34 min)');
  console.log('\nPress Ctrl+C to stop\n');

  // Keep browser open
  while (true) {
    await page.waitForTimeout(5000);
  }
})();
