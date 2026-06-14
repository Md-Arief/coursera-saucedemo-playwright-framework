import { test, expect } from '../../fixtures/test-fixtures';
import { Products } from '../../utils/test-data';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page, inventoryPage }) => {
    await page.goto('/inventory.html');
    await inventoryPage.expectLoaded();
  });

  test('proceeds through checkout and confirms order', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addProductToCart(Products.backpack);
    await inventoryPage.openCart();
    await cartPage.expectLoaded();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillShippingInfo();
    await checkoutPage.expectCheckoutOverview();
    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderConfirmation();
  });

  test('displays product in checkout summary before completing order', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    await inventoryPage.addProductToCart(Products.bikeLight);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo();
    await checkoutPage.expectCheckoutOverview();

    const summary = page.locator('[data-test="checkout-summary-container"]');
    await expect(summary.getByText(Products.bikeLight)).toBeVisible();
  });
});
