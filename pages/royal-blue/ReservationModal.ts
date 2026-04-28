import { Page, Locator } from '@playwright/test';

export class ReservationModal {
    readonly page: Page;
    readonly tableButtons: Locator;
    readonly customerNameInput: Locator;
    readonly customerPhoneInput: Locator;
    readonly customerEmailInput: Locator;
    readonly specialRequestsInput: Locator;
    readonly confirmBookingButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.tableButtons = page.locator("button.aspect-square"); // Based on the code analysis
        this.customerNameInput = page.locator("input[name='customer_name']");
        this.customerPhoneInput = page.locator("input[name='customer_phone']");
        this.customerEmailInput = page.locator("input[name='customer_email']");
        this.specialRequestsInput = page.locator("textarea[name='special_requests']");
        this.confirmBookingButton = page.locator("button:has-text('Confirm Booking')");
        this.successMessage = page.locator("text=Your reservation request is pending");
    }

    async selectTable(index: number = 0) {
        await this.tableButtons.nth(index).click();
    }

    async fillCustomerDetails(name: string, phone: string, email: string = '', requests: string = '') {
        await this.customerNameInput.fill(name);
        await this.customerPhoneInput.fill(phone);
        if (email) await this.customerEmailInput.fill(email);
        if (requests) await this.specialRequestsInput.fill(requests);
    }

    async confirmBooking() {
        await this.confirmBookingButton.click();
    }
}
