import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class ProfilePage extends BasePage {
    readonly editProfileButton: Locator;
    readonly bgFirstNameField: Locator; // When in view mode
    
    // Edit mode
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly phoneInput: Locator;
    readonly emailInput: Locator;
    readonly saveChangesButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        super(page);
        this.editProfileButton = page.locator('button:has-text("Edit Profile")');
        
        // Use generic placeholders for view text if needed
        this.bgFirstNameField = page.locator('p.text-lg.font-semibold >> nth=0');

        this.firstNameInput = page.locator('input[placeholder="First name"]');
        this.lastNameInput = page.locator('input[placeholder="Last name"]');
        this.phoneInput = page.locator('input[type="tel"]');
        this.emailInput = page.locator('input[type="email"]');
        
        this.saveChangesButton = page.locator('button:has-text("Save Changes")');
        this.cancelButton = page.locator('button:has-text("Cancel")');
    }

    async clickEditProfile() {
        await this.editProfileButton.click();
    }

    async updateProfile(details: {firstName?: string, lastName?: string, phone?: string}) {
        if (details.firstName) await this.firstNameInput.fill(details.firstName);
        if (details.lastName) await this.lastNameInput.fill(details.lastName);
        if (details.phone) await this.phoneInput.fill(details.phone);
        await this.saveChangesButton.click();
    }
}
