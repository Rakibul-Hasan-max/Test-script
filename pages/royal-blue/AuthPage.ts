import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class AuthPage extends BasePage {
    // Login & registration common
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    
    // Login
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
        // Using more robust selectors that work for both login and register if possible
        this.emailInput = page.locator('input[name="email"], input#email, input[type="email"]').first();
        this.passwordInput = page.locator('input[name="password"], input#password, input[type="password"]').first();
        this.loginButton = page.locator('button:has-text("Login")');
        
        this.registerLink = page.locator("text=Create Account, text=Register").first();
        this.firstNameInput = page.locator('input[name="first_name"], input#first_name').first();
        this.lastNameInput = page.locator('input[name="last_name"], input#last_name').first();
        this.phoneInput = page.locator('input[name="phone"], input#phone').first();
        this.confirmPasswordInput = page.locator('input[name="confirm_password"], input#confirm_password').first();
        this.createAccountButton = page.locator('button:has-text("Create Account")');
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
