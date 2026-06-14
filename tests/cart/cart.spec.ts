import path from 'path';
import { test, expect } from '../../fixtures/test-fixtures';
import { Products, AuthFile } from '../../utils/test-data';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    // storageState from setup project provides authenticated session
    await page.goto('/inventory.html');
  });

  test('adds products to cart and updates cart badge count', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.expectLoaded();

    // Scoped interactions within the inventory list container
    await inventoryPage.addProductToCart(Products.backpack);
    await inventoryPage.expectCartBadgeCount(1);

    await inventoryPage.addProductToCart(Products.bikeLight);
    await inventoryPage.expectCartBadgeCount(2);

    await inventoryPage.openCart();
    await cartPage.expectLoaded();
    await cartPage.expectItemCount(2);
    await cartPage.expectProductInCart(Products.backpack);
    await cartPage.expectProductInCart(Products.bikeLight);
  });

  test('opens cart with pre-authenticated browser context', async ({ browser }) => {
    // Advanced: isolated browser context with reused storageState (no login in test)
    const authPath = path.join(process.cwd(), AuthFile);
    const context = await browser.newContext({ storageState: authPath });
    const page = await context.newPage();

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await page.goto('/inventory.html');
    await inventoryPage.addProductToCart(Products.backpack);
    await inventoryPage.expectCartBadgeCount(1);
    await inventoryPage.openCart();
    await cartPage.expectProductInCart(Products.backpack);

    await context.close();
  });
});
