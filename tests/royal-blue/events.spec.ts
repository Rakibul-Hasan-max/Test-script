import { test, expect } from '@playwright/test';
import { EventsPage } from '../../pages/royal-blue/EventsPage';

test.describe('Royal Blue - Event Booking Tests', () => {
    let eventsPage: EventsPage;

    test.beforeEach(async ({ page }) => {
        eventsPage = new EventsPage(page);
        await eventsPage.navigate('https://www.shebaa247.com/events');
    });

    test('should verify event details can be viewed', async ({ page }) => {
        await eventsPage.openEventDetails(0);
        // Verify modal or new section for details
        await expect(page.locator("text=Venue Details")).toBeVisible();
    });

    test('should verify event booking availability check', async ({ page }) => {
        await eventsPage.openEventDetails(0);
        await eventsPage.clickBookThisVenue();
        
        await expect(eventsPage.checkAvailabilityButton).toBeVisible();
        await eventsPage.checkAvailabilityButton.click();
        
        // Should show some validation or error if date not picked, or success if picked
        // Since we didn't pick a date, it might show an error
        await expect(page.locator("text=Select event date")).toBeVisible();
    });
});
