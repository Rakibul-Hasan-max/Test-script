import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/royal-blue/HomePage';

test.describe('Royal Blue - Navigation Tests', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.navigate('https://www.shebaa247.com/');
    });

    test('should verify all navbar links dynamically', async ({ page }) => {
        // Find all links in the main navigation area
        // Note: Using a broad locator that targets links in the header/nav
        const navLinks = page.locator('nav a, header a').filter({ hasText: /.+/ });
        const count = await navLinks.count();
        
        console.log(`Found ${count} navigation links.`);

        for (let i = 0; i < count; i++) {
            const link = navLinks.nth(i);
            const href = await link.getAttribute('href');
            const text = await link.innerText();
            
            if (!href || href === '#' || href.startsWith('javascript:')) continue;

            console.log(`Testing link: ${text} (${href})`);
            
            await link.click();
            
            if (href.startsWith('#')) {
                // If it's a hash link, verify the section is visible
                const section = page.locator(href);
                await expect(section).toBeInViewport({ timeout: 5000 });
            } else {
                // If it's a page link, verify the URL changed
                const expectedPath = href.startsWith('http') ? href : `.*${href}`;
                await expect(page).toHaveURL(new RegExp(expectedPath), { timeout: 5000 });
                
                // Go back home for the next link test if we moved to another page
                await page.goto('https://www.shebaa247.com/');
            }
        }
    });

    test('should verify hero buttons work', async ({ page }) => {
        // Book A Table
        await homePage.bookATableButton.click();
        await expect(page.locator('#reservation')).toBeInViewport();

        // Go back to home
        await page.goto('https://www.shebaa247.com/');

        // Book An Event
        await homePage.bookAnEventButton.click();
        await expect(page).toHaveURL(/.*\/events/);
    });
});
