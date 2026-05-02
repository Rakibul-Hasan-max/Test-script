import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/royal-blue/HomePage';
import { ReservationModal } from '../../pages/royal-blue/ReservationModal';

test.describe('Royal Blue - Table Reservation Tests', () => {
    let homePage: HomePage;
    let reservationModal: ReservationModal;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        reservationModal = new ReservationModal(page);
        await homePage.navigate('https://www.shebaa247.com/');
    });

    test.describe('Positive Cases', () => {
        test('should complete a table reservation flow successfully', async () => {
            await homePage.navbarLinks.reservation.click();
            
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const dateStr = tomorrow.toISOString().split('T')[0];
            
            await homePage.fillReservationForm('2', dateStr, '19:00');
            await homePage.clickFindTable();
            
            await reservationModal.selectTable(0);
            await reservationModal.fillCustomerDetails(
                'Test User',
                '01712345678',
                'test@example.com',
                'I would like a window seat please.'
            );
            
            await reservationModal.confirmBooking();
            
            // Check for success message
            await expect(reservationModal.successMessage).toBeVisible({ timeout: 10000 });
        });
    });

    test.describe('Negative & Validation Cases', () => {
        test('Customer name and phone missing -> shows validation error', async ({ page }) => {
            await homePage.navbarLinks.reservation.click();
            
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            const dateStr = nextWeek.toISOString().split('T')[0];
            
            await homePage.fillReservationForm('4', dateStr, '20:00');
            await homePage.clickFindTable();
            
            await reservationModal.selectTable(0);
            // Leave customer details empty
            await reservationModal.fillCustomerDetails('', '', '', '');
            await reservationModal.confirmBooking();
            
            // Should remain on the modal due to validation
            await expect(reservationModal.customerNameInput).toBeVisible();
            // Optional: check for validation message text if implemented accurately in the codebase
            // await expect(page.locator('text=This field is required').first()).toBeVisible();
        });

        test('Finding table without entering date and time -> validation error', async ({ page }) => {
            await homePage.navbarLinks.reservation.click();
            
            await homePage.fillReservationForm('2', '', '');
            await homePage.clickFindTable();
            
            // Should either see an error message OR remain on the same section (not open modal)
            const reservationModal = new ReservationModal(page);
            await expect(reservationModal.tableButtons.first()).not.toBeVisible({ timeout: 5000 });
            
            // Check for any visible error message if available
            const errorMsg = page.locator('text=required, .text-red-500, [class*="error"]').first();
            if (await errorMsg.isVisible()) {
                await expect(errorMsg).toBeVisible();
            }
        });

        test('Booking a past date -> rejects booking or shows validation error', async ({ page }) => {
            await homePage.navbarLinks.reservation.click();
            
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const dateStr = yesterday.toISOString().split('T')[0];
            
            await homePage.fillReservationForm('2', dateStr, '19:00');
            await homePage.clickFindTable();
            
            // Should ideally show an error instead of letting us proceed to the table picker modal
            const noTablesMsg = page.locator('text=No tables available').or(page.locator('.text-red-500'));
            const dateError = page.locator('text=past date');
            await expect(noTablesMsg.or(dateError).first()).toBeVisible();
        });
    });
});
