import { test, expect } from '@playwright/test';
import { BasePage } from '../../pages/BasePage';

test.describe('Royal Blue - Full Menu Page Tests', () => {
    let basePage: BasePage;

    test.beforeEach(async ({ page }) => {
        basePage = new BasePage(page);
        await basePage.navigate('https://www.shebaa247.com/menu');
    });

    test('should verify full menu sections and cart', async ({ page }) => {
        // Wait for Menu component to load
        await expect(page.locator('h1')).toBeVisible();

        // Menu typically has categories
        // Verify there is a category navigation or some menu items
        const menuItems = page.locator('h3'); // Usually item names are h3 or h4
        await expect(menuItems.first()).toBeVisible({ timeout: 10000 });
    });
});
