# Web Automation Test Project

This project uses **Playwright** with **TypeScript** and follows the **Page Object Model (POM)** design pattern.

## Project Structure

- `tests/`: Contains all the test specification files.
- `pages/`: Contains Page Object classes representing different pages of the application.
- `fixtures/`: For custom Playwright fixtures.
- `utils/`: For utility functions and global configuration.
- `playwright.config.ts`: Global configuration for Playwright.

## How to Run Tests

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Install browsers:**
    ```bash
    npx playwright install
    ```

3.  **Run all tests:**
    ```bash
    npx playwright test
    ```

4.  **Run tests in UI mode:**
    ```bash
    npx playwright test --ui
    ```

5.  **Generate Test Report:**
    ```bash
    npx playwright show-report
    ```

## Royal Blue Theme Test Coverage

The following features of the Royal Blue theme are covered:

- **Navigation**: Verifies navbar links, hero buttons, and section scrolling.
- **Table Reservation**: Complete flow from finding a table to picking a specific table and providing customer details.
- **Event Booking**: Browsing events, viewing details, and checking availability.
- **Authentication**: Login and Registration flows.

## Folder Structure (Professional)

- `pages/royal-blue/`: Page Object Models for the theme.
- `tests/royal-blue/`: Specific test scenarios for each major feature.

## How to Run Royal Blue Tests

To run the specific tests for this theme:
```bash
npx playwright test tests/royal-blue
```
