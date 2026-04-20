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

    test('should complete a table reservation flow', async () => {
        // Scroll to reservation section
        await homePage.navbarLinks.reservation.click();
        
        // Fill form
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        
        await homePage.fillReservationForm('2', dateStr, '19:00');
        await homePage.clickFindTable();
        
        // Modal should appear, select a table
        await reservationModal.selectTable(0);
        
        // Fill customer details
        await reservationModal.fillCustomerDetails(
            'Test User',
            '01712345678',
            'test@example.com',
            'I would like a window seat please.'
        );
        
        // Confirm booking
        await reservationModal.confirmBooking();
        
        // Check for success message
        await expect(reservationModal.successMessage).toBeVisible({ timeout: 10000 });
    });
});
