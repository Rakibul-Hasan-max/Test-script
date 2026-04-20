import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class AuthPage extends BasePage {
    // Login
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    
    // Registration
    readonly registerLink: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly phoneInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly createAccountButton: Locator;

    constructor(page: Page) {
        super(page);
        this.emailInput = page.locator("#email");
        this.passwordInput = page.locator("#password");
        this.loginButton = page.locator("button:has-text('Login')");
        
        this.registerLink = page.locator("text=Create Account");
        this.firstNameInput = page.locator("#first_name");
        this.lastNameInput = page.locator("#last_name");
        this.phoneInput = page.locator("#phone");
        this.confirmPasswordInput = page.locator("#confirm_password");
        this.createAccountButton = page.locator("button:has-text('Create Account')");
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async goToRegistration() {
        await this.registerLink.click();
    }

    async register(details: any) {
        await this.firstNameInput.fill(details.firstName);
        await this.lastNameInput.fill(details.lastName);
        await this.emailInput.fill(details.email);
        await this.phoneInput.fill(details.phone);
        await this.passwordInput.fill(details.password);
        await this.confirmPasswordInput.fill(details.password);
        await this.createAccountButton.click();
    }
}
