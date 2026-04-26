import { test, expect } from '@playwright/test';
import { AuthPage } from '../../pages/royal-blue/AuthPage';
import { HomePage } from '../../pages/royal-blue/HomePage';

test.describe('Royal Blue - End-to-End (E2E) Journey', () => {
    test('simulate full customer journey: Register -> Browse -> Interact -> Logout', async ({ page }) => {
        const authPage = new AuthPage(page);
        const homePage = new HomePage(page);
        
        const testUser = `e2e_user_${Date.now()}@test.com`;

        // 1. Visit Home
        await homePage.navigate('https://www.shebaa247.com/');
        await expect(page).toHaveTitle(/.*Royal Blue.*/);

        // 2. Navigate to Registration
        await homePage.userMenuButton.click();
        await page.locator('text=Create Account').first().click();

        // 3. Register Account (CRUD - Create)
        await authPage.register({
            firstName: 'E2E',
            lastName: 'Customer',
            email: testUser,
            phone: '111222333',
            password: 'SecurePassword123!'
        });
        
        // Wait for login mapping
        await page.waitForURL(/.*\/checkout\/cart|\//);

        // 4. Test Buttons & Interaction on Homepage (User flows)
        await homePage.navigate('https://www.shebaa247.com/');
        await homePage.bookATableButton.click();
        await expect(page.locator('text=Select Your Details')).toBeVisible();
        await page.locator('button[aria-label="Close"]').first().click(); // Close Modal

        // 5. Navigate to full menu and test category buttons
        await page.locator('a:has-text("Menu")').first().click();
        await expect(page).toHaveURL(/.*\/menu/);
        
        // Ensure menu initialized
        await expect(page.locator('h1')).toBeVisible();

        // 6. Sign Out
        await homePage.navigate('https://www.shebaa247.com/');
        await homePage.userMenuButton.click();
        await page.locator('button:has-text("Sign Out")').click();
        
        // Verify logout
        await homePage.userMenuButton.click();
        await expect(page.locator('text=Welcome, Food Lover!')).toBeVisible();
    });
});
