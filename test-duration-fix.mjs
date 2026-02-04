import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 900 }
  });

  const page = await context.newPage();

  console.log('Navigating to the site...');
  await page.goto('https://predicapp-react.pages.dev/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('Clicking "Ascultă Acum" button...');
  const listenButton = page.locator('button:has-text("Ascultă Acum")');
  await listenButton.click();
  await page.waitForTimeout(3000);

  // Take screenshot of mini player
  await page.screenshot({ path: 'test-duration-mini.png' });

  // Click to expand
  console.log('Clicking on mini player to expand...');
  const miniPlayer = page.locator('text=Acum se redă').first();
  if (await miniPlayer.isVisible()) {
    await miniPlayer.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-duration-expanded.png' });

    // Check the duration display
    const durationText = await page.locator('text=/\\d+:\\d+/').allTextContents();
    console.log('Duration texts found:', durationText);
  }

  console.log('Test complete.');
  await context.close();
  await browser.close();
})();
