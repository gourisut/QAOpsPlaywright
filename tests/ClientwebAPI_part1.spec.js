// test - for testcases, expect- for assertions,  request - for API testing
const { test, expect, request } = require('@playwright/test');

// create payload as java script object
const loginPayload = { userEmail: "anshika@gmail.com", userPassword: "Iamking@000" };
// create order payload for orderAPI
const orderPayload = { orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }] };

// declare globally so they're accessible inside the test() block below
let token;
let orderId;

// runs once before test execution
test.beforeAll(async () => {
    // ---------- Login API ----------
    const apicontext = await request.newContext();
    const loginresrponse = await apicontext.post('https://rahulshettyacademy.com/api/ecom/auth/login', {
        data: loginPayload
    });

    expect(loginresrponse.ok()).toBeTruthy();
    const login_resp_json = await loginresrponse.json();
    token = login_resp_json.token; // no 'const' — assigns to the outer `token`
    console.log(token);

    // ---------- Order API ----------
    const orderResponse = await apicontext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
        data: orderPayload,
        headers: {
            'Authorization': token,
            'content-type': 'application/json'
        },
    });

    expect(orderResponse.ok()).toBeTruthy(); // good practice: verify order creation succeeded too

    // This must stay INSIDE beforeAll — orderResponse only exists in this scope,
    // and top-level await outside an async function is invalid syntax anyway.
    const orderResponsejson = await orderResponse.json();
    console.log(orderResponsejson);
    orderId = orderResponsejson.orders[0]; // no 'const' — assigns to the outer `orderId`
});

test('@Website Client App login', async ({ page }) => {

    // using js script to utilize localStorage for API calling
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token);

    await page.goto("https://rahulshettyacademy.com/client/");
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();

    const rows = page.locator("tbody tr"); // no 'await' needed here — locators aren't promises

    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if (orderId.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();
});