import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/royal-blue/HomePage';
import { AuthPage } from '../../pages/royal-blue/AuthPage';

test.describe('Royal Blue - Auth Tests', () => {
    let homePage: HomePage;
    let authPage: AuthPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        authPage = new AuthPage(page);
        await homePage.navigate('https://www.shebaa247.com/');
    });

    test('should verify login flow', async ({ page }) => {
        await homePage.openUserMenu();
        await page.click('text=Sign In');
        
        await expect(page).toHaveURL(/.*\/login/);
        
        await authPage.login('test@example.com', 'Password123!');
        
        // Check for error message since this is a dummy account
        // Assuming the site shows an error for invalid credentials
        await expect(page.locator('text=Invalid credentials')).toBeVisible();
    });

    test('should verify registration flow', async ({ page }) => {
        await homePage.openUserMenu();
        await page.click('text=Create Account');
        
        await expect(page).toHaveURL(/.*\/register/);
        
        await authPage.register({
            firstName: 'Test',
            lastName: 'User',
            email: `test${Date.now()}@example.com`,
            phone: '01711111111',
            password: 'StrongPassword123!'
        });
        
        // After registration, should either redirect to login or show success
        await expect(page).toHaveURL(/.*\/login/);
    });
});
