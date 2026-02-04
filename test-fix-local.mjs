import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({
    headless: false,
    devtools: true
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });

  const page = await context.newPage();

  // Capture console messages
  page.on('console', msg => {
    const type = msg.type().toUpperCase();
    const text = msg.text();
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];

    if (text.includes('[useAudio') || text.includes('canplaythrough') || text.includes('Duration')) {
      console.log(`\x1b[33m[${timestamp}] [BROWSER ${type}] ${text}\x1b[0m`);
    } else if (type === 'ERROR') {
      console.log(`\x1b[31m[${timestamp}] [BROWSER ${type}] ${text}\x1b[0m`);
    }
  });

  console.log('\n===========================================');
  console.log('   TESTING AUDIO FIX - LOCAL DEV SERVER');
  console.log('===========================================');
  console.log('Opening: http://localhost:5173/');
  console.log('');
  console.log('Test steps:');
  console.log('  1. Click on a sermon to play');
  console.log('  2. Watch console for "canplaythrough" message');
  console.log('  3. Verify audio plays without looping first 3-4 seconds');
  console.log('');
  console.log('Press Ctrl+C to stop');
  console.log('===========================================\n');

  await page.goto('http://localhost:5173/');
  await page.waitForLoadState('networkidle');

  console.log('>>> Page loaded - test the audio playback <<<\n');

  // Keep running
  while (true) {
    await page.waitForTimeout(2000);
  }
})();
