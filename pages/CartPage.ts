import { type Page, expect } from '@playwright/test';
import { Routes } from '../utils/test-data';

/**
 * Page Object for the Sauce Demo shopping cart page.
 */
export class CartPage {
  constructor(private readonly page: Page) {}

  async expectLoaded() {
    await expect(this.page).toHaveURL(Routes.cart);
    await expect(this.page.locator('[data-test="cart-contents-container"]')).toBeVisible();
  }

  async expectItemCount(count: number) {
    const items = this.page.locator('[data-test="inventory-item"]');
    await expect(items).toHaveCount(count);
  }

  async expectProductInCart(productName: string) {
    await expect(
      this.page.locator('[data-test="inventory-item"]').filter({ hasText: productName })
    ).toBeVisible();
  }

  async proceedToCheckout() {
    await this.page.locator('[data-test="checkout"]').click();
  }

  /** Scoped cart summary container for assertions. */
  cartContents() {
    return this.page.locator('[data-test="cart-contents-container"]');
  }
}
