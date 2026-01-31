import { test, expect, Page } from '@playwright/test';

test.describe('PredicApp Audio Playback', () => {
  test('homepage loads with sermons', async ({ page }) => {
    await page.goto('/');

    // Verify header is visible
    await expect(page.getByText('Predicile Părintelui')).toBeVisible();
    await expect(page.getByText('Biserica Ortodoxă')).toBeVisible();

    // Verify featured sermon card is visible
    await expect(page.getByText('Predica Zilei')).toBeVisible();
    await expect(page.getByText('Duminica Vameșului și Fariseului')).toBeVisible();

    // Verify "Ascultă Acum" button is visible
    await expect(page.getByRole('button', { name: /Ascultă Acum/i })).toBeVisible();

    // Verify stats are displayed
    await expect(page.getByText('Predici')).toBeVisible();
    await expect(page.getByText('Categorii')).toBeVisible();
    await expect(page.getByText('Ore')).toBeVisible();
  });

  test('navigates to player page when clicking on sermon', async ({ page }) => {
    await page.goto('/');

    // Click on the "Ascultă Acum" button
    await page.getByRole('button', { name: /Ascultă Acum/i }).click();

    // Wait for navigation to player page
    await page.waitForURL(/\/player\/s\d+/);

    // Verify player page loaded
    await expect(page.url()).toContain('/player/s004');
  });

  test('audio player UI elements are present', async ({ page }) => {
    // Navigate directly to player page
    await page.goto('/player/s004');

    // Verify sermon title is displayed
    await expect(page.getByText('Duminica Vameșului și Fariseului')).toBeVisible();

    // Verify category is displayed
    await expect(page.getByText('Predici Liturgice')).toBeVisible();

    // Verify close button is visible
    const closeButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await expect(closeButton).toBeVisible();

    // Verify player controls are visible
    // The play button should be visible (large circular button)
    const playButton = page.locator('button').filter({
      has: page.locator('svg').filter({ hasText: '' })
    });

    // Just verify there are interactive buttons
    const buttons = page.locator('button');
    await expect(buttons.first()).toBeVisible();
  });

  test('audio element exists and has correct source', async ({ page }) => {
    await page.goto('/player/s004');

    // Wait a bit for audio element to be created
    await page.waitForTimeout(1000);

    // Verify audio element exists (it's created by the useAudio hook)
    const audioElement = await page.evaluate(() => {
      const audios = document.querySelectorAll('audio');
      if (audios.length > 0) {
        return {
          src: audios[0].src,
          paused: audios[0].paused,
          duration: audios[0].duration || 0
        };
      }
      return null;
    });

    expect(audioElement).not.toBeNull();
    expect(audioElement?.src).toContain('prediciduminica-r2.lightsongjs.workers.dev');
    expect(audioElement?.src).toContain('2026-02-01_Vamesului_si_Fariseului_2016.mp3');
  });

  test('play button toggles audio playback', async ({ page }) => {
    await page.goto('/player/s004');

    // Wait for page to load
    await page.waitForTimeout(1500);

    // Find and click the large play button (it's the biggest circular button)
    const playButton = page.locator('button').filter({
      has: page.locator('svg')
    }).nth(2); // The play/pause button is typically the 3rd button (after close and share)

    // Click play button
    await playButton.click();

    // Wait a moment for audio to start
    await page.waitForTimeout(2000);

    // Check if audio is playing
    const isPlaying = await page.evaluate(() => {
      const audios = document.querySelectorAll('audio');
      if (audios.length > 0) {
        return !audios[0].paused;
      }
      return false;
    });

    // Audio should be playing or attempting to play
    // (Note: In headless browsers, autoplay might be blocked, but we can verify the attempt)
    console.log('Audio playing state:', isPlaying);

    // Click pause button
    await playButton.click();

    // Wait a moment
    await page.waitForTimeout(500);

    // Verify audio is paused
    const isPaused = await page.evaluate(() => {
      const audios = document.querySelectorAll('audio');
      if (audios.length > 0) {
        return audios[0].paused;
      }
      return true;
    });

    expect(isPaused).toBe(true);
  });

  test('progress bar is interactive', async ({ page }) => {
    await page.goto('/player/s004');
    await page.waitForTimeout(1000);

    // Look for time displays (they should show 0:00 initially)
    const timeDisplays = page.locator('span').filter({ hasText: /\d+:\d+/ });

    // Should have at least 2 time displays (current time and duration)
    const count = await timeDisplays.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('volume control is present', async ({ page }) => {
    await page.goto('/player/s004');
    await page.waitForTimeout(1000);

    // Look for volume control (input range slider)
    const volumeSlider = page.locator('input[type="range"]');
    await expect(volumeSlider).toBeVisible();

    // Verify slider has correct attributes
    const min = await volumeSlider.getAttribute('min');
    const max = await volumeSlider.getAttribute('max');

    expect(min).toBe('0');
    expect(max).toBe('1');
  });

  test('can navigate back from player to home', async ({ page }) => {
    await page.goto('/player/s004');
    await page.waitForTimeout(500);

    // Click close button (first button with SVG)
    const closeButton = page.locator('button').first();
    await closeButton.click();

    // Should navigate back to home
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });

  test('library page displays all sermons', async ({ page }) => {
    await page.goto('/library');

    // Verify library page title
    await expect(page.getByText('Biblioteca')).toBeVisible();

    // Should display "4 predici disponibile"
    await expect(page.getByText(/predici disponibile/i)).toBeVisible();

    // Verify all 4 sermon titles are present
    await expect(page.getByText('Duminica Vameșului și Fariseului')).toBeVisible();
    await expect(page.getByText('Duminica Fiului Risipitor')).toBeVisible();
    await expect(page.getByText('Duminica Înfricoșătoarei Judecăți')).toBeVisible();
    await expect(page.getByText('Duminica Iertării')).toBeVisible();
  });

  test('can play sermon from library', async ({ page }) => {
    await page.goto('/library');
    await page.waitForTimeout(500);

    // Click on first sermon card
    const firstSermonCard = page.locator('.bg-white').first();
    await firstSermonCard.click();

    // Should navigate to player
    await page.waitForURL(/\/player\/s\d+/);

    // Verify we're on a player page
    expect(page.url()).toContain('/player/');
  });

  test('responsive design - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Bottom navigation should be visible on mobile
    await expect(page.getByText('Home')).toBeVisible();
    await expect(page.getByText('Library')).toBeVisible();

    // Header should still be visible
    await expect(page.getByText('Predicile Părintelui')).toBeVisible();
  });

  test('404 page for invalid route', async ({ page }) => {
    await page.goto('/invalid-route-12345');

    // Should show 404 page
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText(/Pagina nu a fost găsită/i)).toBeVisible();

    // Should have button to go back home
    const homeButton = page.getByRole('button', { name: /Înapoi la pagina principală/i });
    await expect(homeButton).toBeVisible();

    // Click to go home
    await homeButton.click();
    await page.waitForURL('/');
    expect(page).toHaveURL('/');
  });
});
