import { test } from '@playwright/test';

test('debug audio playback with console logs', async ({ page }) => {
  // Listen to all console messages from the page
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();

    if (type === 'log') {
      console.log(`[PAGE LOG] ${text}`);
    } else if (type === 'error') {
      console.error(`[PAGE ERROR] ${text}`);
    } else if (type === 'warning') {
      console.warn(`[PAGE WARN] ${text}`);
    }
  });

  console.log('\n========================================');
  console.log('🔍 AUDIO PLAYBACK DEBUG TEST');
  console.log('========================================\n');

  console.log('Step 1: Going to player page...');
  await page.goto('/player/s004');
  await page.waitForLoadState('networkidle');

  console.log('\nStep 2: Waiting 2 seconds...');
  await page.waitForTimeout(2000);

  console.log('\n========================================');
  console.log('🎯 CLICKING PLAY BUTTON NOW!');
  console.log('========================================\n');

  const playButton = page.locator('button').filter({
    has: page.locator('svg')
  }).nth(6);

  const startTime = Date.now();
  await playButton.click();

  console.log('\n⏱️  Play button clicked at:', new Date().toLocaleTimeString());
  console.log('⏳ Watching for audio to start...\n');

  // Wait and check audio state every second
  for (let i = 0; i < 10; i++) {
    await page.waitForTimeout(1000);

    const audioState = await page.evaluate(() => {
      const audios = document.querySelectorAll('audio');
      if (audios.length > 0) {
        return {
          paused: audios[0].paused,
          currentTime: audios[0].currentTime,
          readyState: audios[0].readyState,
          networkState: audios[0].networkState,
        };
      }
      return null;
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    if (audioState) {
      console.log(`[${elapsed}s] Audio state:`,
        `paused=${audioState.paused}`,
        `time=${audioState.currentTime.toFixed(2)}s`,
        `ready=${audioState.readyState}`,
        `network=${audioState.networkState}`
      );

      if (!audioState.paused && audioState.currentTime > 0) {
        console.log(`\n✅ AUDIO IS PLAYING! (started after ${elapsed}s)`);
        break;
      }
    } else {
      console.log(`[${elapsed}s] No audio element found`);
    }
  }

  console.log('\n========================================');
  console.log('Keeping browser open for 10 more seconds...');
  console.log('========================================\n');

  await page.waitForTimeout(10000);
});
