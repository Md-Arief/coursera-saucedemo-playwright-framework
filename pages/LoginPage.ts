import { type Page, expect } from '@playwright/test';
import { TestUsers, Routes } from '../utils/test-data';

/**
 * Page Object for the Sauce Demo login page.
 */
export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async loginAsStandardUser() {
    await this.login(TestUsers.standard.username, TestUsers.standard.password);
  }

  async expectLoginPageVisible() {
    await expect(this.page.getByPlaceholder('Username')).toBeVisible();
    await expect(this.page.getByPlaceholder('Password')).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Login' })).toBeVisible();
  }

  async expectRedirectToInventory() {
    await expect(this.page).toHaveURL(Routes.inventory);
    await expect(this.page.getByText('Products')).toBeVisible();
  }
}
