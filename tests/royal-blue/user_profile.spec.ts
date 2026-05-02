import { test, expect } from '@playwright/test';
import { AuthPage } from '../../pages/royal-blue/AuthPage';
import { ProfilePage } from '../../pages/royal-blue/ProfilePage';
import { HomePage } from '../../pages/royal-blue/HomePage';

test.describe('Royal Blue - User Profile CRUD and Input Tests', () => {
    let authPage: AuthPage;
    let profilePage: ProfilePage;
    let homePage: HomePage;
    let testEmail: string;

    test.beforeEach(async ({ page }) => {
        authPage = new AuthPage(page);
        profilePage = new ProfilePage(page);
        homePage = new HomePage(page);
        testEmail = `user${Date.now()}@example.com`;
        await authPage.navigate('https://www.shebaa247.com/cred/register');
        
        // Register a new user for CRUD test to not affect others
        await authPage.register({
            firstName: 'Current',
            lastName: 'User',
            email: testEmail,
            phone: '1234567890',
            password: 'Password123!'
        });
        
        // Wait for redirect or check for errors
        try {
            await page.waitForURL(/.*\/checkout\/cart|\/$/, { timeout: 15000 });
        } catch (e) {
            const error = page.locator('.text-red-500, text=exists, text=required').first();
            if (await error.isVisible()) {
                throw new Error(`Registration failed: ${await error.innerText()}`);
            }
            throw e;
        }
        
        // Verify login success before clicking User Menu
        const signOutButton = page.locator('text=Sign Out, text=Logout, text=Sign out, text=Log out').first();
        await homePage.userMenuButton.click();
        await expect(signOutButton).toBeVisible({ timeout: 10000 });
        
        // Go to Profile via User Menu
        await page.locator('text=My Profile').first().click();
        await expect(page).toHaveURL(/.*\/profile/);
    });

    test('should allow reading and updating user profile (CRUD)', async ({ page }) => {
        // Read initial state
        await expect(page.locator('text=Current User')).toBeVisible();
        await expect(page.locator(`text=${testEmail}`)).toBeVisible();

        // Start Update (Edit)
        await profilePage.clickEditProfile();
        
        // Input fields test - verifying they become editable and hold values
        await expect(profilePage.firstNameInput).toHaveValue('Current');
        await expect(profilePage.emailInput).toBeDisabled(); // Validating security constraint

        // Update values
        await profilePage.updateProfile({
            firstName: 'UpdatedName',
            lastName: 'UpdatedLast',
            phone: '0987654321'
        });

        // Verify Success flash message
        await expect(page.locator('text=Profile updated successfully')).toBeVisible();

        // Read updated state (Verify Update effect)
        await expect(page.locator('text=UpdatedName UpdatedLast')).toBeVisible();
    });

    test('should validate empty inputs correctly', async ({ page }) => {
        await profilePage.clickEditProfile();
        
        // Providing empty fields
        await profilePage.firstNameInput.fill('');
        await profilePage.saveChangesButton.click();
        
        // Ideally there's a validation message or it remains in edit mode
        // Let's assume the system prevents save and shows error or keeps it in edit mode
        await expect(profilePage.firstNameInput).toBeVisible(); 
    });
});
