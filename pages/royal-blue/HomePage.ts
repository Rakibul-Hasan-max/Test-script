import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class HomePage extends BasePage {
    readonly navbarLinks: { [key: string]: Locator };
    readonly bookATableButton: Locator;
    readonly bookAnEventButton: Locator;
    readonly partySizeSelect: Locator;
    readonly reservationDateInput: Locator;
    readonly startTimeInput: Locator;
    readonly findTableButton: Locator;
    readonly userMenuButton: Locator;

    constructor(page: Page) {
        super(page);
        this.navbarLinks = {
            home: page.locator("a[href='#home']").first(),
            about: page.locator("a[href='#about']").first(),
            menu: page.locator("a[href='#menu']").first(),
            events: page.locator("a[href='#events']").first(),
            reservation: page.locator("a[href='#reservation'], a:has-text('Reservationn')").first(),
        };
        this.bookATableButton = page.locator("a[href='#reservation'] >> text=Book A Table");
        this.bookAnEventButton = page.locator("a[href='/events'] >> text=Book An Event");
        
        // Reservation section
        this.partySizeSelect = page.locator("#reservation select");
        this.reservationDateInput = page.locator("#reservation input[type='date']");
        this.startTimeInput = page.locator("#reservation input[type='time']");
        this.findTableButton = page.locator("#reservation button:has-text('FIND A TABLE')");
        
        // User menu
        this.userMenuButton = page.locator("button[aria-label='User menu']");
    }

    async openUserMenu() {
        await this.userMenuButton.click();
    }

    async fillReservationForm(partySize: string, date: string, time: string) {
        await this.partySizeSelect.selectOption(partySize);
        await this.reservationDateInput.fill(date);
        await this.startTimeInput.fill(time);
    }

    async clickFindTable() {
        await this.findTableButton.click();
    }
}
