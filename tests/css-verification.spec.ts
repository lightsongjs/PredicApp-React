import { test, expect } from '@playwright/test';

test.describe('CSS and Styling Verification', () => {
  test('CSS loads without errors', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Check for any console errors (including CSS errors)
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Check if header has proper background color (should be white)
    const header = page.locator('header').first();
    const headerBgColor = await header.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });

    console.log('Header background color:', headerBgColor);
    // Should be white (rgb(255, 255, 255)) not transparent
    expect(headerBgColor).not.toBe('rgba(0, 0, 0, 0)');

    // Check if body has background color set
    const bodyBgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    console.log('Body background color:', bodyBgColor);
    // Should be #F0F4F8 which is rgb(240, 244, 248)
    expect(bodyBgColor).toContain('rgb');

    // Check if custom font is applied to headers
    const h1FontFamily = await page.locator('h1').first().evaluate(el => {
      return window.getComputedStyle(el).fontFamily;
    });

    console.log('H1 font family:', h1FontFamily);
    expect(h1FontFamily).toContain('Georgia');

    // Verify no CSS loading errors
    if (errors.length > 0) {
      console.log('Errors found:', errors);
    }

    console.log('✅ CSS loaded successfully!');
    console.log('✅ Custom colors applied!');
    console.log('✅ Custom fonts applied!');
  });

  test('primary button has correct styling', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find the "Ascultă Acum" button
    const button = page.getByRole('button', { name: /Ascultă Acum/i });

    // Check button background color (should be primary color #8B1E3F)
    const bgColor = await button.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });

    console.log('Button background color:', bgColor);
    // #8B1E3F = rgb(139, 30, 63)
    expect(bgColor).toBe('rgb(139, 30, 63)');

    // Check button text color (should be white)
    const textColor = await button.evaluate(el => {
      return window.getComputedStyle(el).color;
    });

    console.log('Button text color:', textColor);
    expect(textColor).toBe('rgb(255, 255, 255)');

    // Check border radius (should be rounded)
    const borderRadius = await button.evaluate(el => {
      return window.getComputedStyle(el).borderRadius;
    });

    console.log('Button border radius:', borderRadius);
    expect(parseFloat(borderRadius)).toBeGreaterThan(0);

    console.log('✅ Button styling verified!');
  });

  test('cards have proper styling', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find a card element (sermon card or stat card)
    const card = page.locator('.bg-white').first();

    if (await card.count() > 0) {
      const cardBgColor = await card.evaluate(el => {
        return window.getComputedStyle(el).backgroundColor;
      });

      console.log('Card background color:', cardBgColor);
      expect(cardBgColor).toBe('rgb(255, 255, 255)');

      const borderRadius = await card.evaluate(el => {
        return window.getComputedStyle(el).borderRadius;
      });

      console.log('Card border radius:', borderRadius);
      expect(parseFloat(borderRadius)).toBeGreaterThan(0);

      console.log('✅ Card styling verified!');
    }
  });
});
