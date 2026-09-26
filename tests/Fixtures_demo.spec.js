const { expect } = require('@playwright/test');
const { customtest } = require('./utils/fixtures.js');

customtest('Fixtures demo', async ({ authenticatedPage, createOrder }) => {
    // Navigate to orders
    await authenticatedPage.locator("button[routerlink*='myorders']").click();
    await authenticatedPage.locator("tbody").waitFor();

    // Fix: getByText (capital T) + .toBeVisible()
    await expect(authenticatedPage.getByText(createOrder.orderId)).toBeVisible();
});