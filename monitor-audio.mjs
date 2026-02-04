import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({
    headless: false,
    devtools: true // Open DevTools automatically
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });

  const page = await context.newPage();

  // Capture ALL console messages with detailed info
  page.on('console', msg => {
    const type = msg.type().toUpperCase();
    const text = msg.text();
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];

    // Highlight audio-related messages
    if (text.includes('[Audio') || text.includes('audio') || text.includes('Audio')) {
      console.log(`\x1b[33m[${timestamp}] [BROWSER ${type}] ${text}\x1b[0m`);
    } else if (type === 'ERROR') {
      console.log(`\x1b[31m[${timestamp}] [BROWSER ${type}] ${text}\x1b[0m`);
    } else if (type === 'WARN') {
      console.log(`\x1b[35m[${timestamp}] [BROWSER ${type}] ${text}\x1b[0m`);
    } else {
      console.log(`[${timestamp}] [BROWSER ${type}] ${text}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`\x1b[31m[PAGE ERROR] ${error.message}\x1b[0m`);
  });

  // Monitor network requests for audio files
  page.on('request', request => {
    const url = request.url();
    if (url.includes('.opus') || url.includes('.mp3') || url.includes('.ogg') || url.includes('audio')) {
      console.log(`\x1b[36m[NETWORK REQUEST] ${request.method()} ${url}\x1b[0m`);
    }
  });

  page.on('response', response => {
    const url = response.url();
    if (url.includes('.opus') || url.includes('.mp3') || url.includes('.ogg') || url.includes('audio')) {
      const status = response.status();
      const statusColor = status >= 200 && status < 300 ? '\x1b[32m' : '\x1b[31m';
      console.log(`${statusColor}[NETWORK RESPONSE] ${status} ${url}\x1b[0m`);

      // Log headers for audio files (headers() is synchronous)
      try {
        const headers = response.headers();
        if (headers['content-type']) {
          console.log(`  Content-Type: ${headers['content-type']}`);
        }
        if (headers['content-length']) {
          console.log(`  Content-Length: ${headers['content-length']}`);
        }
        if (headers['content-range']) {
          console.log(`  Content-Range: ${headers['content-range']}`);
        }
        if (headers['accept-ranges']) {
          console.log(`  Accept-Ranges: ${headers['accept-ranges']}`);
        }
      } catch (e) {
        // Ignore header errors
      }
    }
  });

  page.on('requestfailed', request => {
    const url = request.url();
    if (url.includes('.opus') || url.includes('.mp3') || url.includes('.ogg') || url.includes('audio')) {
      console.log(`\x1b[31m[NETWORK FAILED] ${url} - ${request.failure()?.errorText}\x1b[0m`);
    }
  });

  console.log('\n===========================================');
  console.log('   AUDIO MONITORING SCRIPT - PRODUCTION');
  console.log('===========================================');
  console.log('Opening: https://predicapp-react.pages.dev/');
  console.log('DevTools should open automatically');
  console.log('');
  console.log('Instructions:');
  console.log('  1. Interact with the page in the browser');
  console.log('  2. Click "Listen Now" or go to Library > Courses/Saints');
  console.log('  3. Watch this console for audio events');
  console.log('');
  console.log('Press Ctrl+C to stop monitoring');
  console.log('===========================================\n');

  await page.goto('https://predicapp-react.pages.dev/');
  await page.waitForLoadState('networkidle');

  console.log('\n>>> Page loaded - you can now interact with it <<<\n');

  // Keep the script running until manually stopped
  // Poll and log audio state every 2 seconds
  let counter = 0;
  while (true) {
    await page.waitForTimeout(2000);
    counter++;

    // Every 10 seconds, try to log audio element state
    if (counter % 5 === 0) {
      try {
        const audioState = await page.evaluate(() => {
          const audio = document.querySelector('audio');
          if (audio) {
            return {
              src: audio.src ? audio.src.substring(0, 80) + '...' : 'none',
              currentTime: audio.currentTime.toFixed(2),
              duration: audio.duration,
              paused: audio.paused,
              readyState: audio.readyState,
              networkState: audio.networkState,
              buffered: audio.buffered.length > 0 ?
                `${audio.buffered.start(0).toFixed(2)}-${audio.buffered.end(audio.buffered.length-1).toFixed(2)}` :
                'none'
            };
          }
          return null;
        });

        if (audioState) {
          console.log(`\x1b[34m[AUDIO STATE] time=${audioState.currentTime}s, duration=${audioState.duration}, paused=${audioState.paused}, ready=${audioState.readyState}, net=${audioState.networkState}, buffered=${audioState.buffered}\x1b[0m`);
        }
      } catch (e) {
        // Page might have navigated, ignore
      }
    }
  }
})();
