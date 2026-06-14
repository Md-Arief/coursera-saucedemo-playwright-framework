import { test, expect } from '../../fixtures/test-fixtures';
import { Products } from '../../utils/test-data';

test.describe('Visual Regression', () => {
  test('inventory grid matches visual baseline', async ({ page, inventoryPage }) => {
    await page.goto('/inventory.html');
    await inventoryPage.expectLoaded();

    // Stable, consistent UI region — catches layout shifts and missing products
    await expect(inventoryPage.inventoryContainer()).toHaveScreenshot(
      'inventory-grid-baseline.png'
    );
  });

  test('checkout confirmation matches visual baseline', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await page.goto('/inventory.html');
    await inventoryPage.addProductToCart(Products.backpack);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo();
    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderConfirmation();

    await expect(checkoutPage.confirmationContainer()).toHaveScreenshot(
      'checkout-success-baseline.png'
    );
  });
});
