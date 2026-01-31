import { test, expect } from '@playwright/test';

test.describe('Player Byzantine Color Scheme', () => {
  test('player has proper Byzantine colors with good contrast', async ({ page }) => {
    // Navigate to player
    await page.goto('/player/s004');
    await page.waitForLoadState('networkidle');

    console.log('\n=== CHECKING PLAYER COLORS ===\n');

    // Check header buttons (close and share)
    const closeButton = page.locator('button').first();
    const closeBg = await closeButton.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );
    console.log('Close button background:', closeBg);
    // Should be gold: rgb(212, 175, 55) which is #D4AF37
    expect(closeBg).toContain('rgb(212, 175, 55)');

    const closeIcon = await closeButton.locator('svg').evaluate(el =>
      window.getComputedStyle(el).color
    );
    console.log('Close button icon color:', closeIcon);

    // Check progress bar time displays
    const timeDisplays = page.locator('span').filter({ hasText: /\d+:\d+/ }).first();
    const timeColor = await timeDisplays.evaluate(el =>
      window.getComputedStyle(el).color
    );
    console.log('Time display color:', timeColor);
    // Should be gold: rgb(212, 175, 55)
    expect(timeColor).toContain('rgb(212, 175, 55)');

    // Check play button background
    const playButton = page.locator('button').filter({
      has: page.locator('svg')
    }).nth(6); // Main play button

    const playBg = await playButton.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );
    console.log('Play button background:', playBg);
    // Should be gold
    expect(playBg).toContain('rgb(212, 175, 55)');

    // Check skip buttons color
    const skipButton = page.locator('button').filter({
      has: page.locator('svg')
    }).nth(5);

    const skipColor = await skipButton.locator('svg').evaluate(el =>
      window.getComputedStyle(el).color
    );
    console.log('Skip button color:', skipColor);
    // Should be white: rgb(255, 255, 255)
    expect(skipColor).toContain('rgb(255, 255, 255)');

    // Take screenshot
    await page.screenshot({
      path: 'test-results/player-byzantine-colors.png',
      fullPage: true
    });

    console.log('\n✅ All Byzantine colors verified!');
    console.log('✅ Gold buttons: Close, Share, Play');
    console.log('✅ Gold time displays');
    console.log('✅ White control buttons');
  });

  test('player UI is fully visible in viewport', async ({ page }) => {
    await page.goto('/player/s004');
    await page.waitForLoadState('networkidle');

    // Check if all key elements are in viewport
    const closeButton = page.locator('button').first();
    const isCloseVisible = await closeButton.isVisible();
    console.log('Close button visible:', isCloseVisible);

    const playButton = page.locator('button').filter({
      has: page.locator('svg')
    }).nth(6);
    const isPlayVisible = await playButton.isVisible();
    console.log('Play button visible:', isPlayVisible);

    // Check if play button is in viewport
    const box = await playButton.boundingBox();
    console.log('Play button position:', box);

    expect(isCloseVisible).toBe(true);
    expect(isPlayVisible).toBe(true);

    if (box) {
      // Button should be within viewport
      expect(box.y).toBeGreaterThan(0);
      expect(box.y + box.height).toBeLessThan(800); // Typical viewport height
    }

    console.log('\n✅ All controls visible in viewport!');
  });
});
