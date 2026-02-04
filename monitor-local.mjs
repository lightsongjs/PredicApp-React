import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({
    headless: false,
    devtools: true
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });

  const page = await context.newPage();

  // Capture ALL console messages
  page.on('console', msg => {
    const type = msg.type().toUpperCase();
    const text = msg.text();
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];

    // Color code by type and content
    if (text.includes('canplaythrough') || text.includes('Duration changed')) {
      console.log(`\x1b[32m[${timestamp}] [${type}] ${text}\x1b[0m`); // Green for key events
    } else if (text.includes('[useAudio]') || text.includes('[AudioPlayer]')) {
      console.log(`\x1b[33m[${timestamp}] [${type}] ${text}\x1b[0m`); // Yellow for audio
    } else if (type === 'ERROR') {
      console.log(`\x1b[31m[${timestamp}] [${type}] ${text}\x1b[0m`); // Red for errors
    } else {
      console.log(`[${timestamp}] [${type}] ${text}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`\x1b[31m[PAGE ERROR] ${error.message}\x1b[0m`);
  });

  // Monitor network for audio
  page.on('request', request => {
    const url = request.url();
    if (url.includes('.opus') || url.includes('.mp3') || url.includes('audio')) {
      console.log(`\x1b[36m[NET REQ] ${url.substring(0, 100)}...\x1b[0m`);
    }
  });

  page.on('response', response => {
    const url = response.url();
    if (url.includes('.opus') || url.includes('.mp3') || url.includes('audio')) {
      console.log(`\x1b[36m[NET RES] ${response.status()} ${url.substring(0, 80)}...\x1b[0m`);
    }
  });

  console.log('\n=============================================');
  console.log('   LOCAL DEV MONITORING - http://localhost:5173');
  console.log('=============================================');
  console.log('Watching for:');
  console.log('  - canplaythrough events (GREEN)');
  console.log('  - Duration changes (GREEN)');
  console.log('  - Audio state logs (YELLOW)');
  console.log('=============================================\n');

  await page.goto('http://localhost:5173/');
  await page.waitForLoadState('networkidle');

  console.log('>>> Page loaded - interact with it to test <<<\n');

  // Keep running and poll audio state
  let counter = 0;
  while (true) {
    await page.waitForTimeout(2000);
    counter++;

    // Every 5 polls (10 seconds), log audio state if playing
    if (counter % 5 === 0) {
      try {
        const audioState = await page.evaluate(() => {
          const audio = document.querySelector('audio');
          if (audio && !audio.paused) {
            return {
              time: audio.currentTime.toFixed(1),
              dur: audio.duration?.toFixed(1) || 'N/A',
              paused: audio.paused,
              buffered: audio.buffered.length > 0 ?
                `${audio.buffered.end(audio.buffered.length-1).toFixed(1)}s` : 'none'
            };
          }
          return null;
        });

        if (audioState) {
          console.log(`\x1b[34m[AUDIO] time=${audioState.time}s dur=${audioState.dur}s buffered=${audioState.buffered}\x1b[0m`);
        }
      } catch (e) {
        // ignore
      }
    }
  }
})();
