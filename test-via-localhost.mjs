import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({
    headless: false,
    devtools: true
  });

  const page = await browser.newPage();

  page.on('console', msg => {
    const text = msg.text();
    console.log(`[${msg.type().toUpperCase()}] ${text}`);
  });

  console.log('\n=============================================');
  console.log('   MP3 vs OPUS TEST (via localhost)');
  console.log('=============================================\n');

  await page.goto('http://localhost:5173/test-mp3-vs-opus.html');

  console.log('>>> Test page loaded - try both audio players <<<\n');

  while (true) {
    await page.waitForTimeout(5000);
  }
})();
