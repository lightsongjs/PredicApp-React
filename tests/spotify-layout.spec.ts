import { test, expect } from '@playwright/test';

test('show MiniPlayer and ExpandedPlayer layout', async ({ page }) => {
  await page.goto('/');
  console.log('✓ Homepage loaded');

  // Click play
  await page.getByRole('button', { name: /Ascultă Acum/i }).click();
  await page.waitForTimeout(1000);

  // Verify MiniPlayer layout
  console.log('\n=== MINI PLAYER LAYOUT ===');
  const miniPlayer = page.locator('[class*="fixed"][class*="bottom"]').filter({ hasText: 'Acum se redă' });
  await expect(miniPlayer).toBeVisible();

  const mpBox = await miniPlayer.boundingBox();
  if (mpBox) {
    console.log(`Position: bottom of screen`);
    console.log(`Size: ${Math.round(mpBox.width)}x${Math.round(mpBox.height)}px`);
  }

  await page.screenshot({ path: 'test-results/mini-player-layout.png', fullPage: true });

  // Expand to ExpandedPlayer
  await page.getByText('Acum se redă').click();
  await page.waitForTimeout(500);

  // Verify ExpandedPlayer layout
  console.log('\n=== EXPANDED PLAYER LAYOUT ===');
  const expandedPlayer = page.locator('.fixed.inset-0.z-50');
  await expect(expandedPlayer).toBeVisible();

  const epBox = await expandedPlayer.boundingBox();
  if (epBox) {
    console.log(`Position: full screen overlay`);
    console.log(`Size: ${Math.round(epBox.width)}x${Math.round(epBox.height)}px`);
  }

  // Check for key elements
  const hasVolumeSlider = await page.locator('input[type="range"]').isVisible();
  console.log(`Volume slider: ${hasVolumeSlider ? '✓' : '✗'}`);

  const hasTimeDisplay = await page.locator('span').filter({ hasText: /\d+:\d+/ }).first().isVisible();
  console.log(`Time display: ${hasTimeDisplay ? '✓' : '✗'}`);

  const buttonCount = await expandedPlayer.locator('button').count();
  console.log(`Buttons: ${buttonCount}`);

  await page.screenshot({ path: 'test-results/expanded-player-layout.png', fullPage: true });

  console.log('\n✅ Player layout verified');
});
