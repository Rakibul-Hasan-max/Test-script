import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/royal-blue/HomePage';

test.describe('Royal Blue - Homepage Features Tests', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.navigate('https://www.shebaa247.com/');
    });

    test('should display testimonial section', async ({ page }) => {
        // Find the "Our Guestbook" heading first to identify the section
        const heading = page.locator('h4, h2, h3, p').filter({ hasText: "Our Guestbook" }).first();
        
        // Scroll to the heading to ensure it's loaded
        await heading.scrollIntoViewIfNeeded({ timeout: 10000 });
        
        // Find the parent section or container
        const testimonialSection = page.locator('section, div').filter({ has: heading }).first();
        
        // Verify titles
        await expect(heading).toBeVisible();
        await expect(page.locator('text=What People Say').first()).toBeVisible();
        
        // Verify testimonial cards or content exist in that area
        await expect(testimonialSection.locator('p, span').first()).toBeVisible();
    });

    test('should verify Explore Full Menu link', async ({ page }) => {
        const exploreMenuLink = page.locator('a:has-text("Explore Full Menu")').first();
        
        await exploreMenuLink.scrollIntoViewIfNeeded();
        await exploreMenuLink.click();
        
        // Verify we are on the menu page
        await expect(page).toHaveURL(/.*\/menu/, { timeout: 10000 });
    });
});
