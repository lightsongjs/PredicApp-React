import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    recordVideo: { dir: './test-videos/' },
    viewport: { width: 500, height: 900 }
  });

  const page = await context.newPage();

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('duration') || text.includes('Duration') || msg.type() === 'error') {
      console.log(`[BROWSER] ${text}`);
    }
  });

  console.log('Navigating to the new deployment...');
  await page.goto('https://d585078b.predicapp-react.pages.dev/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('Clicking "Ascultă Acum" button...');
  const listenButton = page.locator('button:has-text("Ascultă Acum")');
  await listenButton.click();
  await page.waitForTimeout(3000);

  // Take screenshot of mini player
  await page.screenshot({ path: 'test-final-1-mini.png' });
  console.log('Mini player screenshot saved');

  // Click to expand
  console.log('Clicking on mini player to expand...');
  const miniPlayer = page.locator('text=Acum se redă').first();
  if (await miniPlayer.isVisible()) {
    await miniPlayer.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-final-2-expanded.png' });
    console.log('Expanded player screenshot saved');

    // Wait and take another screenshot to see the progress
    console.log('Waiting 5 seconds for playback...');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'test-final-3-playing.png' });
  }

  console.log('Test complete.');
  await context.close();
  await browser.close();
})();
