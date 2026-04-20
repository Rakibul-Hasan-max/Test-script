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
