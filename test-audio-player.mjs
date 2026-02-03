import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    recordVideo: { dir: './test-videos/' },
    viewport: { width: 1200, height: 900 }
  });

  const page = await context.newPage();

  // Enable console logging to see any errors
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[${msg.type()}] ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
  });

  console.log('Navigating to the site...');
  await page.goto('https://predicapp-react.pages.dev/');
  await page.waitForLoadState('networkidle');

  console.log('Taking screenshot of home page...');
  await page.screenshot({ path: 'test-1-home.png' });

  // Wait a moment for the page to fully render
  await page.waitForTimeout(2000);

  // Click on "Ascultă Acum" button to play the featured sermon
  console.log('Clicking on "Ascultă Acum" button...');
  const listenButton = page.locator('button:has-text("Ascultă Acum")');
  if (await listenButton.isVisible()) {
    await listenButton.click();
    console.log('Clicked listen button');
  } else {
    // Try clicking a play button in the sermon list
    console.log('Listen button not found, trying play button in list...');
    const playButton = page.locator('.material-symbols-outlined:has-text("play_arrow")').first();
    await playButton.click();
  }

  // Wait for mini player to appear
  await page.waitForTimeout(2000);
  console.log('Taking screenshot after starting playback...');
  await page.screenshot({ path: 'test-2-playing.png' });

  // Monitor audio for 10 seconds
  console.log('Monitoring audio playback for 10 seconds...');
  for (let i = 0; i < 10; i++) {
    await page.waitForTimeout(1000);

    // Try to get audio state from the page
    const audioState = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      if (audio) {
        return {
          currentTime: audio.currentTime,
          duration: audio.duration,
          paused: audio.paused,
          ended: audio.ended,
          readyState: audio.readyState,
          networkState: audio.networkState,
          error: audio.error ? audio.error.message : null,
          src: audio.src
        };
      }
      return null;
    });

    console.log(`[${i+1}s] Audio state:`, audioState);
  }

  await page.screenshot({ path: 'test-3-after-10s.png' });

  // Try clicking on mini player to expand
  console.log('Clicking on mini player to expand...');
  const miniPlayer = page.locator('text=Acum se redă').first();
  if (await miniPlayer.isVisible()) {
    await miniPlayer.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-4-expanded.png' });

    // Monitor expanded player for 5 more seconds
    console.log('Monitoring expanded player for 5 seconds...');
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(1000);
      const audioState = await page.evaluate(() => {
        const audio = document.querySelector('audio');
        if (audio) {
          return {
            currentTime: audio.currentTime,
            paused: audio.paused,
            error: audio.error ? audio.error.message : null
          };
        }
        return null;
      });
      console.log(`[Expanded ${i+1}s] Audio state:`, audioState);
    }
  }

  await page.screenshot({ path: 'test-5-final.png' });

  console.log('Test complete. Closing browser...');
  await context.close();
  await browser.close();

  console.log('Video saved to test-videos/ folder');
})();
