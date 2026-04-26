import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/royal-blue/HomePage';

test.describe('Royal Blue - Responsiveness & Button Tests (Mobile)', () => {
    // Configure Playwright to use a mobile viewport for this suite
    test.use({ viewport: { width: 375, height: 812 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1' });

    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.navigate('https://www.shebaa247.com/');
    });

    test('should render mobile menu hamburger button and open nav', async ({ page }) => {
        // Find hamburger button which should be visible on mobile
        const mobileMenuButton = page.locator('button.md\\:hidden').first();
        await expect(mobileMenuButton).toBeVisible();

        // Click on it
        await mobileMenuButton.click();

        // Check if moble menu content appeared (e.g. "Home" link)
        const mobileHomeLink = page.locator('nav').locator('a:has-text("Home")').first();
        await expect(mobileHomeLink).toBeVisible();
    });

    test('should verify Book A Table & Book An Event buttons appear correctly on mobile', async ({ page }) => {
        const bookTableBtn = homePage.bookATableButton;
        const bookEventBtn = homePage.bookAnEventButton;

        await expect(bookTableBtn).toBeVisible();
        await expect(bookEventBtn).toBeVisible();

        // Check button interaction / hover mechanics if any applied on mobile tap
        await bookTableBtn.click();
        
        // Assert modal or redirect happens
        await expect(page.locator('text=Select Your Details')).toBeVisible();
    });
});
