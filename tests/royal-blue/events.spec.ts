import { test, expect } from '@playwright/test';
import { EventsPage } from '../../pages/royal-blue/EventsPage';

test.describe('Royal Blue - Event Booking Tests', () => {
    let eventsPage: EventsPage;

    test.beforeEach(async ({ page }) => {
        eventsPage = new EventsPage(page);
        await eventsPage.navigate('https://www.shebaa247.com/events');
    });

    test.describe('Positive Cases', () => {
        test('should verify event details can be viewed', async ({ page }) => {
            await eventsPage.openEventDetails(0);
            await expect(page.locator("text=Venue Details")).toBeVisible();
        });

        test('should allow user to check event availability with correct inputs', async ({ page }) => {
            await eventsPage.openEventDetails(0);
            await eventsPage.clickBookThisVenue();
            await expect(eventsPage.checkAvailabilityButton).toBeVisible();

            // Depending on the exact form inputs available in the actual UI, 
            // the user would theoretically pick a future date here. If the date 
            // input isn't defined explicitly in the POM we'll check it by text.
            const dateInput = page.locator('input[type="date"]').first();
            if (await dateInput.isVisible()) {
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                await dateInput.fill(nextWeek.toISOString().split('T')[0]);
                await eventsPage.checkAvailabilityButton.click();
                
                // Assuming it proceeds directly or shows success
                await expect(page.locator('text=Select event date')).toBeHidden(); 
            }
        });
    });

    test.describe('Negative & Validation Cases', () => {
        test('should prevent event booking availability check without selecting a date', async ({ page }) => {
            await eventsPage.openEventDetails(0);
            await eventsPage.clickBookThisVenue();
            
            await expect(eventsPage.checkAvailabilityButton).toBeVisible();
            await eventsPage.checkAvailabilityButton.click();
            
            // Should show standard validation or error since we didn't pick a date
            await expect(page.locator("text=Select event date").or(page.locator('.text-red-500')).first()).toBeVisible();
        });

        test('attempt to book venue on a past date', async ({ page }) => {
            await eventsPage.openEventDetails(0);
            await eventsPage.clickBookThisVenue();
            await expect(eventsPage.checkAvailabilityButton).toBeVisible();

            const dateInput = page.locator('input[type="date"]').first();
            if (await dateInput.isVisible()) {
                const pastDate = new Date();
                pastDate.setDate(pastDate.getDate() - 2); // 2 days ago
                await dateInput.fill(pastDate.toISOString().split('T')[0]);
                await eventsPage.checkAvailabilityButton.click();
                
                // Ideally it should show an unavailability or past date error notice
                await expect(page.locator('text=past').or(page.locator('text=Not available')).or(page.locator('.text-red-500')).first()).toBeVisible(); 
            }
        });
    });
});
