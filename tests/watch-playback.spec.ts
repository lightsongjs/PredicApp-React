import { test, expect } from '@playwright/test';

test.describe('Watch Audio Playback', () => {
  test('click sermon and watch loading behavior', async ({ page }) => {
    // Step 1: Go to homepage
    console.log('Step 1: Loading homepage...');
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait a bit so you can see
    await page.waitForTimeout(2000);

    // Step 2: Click on "Ascultă Acum"
    console.log('Step 2: Clicking "Ascultă Acum" button...');
    const button = page.getByRole('button', { name: /Ascultă Acum/i });
    await button.click();

    // Wait for player to load
    await page.waitForURL(/\/player\/s\d+/);
    console.log('Step 3: Player page loaded');

    // Wait a bit so you can see the player
    await page.waitForTimeout(2000);

    // Step 4: Click the play button
    console.log('Step 4: Looking for play button...');
    const playButton = page.locator('button').filter({
      has: page.locator('svg')
    }).nth(6); // Main play button

    console.log('Step 5: Clicking PLAY button...');
    await playButton.click();

    console.log('Step 6: WATCHING what happens...');
    console.log('>>> Look at the screen - does anything happen immediately?');
    console.log('>>> Do you see "Se încarcă..." text?');
    console.log('>>> Does the play button change?');

    // Wait 10 seconds to observe behavior
    await page.waitForTimeout(10000);

    // Check if audio is playing
    const isPlaying = await page.evaluate(() => {
      const audios = document.querySelectorAll('audio');
      if (audios.length > 0) {
        return !audios[0].paused;
      }
      return false;
    });

    console.log(`\nAudio playing: ${isPlaying ? 'YES ✅' : 'NO ❌'}`);

    // Keep browser open for 30 more seconds so you can interact
    console.log('\nKeeping browser open for 30 seconds so you can observe...');
    await page.waitForTimeout(30000);
  });
});
