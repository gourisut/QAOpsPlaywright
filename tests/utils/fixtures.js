const base = require('@playwright/test');
const { APIutils } = require('./APIutils.js');
const { request } = require('@playwright/test');

const loginPayload = { userEmail: "anshika@gmail.com", userPassword: "Iamking@000" };
const orderPayload = { orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }] };

const customtest = base.test.extend({
    authenticatedPage: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto("https://rahulshettyacademy.com/client");
        
        // Use the exact same credentials that generated the order
        await page.locator("#userEmail").fill(loginPayload.userEmail);
        await page.locator("#userPassword").fill(loginPayload.userPassword);
        await page.locator("[value='Login']").click();
        await page.waitForLoadState('networkidle');
        
        await use(page);
    },

    createOrder: async ({ }, use) => {
        const apiContext = await request.newContext();
        const apiUtils = new APIutils(apiContext, loginPayload);
        const response = await apiUtils.createOrder(orderPayload);
        await use(response);
    }
});



module.exports = { customtest };