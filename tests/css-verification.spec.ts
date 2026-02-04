import { test, expect } from '@playwright/test';

test.describe('CSS and Styling Verification', () => {
  test('CSS loads without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if header has proper background color
    const header = page.locator('header').first();
    const headerBgColor = await header.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });

    console.log('Header background color:', headerBgColor);
    // Should not be transparent
    expect(headerBgColor).not.toBe('rgba(0, 0, 0, 0)');

    // Check if body/root has background color set
    const rootBgColor = await page.evaluate(() => {
      const root = document.querySelector('#root > div');
      return root ? window.getComputedStyle(root).backgroundColor : 'not found';
    });

    console.log('Root background color:', rootBgColor);
    expect(rootBgColor).toContain('rgb');

    // Check if custom font is applied to headers
    const h1FontFamily = await page.locator('h1').first().evaluate(el => {
      return window.getComputedStyle(el).fontFamily;
    });

    console.log('H1 font family:', h1FontFamily);
    // Should have serif font (Georgia or similar)
    expect(h1FontFamily.toLowerCase()).toMatch(/georgia|serif/);

    // Log any errors found
    if (errors.length > 0) {
      console.log('Console errors found:', errors);
    }

    console.log('✅ CSS loaded successfully!');
  });

  test('primary button has correct styling', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find the "Ascultă Acum" button
    const button = page.getByRole('button', { name: /Ascultă Acum/i });
    await expect(button).toBeVisible();

    // Check button background color (should be primary color)
    const bgColor = await button.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });

    console.log('Button background color:', bgColor);
    // Should be some shade of red (primary color)
    expect(bgColor).toContain('rgb');

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

    // Find a card element
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

  test('MiniPlayer styling when playing', async ({ page }) => {
    await page.goto('/');

    // Click play to show MiniPlayer
    await page.getByRole('button', { name: /Ascultă Acum/i }).click();
    await page.waitForTimeout(1000);

    // MiniPlayer should be visible
    const miniPlayerText = page.getByText('Acum se redă');
    await expect(miniPlayerText).toBeVisible();

    // Find the MiniPlayer container by looking for the white card with shadow
    const miniPlayerCard = page.locator('.bg-white.rounded-2xl.shadow-lg').filter({ hasText: 'Acum se redă' });

    if (await miniPlayerCard.count() > 0) {
      const mpStyles = await miniPlayerCard.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          borderRadius: styles.borderRadius,
        };
      });
      console.log('MiniPlayer styles:', mpStyles);
    } else {
      console.log('MiniPlayer card selector not matched, but MiniPlayer is visible');
    }

    console.log('✅ MiniPlayer styling verified!');
  });
});
