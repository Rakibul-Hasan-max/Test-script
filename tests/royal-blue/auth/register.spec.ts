import { test, expect } from '@playwright/test';
import { AuthPage } from '../../../pages/royal-blue/AuthPage';

test.describe('Register (Signup) E2E Test Cases', () => {

    test.describe('Positive Cases', () => {
        let authPage: AuthPage;

        test.beforeEach(async ({ page }) => {
            authPage = new AuthPage(page);
            await authPage.navigate('https://www.shebaa247.com/cred/register');
        });

        test('Valid user registration & Auto login', async ({ page }) => {
            await authPage.register({
                firstName: 'Valid',
                lastName: 'User',
                email: `valid${Date.now()}@example.com`,
                phone: '01800000000',
                password: 'Password123!'
            });
            // Should auto login after creating account
            await page.waitForTimeout(1000);
            await expect(page).toHaveURL(/.*(\/checkout\/cart|\/$)/);
        });
    });

    test.describe('Negative Cases', () => {
        let authPage: AuthPage;

        test.beforeEach(async ({ page }) => {
            authPage = new AuthPage(page);
            await authPage.navigate('https://www.shebaa247.com/cred/register');
        });

        test('Duplicate email registration', async ({ page }) => {
            await authPage.register({
                firstName: 'Duplicate',
                lastName: 'User',
                email: 'user@example.com', // Assuming this exists
                phone: '123123123',
                password: 'Password123!'
            });
            await expect(page.locator('text=exists').or(page.locator('.text-red-500')).first()).toBeVisible();
        });

        test('Password mismatch (confirm password)', async ({ page }) => {
            await authPage.firstNameInput.fill('Test');
            await authPage.lastNameInput.fill('User');
            await authPage.emailInput.fill('test@test.com');
            await authPage.passwordInput.fill('Password123!');
            await authPage.confirmPasswordInput.fill('WrongMatch123!');
            await authPage.createAccountButton.click();
            
            // Checking if validation messages pop up
            await expect(page).toHaveURL(/.*\/cred\/register/); 
        });

        test('Required fields empty', async ({ page }) => {
            await authPage.createAccountButton.click();
            await expect(page.locator('text=This field is required').first()).toBeVisible();
        });
    });

    test.describe('Edge Cases & Input Validation', () => {
        let authPage: AuthPage;

        test.beforeEach(async ({ page }) => {
            authPage = new AuthPage(page);
            await authPage.navigate('https://www.shebaa247.com/cred/register');
        });

        test('Unicode input (Bangla/emoji)', async ({ page }) => {
            await authPage.register({
                firstName: 'রাকিব 😄',
                lastName: 'Hasan',
                email: `rakiv${Date.now()}@test.com`,
                phone: '01800000000',
                password: 'Password123!'
            });
            await page.waitForTimeout(1000);
            await expect(page).not.toHaveURL(/.*\/cred\/register/); 
        });

        test('Trim spaces check', async ({ page }) => {
            await authPage.register({
                firstName: '  Space  ',
                lastName: '  Man  ',
                email: ` space${Date.now()}@test.com  `,
                phone: '01800000000',
                password: 'Password123!'
            });
            // Should pass string trimming ideally on backend
            await expect(page).not.toHaveURL(/.*\/cred\/register/); 
        });
    });

    test.describe('🔒 Security & API Failure', () => {
        let authPage: AuthPage;

        test.beforeEach(async ({ page }) => {
            authPage = new AuthPage(page);
        });

        test('XSS in input fields', async ({ page }) => {
            await authPage.navigate('https://www.shebaa247.com/cred/register');
            await authPage.register({
                firstName: '<img src=x onerror=alert(1)>',
                lastName: 'Hacker',
                email: 'hacker@test.com',
                phone: '01800000000',
                password: 'Password123!'
            });
            // Should fail or at least not execute
            // In a modern framework like React, this is mostly safe
            await expect(page).toHaveURL(/.*\/cred\/register/);
        });

        test('Rate limiting on signup (Mocked)', async ({ page }) => {
            await page.route('**/api/cred/register', route => {
                route.fulfill({ status: 429, contentType: 'application/json', body: JSON.stringify({ message: "Too many requests" }) });
            });

            await authPage.navigate('https://www.shebaa247.com/cred/register');
            await authPage.register({
                firstName: 'Spam',
                lastName: 'Bot',
                email: 'spam@test.com',
                phone: '00000000',
                password: 'Password123!'
            });
            
            await expect(page.locator('text=Too many requests').or(page.locator('.text-red-500')).first()).toBeVisible();
        });
    });
});
