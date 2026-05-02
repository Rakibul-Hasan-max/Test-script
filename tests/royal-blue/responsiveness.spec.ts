import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/royal-blue/HomePage';
import { ReservationModal } from '../../pages/royal-blue/ReservationModal';

test.describe('Royal Blue - Responsiveness & Button Tests (Mobile)', () => {
    // Configure Playwright to use a mobile viewport for this suite
    test.use({ viewport: { width: 375, height: 812 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1' });

    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.navigate('https://www.shebaa247.com/');
    });

    test('should render mobile menu hamburger button and open nav', async ({ page }) => {
        // Find hamburger button which should be visible on mobile
        const mobileMenuButton = page.locator('button.md\\:hidden').first();
        await expect(mobileMenuButton).toBeVisible();

        // Click on it
        await mobileMenuButton.click();

        // Check if moble menu content appeared (e.g. "Home" link)
        const mobileHomeLink = page.locator('nav').locator('a:has-text("Home")').first();
        await expect(mobileHomeLink).toBeVisible();
    });

    test('should verify Book A Table & Book An Event buttons appear correctly on mobile', async ({ page }) => {
        const bookTableBtn = homePage.bookATableButton;
        const bookEventBtn = homePage.bookAnEventButton;

        await expect(bookTableBtn).toBeVisible();
        await expect(bookEventBtn).toBeVisible();

        // Check button interaction / hover mechanics if any applied on mobile tap
        await bookTableBtn.click();
        
        // Assert it scrolls to the reservation section
        await expect(page.locator('#reservation')).toBeVisible();

        // Verify normal booking flow works on mobile
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        
        await homePage.fillReservationForm('2', dateStr, '19:00');
        await homePage.clickFindTable();
        
        // Assert modal opens (Checking for table selection buttons)
        const reservationModal = new ReservationModal(page);
        await expect(reservationModal.tableButtons.first()).toBeVisible({ timeout: 10000 });

        // Close Modal - Scoping to the modal container to avoid matching header buttons
        const modal = page.locator('[role="dialog"], .modal, [class*="modal"], div[class*="fixed"]').filter({ has: page.locator('text=Select Your Table') });
        await modal.locator('button:has(svg), button:has-text("✕"), .absolute.right-4.top-4, button[class*="close"]').first().click(); 

    });
});
