import { test, expect } from '@playwright/test';
import { AuthPage } from '../../../pages/royal-blue/AuthPage';
import { HomePage } from '../../../pages/royal-blue/HomePage';

test.describe('Login E2E Test Cases', () => {
    
    test.describe('Positive Cases & Session State', () => {
        let authPage: AuthPage;
        
        test.beforeEach(async ({ page }) => {
            authPage = new AuthPage(page);
            await authPage.navigate('https://www.shebaa247.com/cred/login?redirect=/');
        });

        test('Valid email + valid password -> login success', async ({ page }) => {
            await expect(authPage.emailInput).toBeVisible();
            await authPage.login('user@example.com', 'Pass123!');
            
            // Redirects to dashboard/home
            await page.waitForTimeout(1000); 
            await expect(page).toHaveURL(/.*(\/checkout\/cart|\/$)/);
        });
        
        test('Already logged-in user hits login page -> redirect', async ({ page }) => {
            await authPage.login('user@example.com', 'Pass123!');
            
            // First, verify we are successfully logged in and redirected away from login page
            await expect(page).not.toHaveURL(/.*\/cred\/login/); 
            await expect(page.locator('text=Sign Out, text=Logout, text=Sign out, text=Log out').first()).toBeVisible({ timeout: 10000 });

            // Now, attempt to hit login page again while logged in
            await page.goto('https://www.shebaa247.com/cred/login');
            
            // Should be redirected away again
            await expect(page).not.toHaveURL(/.*\/cred\/login/, { timeout: 10000 }); 
        });

        test('Multi-tab behavior & Auto-Sync (Session Persistence)', async ({ context }) => {
            const page1 = await context.newPage();
            const page2 = await context.newPage();
            const authPage1 = new AuthPage(page1);
            
            await authPage1.navigate('https://www.shebaa247.com/cred/login');
            await authPage1.login('user@example.com', 'Pass123!');
            await page1.waitForTimeout(1000);

            await page2.goto('https://www.shebaa247.com/');
            const homePage2 = new HomePage(page2);
            await homePage2.userMenuButton.click();
            await expect(page2.locator('text=Sign Out')).toBeVisible();
            
            await page1.close();
            await page2.close();
        });

        test('Logout -> Back button block test', async ({ page }) => {
            const authPage = new AuthPage(page);
            const homePage = new HomePage(page);

            await authPage.navigate('https://www.shebaa247.com/cred/login');
            await authPage.login('user@example.com', 'Pass123!');
            await page.waitForTimeout(1000);

            await page.goto('https://www.shebaa247.com/profile');
            
            // Sign out
            await homePage.userMenuButton.click();
            await page.locator('text=Sign Out').click();

            // Try to go back
            await page.goBack();
            await page.waitForTimeout(500); 
            await expect(page).not.toHaveURL(/.*\/profile/);
        });
    });

    test.describe('Negative Cases & Validation', () => {
        let authPage: AuthPage;
        
        test.beforeEach(async ({ page }) => {
            authPage = new AuthPage(page);
            await authPage.navigate('https://www.shebaa247.com/cred/login');
        });

        test('Invalid email + valid password', async ({ page }) => {
            await authPage.login('wrong@email.com', 'Pass123!');
            await expect(page.locator('text=Invalid').or(page.locator('.text-red-500')).first()).toBeVisible();
        });

        test('Empty email/password showing validation errors', async ({ page }) => {
            await authPage.loginButton.click();
            await expect(page.locator('text=This field is required').first()).toBeVisible();
        });

        test('Password too short / space padded tests', async ({ page }) => {
            await authPage.emailInput.fill('user@example.com');
            await authPage.passwordInput.fill('   '); 
            await authPage.loginButton.click();
            await expect(page).toHaveURL(/.*\/cred\/login/); 
        });
    });

    test.describe('Edge Cases & Security (SQLi/XSS)', () => {
        let authPage: AuthPage;

        test.beforeEach(async ({ page }) => {
            authPage = new AuthPage(page);
            await authPage.navigate('https://www.shebaa247.com/cred/login');
        });

        test('SQL Injection attempt', async ({ page }) => {
            await authPage.login("' OR 1=1 --", 'password');
            await expect(page).toHaveURL(/.*\/cred\/login/);
            await expect(page.locator('.text-red-500').first()).toBeVisible();
        });

        test('XSS input script payload', async ({ page }) => {
            await authPage.login('<script>alert("xss")</script>@gmail.com', 'password');
            await expect(page).toHaveURL(/.*\/cred\/login/);
        });

        test('Extremely long input string in email', async ({ page }) => {
            const longEmail = 'a'.repeat(300) + '@gmail.com';
            await authPage.login(longEmail, 'password');
            await expect(page).toHaveURL(/.*\/cred\/login/);
        });
    });

    test.describe('API Failure Simulation & UI/UX', () => {
        let authPage: AuthPage;

        test.beforeEach(async ({ page }) => {
            authPage = new AuthPage(page);
        });

        test('Simulate Backend Down (500 Error) during Login', async ({ page }) => {
            await page.route('**/api/cred/login', route => {
                route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: "Internal Server Error" }) });
            });

            await authPage.navigate('https://www.shebaa247.com/cred/login');
            await authPage.login('user@example.com', 'Pass123!');
            
            const errorElement = page.locator('text=Internal Server Error').or(page.locator('.text-red-500'));
            await expect(errorElement.first()).toBeVisible();
        });

        test('Loading spinner checks on submit', async ({ page }) => {
            await page.route('**/api/cred/login', async route => {
                await new Promise(resolve => setTimeout(resolve, 2000));
                route.continue();
            });

            await authPage.navigate('https://www.shebaa247.com/cred/login');
            await authPage.emailInput.fill('user@example.com');
            await authPage.passwordInput.fill('Pass123!');
            
            await Promise.all([
                authPage.loginButton.click(),
                expect(page.locator('.animate-spin').first()).toBeVisible()
            ]);
        });
    });
});
