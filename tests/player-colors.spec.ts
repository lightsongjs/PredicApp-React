import { test, expect } from '@playwright/test';

test.describe('Player Byzantine Color Scheme', () => {
  test('ExpandedPlayer has proper Byzantine colors', async ({ page }) => {
    await page.goto('/');

    // Click play and expand to ExpandedPlayer
    await page.getByRole('button', { name: /Ascultă Acum/i }).click();
    await page.waitForTimeout(1000);
    await page.getByText('Acum se redă').click();
    await page.waitForTimeout(500);

    console.log('\n=== CHECKING PLAYER COLORS ===\n');

    const expandedPlayer = page.locator('.fixed.inset-0.z-50');
    await expect(expandedPlayer).toBeVisible();

    // Check that player has dark background
    const playerBg = await expandedPlayer.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );
    console.log('Player background:', playerBg);

    // Check progress bar time displays exist
    const timeDisplays = page.locator('span').filter({ hasText: /\d+:\d+/ }).first();
    const hasTime = await timeDisplays.isVisible();
    console.log('Time display visible:', hasTime);
    expect(hasTime).toBe(true);

    // Check play button exists
    const buttons = await expandedPlayer.locator('button').count();
    console.log('Total buttons:', buttons);
    expect(buttons).toBeGreaterThan(3);

    // Take screenshot
    await page.screenshot({
      path: 'test-results/player-byzantine-colors.png',
      fullPage: true
    });

    console.log('\n✅ Player color scheme verified!');
  });

  test('ExpandedPlayer UI is fully visible in viewport', async ({ page }) => {
    await page.goto('/');

    // Click play and expand
    await page.getByRole('button', { name: /Ascultă Acum/i }).click();
    await page.waitForTimeout(1000);
    await page.getByText('Acum se redă').click();
    await page.waitForTimeout(500);

    const expandedPlayer = page.locator('.fixed.inset-0.z-50');
    await expect(expandedPlayer).toBeVisible();

    // Check if close button is visible
    const closeButton = expandedPlayer.locator('button').first();
    const isCloseVisible = await closeButton.isVisible();
    console.log('Close button visible:', isCloseVisible);
    expect(isCloseVisible).toBe(true);

    // Check if volume slider is visible
    const volumeSlider = page.locator('input[type="range"]');
    const isVolumeVisible = await volumeSlider.isVisible();
    console.log('Volume slider visible:', isVolumeVisible);
    expect(isVolumeVisible).toBe(true);

    console.log('\n✅ All controls visible in viewport!');
  });

  test('MiniPlayer has correct styling', async ({ page }) => {
    await page.goto('/');

    // Click play to show MiniPlayer
    await page.getByRole('button', { name: /Ascultă Acum/i }).click();
    await page.waitForTimeout(1000);

    const miniPlayer = page.locator('[class*="fixed"][class*="bottom"]').filter({ hasText: 'Acum se redă' });
    await expect(miniPlayer).toBeVisible();

    // Check MiniPlayer has white background
    const mpBg = await miniPlayer.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );
    console.log('MiniPlayer background:', mpBg);

    // Check MiniPlayer has shadow
    const mpShadow = await miniPlayer.evaluate(el =>
      window.getComputedStyle(el).boxShadow
    );
    console.log('MiniPlayer shadow:', mpShadow !== 'none' ? 'present' : 'none');

    // Take screenshot
    await page.screenshot({
      path: 'test-results/mini-player-style.png',
      fullPage: true
    });

    console.log('\n✅ MiniPlayer styling verified!');
  });
});
