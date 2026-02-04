import { test, expect } from '@playwright/test';

test('debug audio playback with console logs', async ({ page }) => {
  // Capture console logs
  const logs: string[] = [];
  page.on('console', msg => {
    logs.push(`${msg.type()}: ${msg.text()}`);
  });

  await page.goto('/');
  console.log('✓ Homepage loaded');

  // Click play
  await page.getByRole('button', { name: /Ascultă Acum/i }).click();
  await page.waitForTimeout(2000);
  console.log('✓ Clicked play button');

  // Check MiniPlayer appeared
  const miniPlayer = page.getByText('Acum se redă');
  await expect(miniPlayer).toBeVisible();
  console.log('✓ MiniPlayer visible');

  // Debug audio element
  const audioInfo = await page.evaluate(() => {
    const audios = document.querySelectorAll('audio');
    if (audios.length > 0) {
      const audio = audios[0];
      return {
        src: audio.src,
        paused: audio.paused,
        currentTime: audio.currentTime,
        duration: audio.duration,
        readyState: audio.readyState,
        error: audio.error ? audio.error.message : null,
      };
    }
    return { error: 'No audio element found' };
  });

  console.log('\n=== AUDIO DEBUG INFO ===');
  console.log('Audio info:', JSON.stringify(audioInfo, null, 2));

  // Log any console messages from the page
  if (logs.length > 0) {
    console.log('\n=== PAGE CONSOLE LOGS ===');
    logs.slice(-10).forEach(log => console.log(log));
  }

  // Audio element may be lazy loaded, just verify MiniPlayer works
  console.log('\n✅ Audio debug complete');
});
