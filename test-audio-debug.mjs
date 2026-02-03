import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    recordVideo: { dir: './test-videos/' },
    viewport: { width: 1200, height: 900 }
  });

  const page = await context.newPage();

  // Inject a script to monitor audio element creation and events
  await page.addInitScript(() => {
    const originalAudio = window.Audio;
    let audioCount = 0;

    window.Audio = function(...args) {
      const audio = new originalAudio(...args);
      const id = ++audioCount;
      console.log(`[AUDIO ${id}] Created new Audio element`);

      const events = ['loadstart', 'canplay', 'play', 'pause', 'timeupdate', 'durationchange', 'error', 'ended', 'seeking', 'seeked', 'waiting', 'stalled', 'suspend', 'abort'];

      events.forEach(event => {
        audio.addEventListener(event, () => {
          if (event === 'timeupdate') {
            // Only log timeupdate occasionally to avoid spam
            if (Math.floor(audio.currentTime) !== Math.floor(audio._lastLoggedTime || 0)) {
              audio._lastLoggedTime = audio.currentTime;
              console.log(`[AUDIO ${id}] ${event}: time=${audio.currentTime.toFixed(2)}, duration=${audio.duration.toFixed(2)}, paused=${audio.paused}, src=${audio.src.slice(-50)}`);
            }
          } else {
            console.log(`[AUDIO ${id}] ${event}: time=${audio.currentTime.toFixed(2)}, duration=${(audio.duration || 0).toFixed(2)}, paused=${audio.paused}, readyState=${audio.readyState}, networkState=${audio.networkState}`);
          }
        });
      });

      // Also monitor src changes
      const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
      Object.defineProperty(audio, 'src', {
        get: function() {
          return originalSrcDescriptor.get.call(this);
        },
        set: function(value) {
          console.log(`[AUDIO ${id}] Setting src to: ${value.slice(-80)}`);
          return originalSrcDescriptor.set.call(this, value);
        }
      });

      return audio;
    };

    window.Audio.prototype = originalAudio.prototype;
  });

  // Capture all console messages
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[AUDIO') || msg.type() === 'error' || msg.type() === 'warning') {
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

  console.log('\n--- Clicking "Ascultă Acum" button ---\n');
  const listenButton = page.locator('button:has-text("Ascultă Acum")');
  await listenButton.click();

  // Wait and monitor
  console.log('\n--- Waiting 15 seconds to observe audio behavior ---\n');
  await page.waitForTimeout(15000);

  await page.screenshot({ path: 'test-debug-1.png' });

  // Click to expand
  console.log('\n--- Clicking on mini player to expand ---\n');
  const miniPlayer = page.locator('text=Acum se redă').first();
  if (await miniPlayer.isVisible()) {
    await miniPlayer.click();
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'test-debug-2.png' });
  }

  console.log('\n--- Test complete ---\n');
  await context.close();
  await browser.close();
})();
