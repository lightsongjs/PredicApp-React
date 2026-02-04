import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    recordVideo: { dir: './test-videos/' },
    viewport: { width: 1200, height: 900 }
  });

  const page = await context.newPage();

  // Inject audio monitoring
  await page.addInitScript(() => {
    const originalAudio = window.Audio;
    let audioCount = 0;

    window.Audio = function(...args) {
      const audio = new originalAudio(...args);
      const id = ++audioCount;
      console.log(`[AUDIO ${id}] Created new Audio element`);

      // Monitor src changes
      let currentSrc = '';
      const checkSrc = setInterval(() => {
        if (audio.src !== currentSrc) {
          currentSrc = audio.src;
          console.log(`[AUDIO ${id}] SRC changed to: ${audio.src.slice(-60)}`);
        }
      }, 100);

      const events = ['loadstart', 'canplay', 'play', 'pause', 'error', 'ended', 'stalled', 'waiting', 'abort'];
      events.forEach(event => {
        audio.addEventListener(event, () => {
          console.log(`[AUDIO ${id}] ${event}: time=${audio.currentTime.toFixed(2)}, paused=${audio.paused}, readyState=${audio.readyState}`);
        });
      });

      // Log timeupdate every second
      let lastSecond = -1;
      audio.addEventListener('timeupdate', () => {
        const sec = Math.floor(audio.currentTime);
        if (sec !== lastSecond) {
          lastSecond = sec;
          console.log(`[AUDIO ${id}] Playing at ${sec}s (duration: ${audio.duration?.toFixed(2) || 'unknown'})`);
        }
      });

      return audio;
    };
    window.Audio.prototype = originalAudio.prototype;
  });

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[AUDIO') || msg.type() === 'error') {
      console.log(`[BROWSER] ${text}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
  });

  console.log('Navigating to the site...');
  await page.goto('https://predicapp-react.pages.dev/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Click on a sermon from "Predici Viitoare" list (right sidebar)
  console.log('\n--- Clicking on "Duminica Fiului Risipitor" from upcoming sermons ---\n');

  // Find and click on the first sermon in the upcoming list
  const upcomingSermon = page.locator('text=Duminica Fiului Risipitor').first();
  if (await upcomingSermon.isVisible()) {
    await upcomingSermon.click();
    console.log('Clicked on upcoming sermon');
  } else {
    // Try clicking any play button in the right sidebar
    console.log('Looking for play buttons in the sermon list...');
    const playButtons = page.locator('section:has-text("Predici Viitoare") button, section:has-text("Predici Viitoare") [class*="play"]');
    const count = await playButtons.count();
    console.log(`Found ${count} potential play elements`);
    if (count > 0) {
      await playButtons.first().click();
    }
  }

  // Wait and monitor for 20 seconds
  console.log('\n--- Monitoring audio for 20 seconds ---\n');
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(1000);
    if (i === 5) {
      await page.screenshot({ path: 'test-upcoming-5s.png' });
    }
    if (i === 10) {
      await page.screenshot({ path: 'test-upcoming-10s.png' });
    }
  }

  await page.screenshot({ path: 'test-upcoming-final.png' });

  console.log('\n--- Test complete ---\n');
  await context.close();
  await browser.close();
})();
