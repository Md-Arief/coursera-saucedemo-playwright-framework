import { type Locator, type Page } from '@playwright/test';

/**
 * Custom locator helpers scoped to Sauce Demo data-test attributes.
 * Encapsulates selector strategy for reuse across page objects.
 */
export class SauceDemoLocators {
  constructor(private readonly page: Page) {}

  /** Scoped to the product inventory grid container. */
  inventoryList(): Locator {
    return this.page.locator('[data-test="inventory-list"]');
  }

  /** Add-to-cart button for a product by slug (e.g. sauce-labs-backpack). */
  addToCartButton(productSlug: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${productSlug}"]`);
  }

  /** Remove-from-cart button for a product by slug. */
  removeFromCartButton(productSlug: string): Locator {
    return this.page.locator(`[data-test="remove-${productSlug}"]`);
  }

  /** Cart link in the header with optional badge count. */
  cartLink(): Locator {
    return this.page.locator('[data-test="shopping-cart-link"]');
  }

  cartBadge(): Locator {
    return this.page.locator('[data-test="shopping-cart-badge"]');
  }

  /** Checkout form fields scoped to the checkout container. */
  checkoutForm(): Locator {
    return this.page.locator('[data-test="checkout-container"]');
  }
}

/** Convert product display name to Sauce Demo data-test slug. */
export function productSlug(productName: string): string {
  return productName.toLowerCase().replace(/\s+/g, '-');
}
