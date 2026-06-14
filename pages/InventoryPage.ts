import { type Page, expect } from '@playwright/test';
import { SauceDemoLocators, productSlug } from '../utils/custom-locators';

/**
 * Page Object for the Sauce Demo product inventory (homepage after login).
 */
export class InventoryPage {
  private readonly locators: SauceDemoLocators;

  constructor(private readonly page: Page) {
    this.locators = new SauceDemoLocators(page);
  }

  async expectLoaded() {
    await expect(this.page.getByText('Products')).toBeVisible();
    await expect(this.locators.inventoryList()).toBeVisible();
  }

  /**
   * Add a product to cart using scoped interaction within the inventory list.
   */
  async addProductToCart(productName: string) {
    const slug = productSlug(productName);
    const inventoryItem = this.locators
      .inventoryList()
      .locator('.inventory_item')
      .filter({ hasText: productName });

    await inventoryItem.locator(`[data-test="add-to-cart-${slug}"]`).click();
  }

  async expectCartBadgeCount(count: number) {
    await expect(this.locators.cartBadge()).toHaveText(String(count));
  }

  async openCart() {
    await this.locators.cartLink().click();
  }

  /** Stable UI region for visual regression on the inventory grid. */
  inventoryContainer() {
    return this.locators.inventoryList();
  }
}
