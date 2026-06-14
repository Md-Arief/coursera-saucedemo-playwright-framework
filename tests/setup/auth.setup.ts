import { test as setup } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../../pages/LoginPage';
import { AuthFile } from '../../utils/test-data';

const authPath = path.join(process.cwd(), AuthFile);

/**
 * Authenticate once and persist session for cart, checkout, and visual tests.
 * Avoids repeating login steps across the suite (storageState reuse).
 */
setup('authenticate as standard user', async ({ page, context }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAsStandardUser();
  await loginPage.expectRedirectToInventory();
  await context.storageState({ path: authPath });
});
