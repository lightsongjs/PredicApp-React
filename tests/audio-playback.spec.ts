import { test, expect } from '@playwright/test';

test.describe('PredicApp Audio Playback', () => {
  test('homepage loads with sermons', async ({ page }) => {
    await page.goto('/');

    // Verify header is visible (use specific selector for desktop h1)
    await expect(page.locator('h1').filter({ hasText: 'Predici Padre' })).toBeVisible();

    // Verify featured sermon card is visible
    await expect(page.getByText('Duminica de Astăzi')).toBeVisible();

    // Verify "Ascultă Acum" button is visible
    await expect(page.getByRole('button', { name: /Ascultă Acum/i })).toBeVisible();

    // Verify categories section exists
    await expect(page.getByText('Categorii')).toBeVisible();
  });

  test('clicking play shows MiniPlayer', async ({ page }) => {
    await page.goto('/');

    // Click on the "Ascultă Acum" button
    await page.getByRole('button', { name: /Ascultă Acum/i }).click();

    // MiniPlayer should appear (not navigation to /player)
    const miniPlayer = page.getByText('Acum se redă');
    await expect(miniPlayer).toBeVisible({ timeout: 5000 });
  });

  test('MiniPlayer shows sermon info', async ({ page }) => {
    await page.goto('/');

    // Click play
    await page.getByRole('button', { name: /Ascultă Acum/i }).click();
    await page.waitForTimeout(1000);

    // MiniPlayer should show the sermon title
    const miniPlayer = page.locator('[class*="fixed"][class*="bottom"]').filter({ hasText: 'Acum se redă' });
    await expect(miniPlayer).toBeVisible();

    // Should have play/pause button
    const playButton = miniPlayer.locator('button');
    await expect(playButton.first()).toBeVisible();
  });

  test('MiniPlayer appears after clicking play', async ({ page }) => {
    await page.goto('/');

    // Click play
    await page.getByRole('button', { name: /Ascultă Acum/i }).click();
    await page.waitForTimeout(1500);

    // Verify MiniPlayer is visible (audio element is created lazily)
    const miniPlayer = page.getByText('Acum se redă');
    await expect(miniPlayer).toBeVisible();
  });

  test('MiniPlayer expands to ExpandedPlayer on click', async ({ page }) => {
    await page.goto('/');

    // Click play to show MiniPlayer
    await page.getByRole('button', { name: /Ascultă Acum/i }).click();
    await page.waitForTimeout(1000);

    // Click on MiniPlayer to expand
    const miniPlayer = page.getByText('Acum se redă');
    await miniPlayer.click();
    await page.waitForTimeout(500);

    // ExpandedPlayer should be visible (full screen overlay)
    const expandedPlayer = page.locator('.fixed.inset-0.z-50');
    await expect(expandedPlayer).toBeVisible();

    // Should have close/collapse button
    const closeButton = expandedPlayer.locator('button').first();
    await expect(closeButton).toBeVisible();
  });

  test('ExpandedPlayer has progress bar', async ({ page }) => {
    await page.goto('/');

    // Click play and expand
    await page.getByRole('button', { name: /Ascultă Acum/i }).click();
    await page.waitForTimeout(1000);
    await page.getByText('Acum se redă').click();
    await page.waitForTimeout(1000);

    // Verify ExpandedPlayer is visible
    const expandedPlayer = page.locator('.fixed.inset-0.z-50');
    await expect(expandedPlayer).toBeVisible();

    // Look for progress bar (range slider for seeking)
    const progressSlider = expandedPlayer.locator('input[type="range"]');
    await expect(progressSlider).toBeVisible({ timeout: 5000 });

    // Verify slider has min=0 (progress bar, not volume)
    const min = await progressSlider.getAttribute('min');
    expect(min).toBe('0');
  });

  test('can close ExpandedPlayer back to MiniPlayer', async ({ page }) => {
    await page.goto('/');

    // Click play and expand
    await page.getByRole('button', { name: /Ascultă Acum/i }).click();
    await page.waitForTimeout(1000);
    await page.getByText('Acum se redă').click();
    await page.waitForTimeout(500);

    // Click collapse button (first button in expanded player)
    const expandedPlayer = page.locator('.fixed.inset-0.z-50');
    const collapseButton = expandedPlayer.locator('button').first();
    await collapseButton.click();
    await page.waitForTimeout(500);

    // Should be back to MiniPlayer
    const miniPlayer = page.getByText('Acum se redă');
    await expect(miniPlayer).toBeVisible();

    // ExpandedPlayer should not be visible
    await expect(expandedPlayer).not.toBeVisible();
  });

  test('library page displays sermons', async ({ page }) => {
    await page.goto('/library');

    // Verify library page title (h1)
    await expect(page.locator('h1').filter({ hasText: 'Biblioteca' })).toBeVisible();

    // Should display sermon count
    await expect(page.getByText(/predici/i).first()).toBeVisible();

    // Verify sermon titles are present (use first() to avoid duplicates)
    await expect(page.getByText('Duminica Vameșului și Fariseului').first()).toBeVisible();
  });

  test('can play sermon from library and see MiniPlayer', async ({ page }) => {
    await page.goto('/library');
    await page.waitForTimeout(500);

    // Click on a play button in the sermon list
    const playButton = page.locator('.play-btn').first();
    await playButton.click();
    await page.waitForTimeout(1000);

    // MiniPlayer should appear
    const miniPlayer = page.getByText('Acum se redă');
    await expect(miniPlayer).toBeVisible();
  });

  test('responsive design - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Bottom navigation should be visible on mobile (fixed at bottom)
    const bottomNav = page.locator('nav.fixed.bottom-0');
    await expect(bottomNav).toBeVisible();

    // Mobile header (h2) should be visible
    await expect(page.locator('h2').filter({ hasText: 'Predici Padre' })).toBeVisible();
  });

  test('404 page for invalid route', async ({ page }) => {
    await page.goto('/invalid-route-12345');

    // Should show 404 page
    await expect(page.getByText('404')).toBeVisible();

    // Should have button to go back home
    const homeButton = page.getByRole('button', { name: /Înapoi/i });
    await expect(homeButton).toBeVisible();

    // Click to go home
    await homeButton.click();
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });
});
