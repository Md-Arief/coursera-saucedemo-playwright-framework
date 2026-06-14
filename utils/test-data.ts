/**
 * Centralized test data for Sauce Demo e-commerce flows.
 */
export const TestUsers = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
} as const;

export const CheckoutData = {
  firstName: 'Test',
  lastName: 'User',
  postalCode: '12345',
} as const;

export const Products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
} as const;

export const Routes = {
  inventory: /inventory/,
  cart: /cart/,
  checkoutStepOne: /checkout-step-one/,
  checkoutStepTwo: /checkout-step-two/,
  checkoutComplete: /checkout-complete/,
} as const;

export const AuthFile = '.auth/user.json';
