import { test, expect } from '@playwright/test';

test.describe('User Workflow - Click and Play', () => {
  test('user clicks sermon and sees player with play button', async ({ page }) => {
    // Step 1: Go to homepage
    await page.goto('/');
    console.log('✓ Step 1: Homepage loaded');

    // Take screenshot of homepage
    await page.screenshot({ path: 'test-results/01-homepage.png', fullPage: true });

    // Step 2: Click "Ascultă Acum" button
    console.log('Looking for "Ascultă Acum" button...');
    const listenButton = page.getByRole('button', { name: /Ascultă Acum/i });
    await expect(listenButton).toBeVisible();
    console.log('✓ Step 2: Button found and visible');

    await listenButton.click();
    console.log('✓ Step 3: Clicked button');

    // Wait for navigation to player
    await page.waitForURL(/\/player\/s\d+/);
    console.log('✓ Step 4: Navigated to player page');

    // Take screenshot of player page
    await page.screenshot({ path: 'test-results/02-player-page.png', fullPage: true });

    // Step 5: Check what's visible on player page
    console.log('\n=== PLAYER PAGE ANALYSIS ===');

    // Count all buttons
    const allButtons = await page.locator('button').all();
    console.log(`Total buttons found: ${allButtons.length}`);

    // List all buttons
    for (let i = 0; i < allButtons.length; i++) {
      const buttonText = await allButtons[i].textContent();
      const isVisible = await allButtons[i].isVisible();
      console.log(`Button ${i + 1}: "${buttonText || '[icon only]'}" - Visible: ${isVisible}`);
    }

    // Check for play button specifically (it has a Play icon)
    const playButtons = await page.locator('button').filter({
      has: page.locator('svg')
    }).all();
    console.log(`\nButtons with SVG icons: ${playButtons.length}`);

    // Check for large circular button (the main play button)
    const largeButtons = await page.locator('button').filter({
      has: page.locator('svg')
    }).all();

    let playButtonFound = false;
    for (const btn of largeButtons) {
      const box = await btn.boundingBox();
      if (box && box.width > 60 && box.height > 60) {
        console.log(`\n✓ LARGE PLAY BUTTON FOUND: ${box.width}x${box.height}px`);
        playButtonFound = true;

        // Try to click it
        await btn.click();
        console.log('✓ Clicked play button');
        await page.waitForTimeout(2000);

        // Take screenshot after clicking
        await page.screenshot({ path: 'test-results/03-after-play-click.png', fullPage: true });
        break;
      }
    }

    if (!playButtonFound) {
      console.log('\n❌ LARGE PLAY BUTTON NOT FOUND!');
    }

    // Check for images
    const images = await page.locator('img').all();
    console.log(`\nImages found: ${images.length}`);
    for (let i = 0; i < images.length; i++) {
      const src = await images[i].getAttribute('src');
      const alt = await images[i].getAttribute('alt');
      console.log(`Image ${i + 1}: src="${src}", alt="${alt}"`);
    }

    // Check for the Orthodox cross SVG
    const svgs = await page.locator('svg').all();
    console.log(`\nSVG elements found: ${svgs.length}`);

    // Check what text is visible
    const sermonTitle = await page.getByText('Duminica Vameșului și Fariseului').isVisible();
    console.log(`\nSermon title visible: ${sermonTitle}`);

    const category = await page.getByText('Predici Liturgice').isVisible();
    console.log(`Category visible: ${category}`);

    // Summary
    console.log('\n=== SUMMARY ===');
    console.log(`Play button found: ${playButtonFound ? '✅ YES' : '❌ NO'}`);
    console.log(`Images found: ${images.length}`);
    console.log(`Sermon info visible: ${sermonTitle && category ? '✅ YES' : '❌ NO'}`);
  });
});
