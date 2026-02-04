import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    recordVideo: { dir: './test-videos/' },
    viewport: { width: 1200, height: 900 }
  });

  const page = await context.newPage();

  // Capture ALL console messages
  page.on('console', msg => {
    console.log(`[BROWSER ${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
  });

  console.log('Navigating to the site...');
  await page.goto('https://predicapp-react.pages.dev/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Click on a sermon from "Predici Viitoare" list
  console.log('\n=== Clicking on sermon from upcoming list ===\n');

  const upcomingSermon = page.locator('text=Duminica Fiului Risipitor').first();
  if (await upcomingSermon.isVisible()) {
    await upcomingSermon.click();
    console.log('Clicked on "Duminica Fiului Risipitor"');
  }

  // Monitor for 3 minutes (180 seconds)
  console.log('\n=== Monitoring audio for 3 minutes ===\n');

  const startTime = Date.now();
  let lastLogTime = 0;

  for (let i = 0; i < 180; i++) {
    await page.waitForTimeout(1000);

    const elapsed = Math.floor((Date.now() - startTime) / 1000);

    // Log every 10 seconds
    if (elapsed - lastLogTime >= 10) {
      lastLogTime = elapsed;
      console.log(`\n--- ${elapsed} seconds elapsed ---`);

      // Take a screenshot every 30 seconds
      if (elapsed % 30 === 0) {
        await page.screenshot({ path: `test-long-${elapsed}s.png` });
        console.log(`Screenshot saved: test-long-${elapsed}s.png`);
      }
    }
  }

  console.log('\n=== Test complete after 3 minutes ===\n');
  await page.screenshot({ path: 'test-long-final.png' });

  await context.close();
  await browser.close();
})();
