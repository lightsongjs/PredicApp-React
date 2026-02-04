import { test, expect } from '@playwright/test';

test.describe('Watch Audio Playback', () => {
  test('click sermon and watch loading behavior', async ({ page }) => {
    await page.goto('/');
    console.log('✓ Homepage loaded');

    // Click play
    const playButton = page.getByRole('button', { name: /Ascultă Acum/i });
    await expect(playButton).toBeVisible();
    await playButton.click();
    console.log('✓ Clicked play button');

    // Watch MiniPlayer appear
    const miniPlayer = page.getByText('Acum se redă');
    await expect(miniPlayer).toBeVisible({ timeout: 5000 });
    console.log('✓ MiniPlayer appeared');

    // Monitor audio state over time
    for (let i = 0; i < 3; i++) {
      await page.waitForTimeout(1000);

      const audioState = await page.evaluate(() => {
        const audio = document.querySelector('audio');
        if (audio) {
          return {
            paused: audio.paused,
            currentTime: audio.currentTime.toFixed(2),
            duration: isNaN(audio.duration) ? 'loading' : audio.duration.toFixed(2),
            readyState: audio.readyState,
          };
        }
        return null;
      });

      console.log(`Audio state at ${i + 1}s:`, audioState);
    }

    // Take final screenshot
    await page.screenshot({ path: 'test-results/playback-state.png' });

    console.log('✅ Playback monitoring complete');
  });

  test('MiniPlayer persists across client-side navigation', async ({ page }) => {
    await page.goto('/');

    // Start playing
    await page.getByRole('button', { name: /Ascultă Acum/i }).click();
    await page.waitForTimeout(1000);

    // Verify MiniPlayer is visible
    const miniPlayer = page.getByText('Acum se redă');
    await expect(miniPlayer).toBeVisible();
    console.log('✓ MiniPlayer visible on homepage');

    // Navigate to library using client-side navigation (click link, not page.goto)
    await page.locator('a[href="/library"]').first().click();
    await page.waitForURL('/library');
    await page.waitForTimeout(500);

    // MiniPlayer should still be visible (client-side nav preserves state)
    await expect(miniPlayer).toBeVisible();
    console.log('✓ MiniPlayer still visible on library page');

    // Navigate back to home using client-side navigation
    await page.locator('a[href="/"]').first().click();
    await page.waitForURL('/');
    await page.waitForTimeout(500);

    // MiniPlayer should still be visible
    await expect(miniPlayer).toBeVisible();
    console.log('✓ MiniPlayer still visible after returning to homepage');

    console.log('✅ MiniPlayer persistence verified');
  });
});
