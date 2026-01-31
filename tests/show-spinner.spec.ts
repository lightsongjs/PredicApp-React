import { test } from '@playwright/test';

test('show spinning play button', async ({ page }) => {
  console.log('Opening player page...');
  await page.goto('/player/s004');
  await page.waitForLoadState('networkidle');

  console.log('\n=== WATCH THE PLAY BUTTON ===');
  console.log('1. You should see a GOLD circle play button');
  console.log('2. Click it and watch it SPIN while loading');
  console.log('3. The spinner should replace the play icon');

  await page.waitForTimeout(3000);

  console.log('\nClicking PLAY button now...');
  const playButton = page.locator('button').filter({
    has: page.locator('svg')
  }).nth(6);

  await playButton.click();

  console.log('>>> BUTTON CLICKED - Watch for spinning animation! <<<');

  // Take screenshot of spinning button
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'test-results/spinning-button.png' });

  console.log('\nWaiting 10 seconds for you to observe...');
  await page.waitForTimeout(10000);

  // Check audio state
  const audioState = await page.evaluate(() => {
    const audios = document.querySelectorAll('audio');
    if (audios.length > 0) {
      return {
        exists: true,
        paused: audios[0].paused,
        readyState: audios[0].readyState,
        currentTime: audios[0].currentTime,
        duration: audios[0].duration,
        src: audios[0].src,
      };
    }
    return { exists: false };
  });

  console.log('\n=== AUDIO STATE ===');
  console.log(JSON.stringify(audioState, null, 2));

  console.log('\nKeeping window open for another 20 seconds...');
  await page.waitForTimeout(20000);
});
