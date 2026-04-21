import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/royal-blue/HomePage';

test.describe('Royal Blue - Navigation Tests', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.navigate('https://www.shebaa247.com/');
    });

    test('should verify navbar links work', async ({ page }) => {
        // Check about section
        await homePage.navbarLinks.about.click();
        await expect(page.locator('#about')).toBeVisible();

        // Check menu section
        await homePage.navbarLinks.menu.click();
        await expect(page.locator('#menu')).toBeVisible();

        // Check events section (In Royal Blue, navbar link is a hash link)
        await homePage.navbarLinks.events.click();
        await expect(page).toHaveURL(/.*#events/);
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
