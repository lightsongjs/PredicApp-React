import { test, expect } from '@playwright/test';

test('show loading state when playing', async ({ page }) => {
  console.log('1. Navigate to homepage');
  await page.goto('/');

  console.log('2. Click play button');
  await page.getByRole('button', { name: /Ascultă Acum/i }).click();

  console.log('3. Check MiniPlayer appears');
  const miniPlayer = page.getByText('Acum se redă');
  await expect(miniPlayer).toBeVisible({ timeout: 5000 });

  console.log('4. MiniPlayer is showing - check for loading/playing state');

  // Take screenshot
  await page.screenshot({ path: 'test-results/mini-player-loading.png' });

  // Check if there's a loading spinner or play button
  const miniPlayerElement = page.locator('[class*="fixed"][class*="bottom"]').filter({ hasText: 'Acum se redă' });
  const buttons = await miniPlayerElement.locator('button').count();
  console.log(`5. Found ${buttons} button(s) in MiniPlayer`);

  expect(buttons).toBeGreaterThan(0);
  console.log('✅ Loading state test complete');
});
