import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Login', () => {
  test('logs in with valid credentials and redirects to inventory', async ({ loginPage }) => {
    // Fresh guest session — no storageState; validates the full login journey
    await loginPage.goto();
    await loginPage.expectLoginPageVisible();
    await loginPage.loginAsStandardUser();
    await loginPage.expectRedirectToInventory();
  });

  test('shows login form on initial visit', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.expectLoginPageVisible();
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
  });
});
