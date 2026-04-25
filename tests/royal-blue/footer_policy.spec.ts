import { test, expect } from '@playwright/test';
import { BasePage } from '../../pages/BasePage';

test.describe('Royal Blue - Footer and Policy Tests', () => {
    let basePage: BasePage;

    test.beforeEach(async ({ page }) => {
        basePage = new BasePage(page);
        await basePage.navigate('https://www.shebaa247.com/');
    });

    test('should display footer elements', async ({ page }) => {
        // Scroll to the bottom
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        
        const footer = page.locator('#footer');
        await expect(footer).toBeVisible();
        
        // Verify footer brand
        await expect(footer.locator('h3:has-text("Royal Blue")')).toBeVisible();
        
        // Verify Opening Hours
        await expect(footer.locator('h4:has-text("Opening Hours")')).toBeVisible();
        
        // Verify Contact Us
        await expect(footer.locator('h4:has-text("Contact Us")')).toBeVisible();
    });

    test('should verify Privacy Policy page', async ({ page }) => {
        // Scroll to the bottom
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        
        // Click on Privacy Policy link
        await page.locator('footer a:has-text("Privacy Policy")').first().click();
        
        // Verify we are on the Privacy Policy page
        await expect(page).toHaveURL(/.*\/privacy-policy/);
        
        // Verify page content
        await expect(page.locator('h1:has-text("Privacy Policy")')).toBeVisible();
    });

    test('should verify Terms of Use page', async ({ page }) => {
        // Scroll to the bottom
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        
        // Click on Terms of Use link
        await page.locator('footer a:has-text("Terms of Use")').first().click();
        
        // Verify we are on the Terms of Conditions page
        await expect(page).toHaveURL(/.*\/terms-conditions/);
        
        // Verify page content
        // In the codebase it defaults to generic text, so finding the H1 should suffice
        await expect(page.locator('h1').first()).toBeVisible();
    });
});
