import { test, expect } from '@playwright/test';
import { AuthPage } from '../../pages/royal-blue/AuthPage';
import { HomePage } from '../../pages/royal-blue/HomePage';
import { ReservationModal } from '../../pages/royal-blue/ReservationModal';

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
        
        // Wait for redirect or check for errors
        try {
            await page.waitForURL(/.*\/checkout\/cart|\/$/, { timeout: 10000 });
        } catch (e) {
            // If not redirected, maybe registration failed or didn't auto-login
            const error = page.locator('.text-red-500, text=exists, text=required').first();
            if (await error.isVisible()) {
                throw new Error(`Registration failed: ${await error.innerText()}`);
            }
            // If no error but not redirected, try manual login
            await authPage.navigate('https://www.shebaa247.com/auth');
            await authPage.login(testUser, 'SecurePassword123!');
            await page.waitForURL(/.*\/checkout\/cart|\/$/);
        }

        // Verify login success
        await homePage.userMenuButton.click();
        const signOutButton = page.locator('text=Sign Out, text=Logout, text=Sign out, text=Log out').first();
        await expect(signOutButton).toBeVisible({ timeout: 10000 });
        await page.keyboard.press('Escape'); 

        // 4. Test Buttons & Interaction on Homepage (User flows)
        if (!page.url().endsWith('.com/')) {
            await homePage.navigate('https://www.shebaa247.com/');
        }
        await homePage.bookATableButton.click();
        
        // Verify we are at the reservation section
        await expect(page.locator('#reservation')).toBeVisible();

        // Fill reservation form to trigger the modal (Normal booking flow)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        
        await homePage.fillReservationForm('2', dateStr, '19:00');
        await homePage.clickFindTable();

        // Now the reservation modal should be visible (Checking for table selection buttons)
        const reservationModal = new ReservationModal(page);
        await expect(reservationModal.tableButtons.first()).toBeVisible({ timeout: 10000 });
        // Close Modal - Scoping to the modal container to avoid matching header buttons
        const modal = page.locator('[role="dialog"], .modal, [class*="modal"], div[class*="fixed"]').filter({ has: page.locator('text=Select Your Table') });
        await modal.locator('button:has(svg), button:has-text("✕"), .absolute.right-4.top-4, button[class*="close"]').first().click(); 

        // 5. Navigate to full menu and test category buttons
        await page.locator('a:has-text("Explore Full Menu")').first().click();
        await expect(page).toHaveURL(/.*\/menu/);
        
        // Ensure menu initialized
        await expect(page.locator('h1')).toBeVisible();

        // 6. Sign Out
        // Ensure we are on home or refresh to be sure we see the menu
        await homePage.navigate('https://www.shebaa247.com/');
        await homePage.userMenuButton.click();
        
        // Wait for the menu to be visible and click Sign Out / Logout
        const finalSignOutButton = page.locator('button:has-text("Sign Out"), button:has-text("Logout"), button:has-text("Sign out"), text=Log out').first();
        await expect(finalSignOutButton).toBeVisible({ timeout: 5000 });
        await finalSignOutButton.click();
        
        // Verify logout
        await homePage.userMenuButton.click();
        await expect(page.locator('text=Welcome, Food Lover!')).toBeVisible();
    });
});
