import { test, expect } from '@playwright/test';

test.describe('User Workflow - Click and Play', () => {
  test('user clicks sermon and sees MiniPlayer', async ({ page }) => {
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

    // Step 4: MiniPlayer should appear (not navigation)
    await page.waitForTimeout(1000);
    const miniPlayer = page.getByText('Acum se redă');
    await expect(miniPlayer).toBeVisible({ timeout: 5000 });
    console.log('✓ Step 4: MiniPlayer appeared');

    // Take screenshot with MiniPlayer
    await page.screenshot({ path: 'test-results/02-mini-player.png', fullPage: true });

    // Step 5: Analyze MiniPlayer
    console.log('\n=== MINI PLAYER ANALYSIS ===');

    // Check for play/pause button in MiniPlayer
    const miniPlayerElement = page.locator('[class*="fixed"][class*="bottom"]').filter({ hasText: 'Acum se redă' });
    const buttons = await miniPlayerElement.locator('button').count();
    console.log(`Buttons in MiniPlayer: ${buttons}`);

    // Step 6: Click MiniPlayer to expand
    await miniPlayer.click();
    await page.waitForTimeout(500);
    console.log('✓ Step 5: Clicked MiniPlayer to expand');

    // Take screenshot of expanded player
    await page.screenshot({ path: 'test-results/03-expanded-player.png', fullPage: true });

    // Step 7: Verify ExpandedPlayer
    const expandedPlayer = page.locator('.fixed.inset-0.z-50');
    await expect(expandedPlayer).toBeVisible();
    console.log('✓ Step 6: ExpandedPlayer visible');

    // Check for large play button
    const allButtons = await expandedPlayer.locator('button').all();
    console.log(`\nTotal buttons in ExpandedPlayer: ${allButtons.length}`);

    let largePlayFound = false;
    for (const btn of allButtons) {
      const box = await btn.boundingBox();
      if (box && box.width > 50 && box.height > 50) {
        console.log(`✓ Large button found: ${Math.round(box.width)}x${Math.round(box.height)}px`);
        largePlayFound = true;
      }
    }

    // Summary
    console.log('\n=== SUMMARY ===');
    console.log(`MiniPlayer shown: ✅ YES`);
    console.log(`ExpandedPlayer shown: ✅ YES`);
    console.log(`Large play button found: ${largePlayFound ? '✅ YES' : '❌ NO'}`);
  });

  test('user can navigate via bottom nav on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Click on Bibliotecă in bottom nav (fixed at bottom)
    const bottomNav = page.locator('nav.fixed.bottom-0');
    await bottomNav.getByText('Bibliotecă').click();
    await page.waitForURL('/library');
    console.log('✓ Navigated to Library via bottom nav');

    // Verify we're on library page
    await expect(page.locator('h1').filter({ hasText: 'Biblioteca' })).toBeVisible();

    // Click on Acasă to go back
    await bottomNav.getByText('Acasă').click();
    await page.waitForURL('/');
    console.log('✓ Navigated back to Home via bottom nav');
  });
});
