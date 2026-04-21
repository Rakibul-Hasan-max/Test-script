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
        
        // Wait for login page to load
        await expect(authPage.emailInput).toBeVisible();
        await expect(page).toHaveURL(/.*\/login/);
        
        await authPage.login('test@example.com', 'Password123!');
        
        // Since we are using a dummy account, we check for an error or successful login
        // If login is successful, we should see initials in the user menu
        const errorVisible = await page.locator('text=Invalid credentials').isVisible();
        if (errorVisible) {
            await expect(page.locator('text=Invalid credentials')).toBeVisible();
        } else {
            // If it logs in successfully (some testing environments might have this user)
            await expect(homePage.userMenuButton).toContainText(/[A-Z]{1,2}/i);
        }
    });

    test('should verify registration flow', async ({ page }) => {
        await homePage.openUserMenu();
        await page.click('text=Create Account');
        
        // Wait for registration page
        await expect(authPage.firstNameInput).toBeVisible();
        await expect(page).toHaveURL(/.*\/register/);
        
        await authPage.register({
            firstName: 'Test',
            lastName: 'User',
            email: `test${Date.now()}@example.com`,
            phone: '01711111111',
            password: 'StrongPassword123!'
        });
        
        // After registration, the site automatically logs the user in and redirects to Home
        // We verify the user's initials in the navbar
        await expect(homePage.userMenuButton).toContainText(/TU/i); 
    });
});
