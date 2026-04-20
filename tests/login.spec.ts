import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate('https://the-internet.herokuapp.com/login');
    });

    test('should login successfully with valid credentials', async () => {
        await loginPage.login('tomsmith', 'SuperSecretPassword!');
        const message = await loginPage.getFlashMessageText();
        expect(message).toContain('You logged into a secure area!');
    });

    test('should show error with invalid credentials', async () => {
        await loginPage.login('invalidUser', 'invalidPassword');
        const message = await loginPage.getFlashMessageText();
        expect(message).toContain('Your username is invalid!');
    });
});
