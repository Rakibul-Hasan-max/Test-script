import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class EventsPage extends BasePage {
    readonly seeDetailsButtons: Locator;
    readonly bookThisVenueButton: Locator;
    readonly checkAvailabilityButton: Locator;

    constructor(page: Page) {
        super(page);
        this.seeDetailsButtons = page.locator("button:has-text('SEE DETAILS')");
        this.bookThisVenueButton = page.locator("button:has-text('BOOK THIS VENUE')");
        this.checkAvailabilityButton = page.locator("button:has-text('Check Availability')");
    }

    async openEventDetails(index: number = 0) {
        await this.seeDetailsButtons.nth(index).click();
    }

    async clickBookThisVenue() {
        await this.bookThisVenueButton.click();
    }
}
