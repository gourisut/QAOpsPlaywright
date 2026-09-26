// test - for testcases, expect- for assertions,  request - for API testing
const { test, expect, request } = require('@playwright/test');
const {APIutils}=require('./utils/APIutils');

const loginPayload = { userEmail: "anshika@gmail.com", userPassword: "Iamking@000" };
const orderPayload = { orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }] };

// declare globally so they're accessible inside the test() block below

let response;

// runs once before test execution
test.beforeAll(async () => {
    const apiContext= await request.newContext();
    const apiUtils=new APIutils(apiContext,loginPayload);
    response = apiUtils.createOrder(orderPayload);
});

test('@Website Client App login', async ({ page }) => {

    // using js script to utilize localStorage for API calling
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client/");
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();

    const rows = page.locator("tbody tr"); // no 'await' needed here — locators aren't promises

    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if (response.orderId.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
});