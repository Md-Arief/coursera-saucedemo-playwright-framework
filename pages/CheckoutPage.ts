import { type Page, expect } from '@playwright/test';
import { CheckoutData, Routes } from '../utils/test-data';

/**
 * Page Object for the Sauce Demo checkout flow (info, overview, complete).
 */
export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async fillShippingInfo(
    firstName = CheckoutData.firstName,
    lastName = CheckoutData.lastName,
    postalCode = CheckoutData.postalCode
  ) {
    await this.page.locator('[data-test="firstName"]').fill(firstName);
    await this.page.locator('[data-test="lastName"]').fill(lastName);
    await this.page.locator('[data-test="postalCode"]').fill(postalCode);
    await this.page.locator('[data-test="continue"]').click();
  }

  async expectCheckoutOverview() {
    await expect(this.page).toHaveURL(Routes.checkoutStepTwo);
    await expect(this.page.locator('[data-test="checkout-summary-container"]')).toBeVisible();
  }

  async finishOrder() {
    await this.page.locator('[data-test="finish"]').click();
  }

  async expectOrderConfirmation() {
    await expect(this.page).toHaveURL(Routes.checkoutComplete);
    await expect(this.page.getByText('Thank you for your order!')).toBeVisible();
    await expect(this.page.locator('[data-test="checkout-complete-container"]')).toBeVisible();
  }

  /** Stable confirmation panel for visual regression. */
  confirmationContainer() {
    return this.page.locator('[data-test="checkout-complete-container"]');
  }
}
