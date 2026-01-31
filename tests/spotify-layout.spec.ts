import { test } from '@playwright/test';

test('show Spotify-style player layout', async ({ page }) => {
  console.log('\n=== SPOTIFY-STYLE PLAYER ===\n');

  // Set desktop viewport to see full layout
  await page.setViewportSize({ width: 1280, height: 800 });

  console.log('Step 1: Loading homepage...');
  await page.goto('http://localhost:5176/');
  await page.waitForLoadState('networkidle');

  // Take screenshot of homepage
  await page.screenshot({ path: 'test-results/01-homepage-spotify.png', fullPage: true });

  console.log('Step 2: Clicking on sermon...');
  const button = page.getByRole('button', { name: /Ascultă Acum/i });
  await button.click();

  await page.waitForURL(/\/player\/s\d+/);
  console.log('Step 3: Player page loaded');

  await page.waitForTimeout(1000);

  // Take screenshot of new Spotify-style player
  await page.screenshot({ path: 'test-results/02-spotify-player.png', fullPage: true });

  console.log('\n✨ NEW SPOTIFY-STYLE LAYOUT:');
  console.log('   📸 Album art on the LEFT');
  console.log('   📝 Sermon info on the RIGHT');
  console.log('   🎵 Progress bar at BOTTOM (full width)');
  console.log('   🔊 Volume on the LEFT of controls');
  console.log('   ⏯️  Play controls in the CENTER');
  console.log('   ℹ️  Duration info on the RIGHT');

  // Click play
  console.log('\nStep 4: Clicking PLAY...');
  const playButton = page.locator('button').filter({
    has: page.locator('svg')
  }).nth(6);

  await playButton.click();
  console.log('   ⏳ Watch for spinning animation...');

  await page.waitForTimeout(2000);

  // Take screenshot while playing
  await page.screenshot({ path: 'test-results/03-spotify-playing.png', fullPage: true });

  // Check audio state
  const audioState = await page.evaluate(() => {
    const audios = document.querySelectorAll('audio');
    if (audios.length > 0) {
      return {
        playing: !audios[0].paused,
        time: Math.floor(audios[0].currentTime),
        duration: Math.floor(audios[0].duration),
      };
    }
    return null;
  });

  if (audioState?.playing) {
    console.log(`\n✅ AUDIO PLAYING: ${audioState.time}s / ${audioState.duration}s`);
  }

  console.log('\nKeeping browser open for 20 seconds...');
  console.log('>>> Check out the Spotify-style layout! <<<');

  await page.waitForTimeout(20000);
});
