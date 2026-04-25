import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/royal-blue/HomePage';

test.describe('Royal Blue - Homepage Features Tests', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.navigate('https://www.shebaa247.com/');
    });

    test('should display testimonial section', async ({ page }) => {
        // Find the "Our Guestbook" section
        const testimonialSection = page.locator('section:has-text("Our Guestbook")');
        
        // Scroll to the element to trigger any lazy loading/animations
        await testimonialSection.scrollIntoViewIfNeeded();
        
        // Verify titles
        await expect(testimonialSection.locator('h4:has-text("Our Guestbook")')).toBeVisible();
        await expect(testimonialSection.locator('h2:has-text("What People Say")')).toBeVisible();
        
        // Verify testimonial cards exist
        await expect(testimonialSection.locator('p').first()).toBeVisible();
    });

    test('should verify Explore Full Menu link', async ({ page }) => {
        const exploreMenuLink = page.locator('a:has-text("Explore Full Menu")').first();
        
        await exploreMenuLink.scrollIntoViewIfNeeded();
        await exploreMenuLink.click();
        
        // Verify we are on the menu page
        await expect(page).toHaveURL(/.*\/menu/);
    });
});
