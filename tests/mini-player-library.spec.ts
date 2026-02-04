import { test, expect } from '@playwright/test';

test('mini player shows on library page after playing from series', async ({ page }) => {
  // Go to library page
  await page.goto('/library');
  console.log('✓ Navigated to library page');

  // Click on Series tab
  await page.getByRole('button', { name: 'Serii' }).click();
  await page.waitForTimeout(500);
  console.log('✓ Clicked on Serii tab');

  // Click on first series to expand it
  const firstSeries = page.locator('.bg-white.rounded-xl').first();
  await firstSeries.click();
  await page.waitForTimeout(500);
  console.log('✓ Expanded first series');

  // Click play on the first sermon in the series
  const playButton = page.locator('.play-btn').first();
  await playButton.click();
  await page.waitForTimeout(1000);
  console.log('✓ Clicked play on first sermon');

  // Verify mini player appears on library page
  const miniPlayer = page.locator('text=Acum se redă');
  await expect(miniPlayer).toBeVisible({ timeout: 5000 });
  console.log('✓ Mini player is visible on library page!');

  // Take screenshot for visual verification
  await page.screenshot({ path: 'test-results/mini-player-library.png' });
  console.log('✓ Screenshot saved');
});

test('favicon has orange circle', async ({ page }) => {
  await page.goto('/');

  // Check the favicon link
  const faviconLink = page.locator('link[rel="icon"]');
  const href = await faviconLink.getAttribute('href');
  expect(href).toBe('/favicon.svg');
  console.log('✓ Favicon link points to /favicon.svg');

  // Fetch the favicon and verify it contains orange circle
  const response = await page.request.get('/favicon.svg');
  const svgContent = await response.text();
  expect(svgContent).toContain('#e67e22'); // Orange color
  expect(svgContent).toContain('circle');
  console.log('✓ Favicon SVG contains orange circle');
});

test('header uses favicon icon instead of church', async ({ page }) => {
  await page.goto('/');

  // Check for the Orthodox Cross image in header
  const headerIcon = page.locator('img[alt="Orthodox Cross"]');
  await expect(headerIcon).toBeVisible();
  console.log('✓ Header shows Orthodox Cross icon');

  // Verify the src points to favicon
  const src = await headerIcon.getAttribute('src');
  expect(src).toBe('/favicon.svg');
  console.log('✓ Header icon uses /favicon.svg');
});
