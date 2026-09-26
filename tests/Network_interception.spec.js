// test - for testcases, expect- for assertions,  request - for API testing
const { test, expect, request } = require('@playwright/test');
const { APIutils } = require('./utils/APIutils');

const loginPayload = { userEmail: "anshika@gmail.com", userPassword: "Iamking@000" };
const orderPayload = { orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }] };
const fake_Payload_order={data:[], messsage:"No orders"};
// declare globally so it's accessible inside the test() block below
let response;


// runs once before test execution
test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APIutils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload); // await added — response is now the resolved { token, orderId } object
});

test('@Website Client App login', async ({ page }) => {

    // using js script to utilize localStorage for API calling
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client/");

    //go and mock order call
    //route- arguement 1- actual route argument2- route it to where we want
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route=>{
            // get original API response from given route --> with request method we switch from browser to API
            response =await page.request.fetch(route.request());
            //fullfill method expects to have body
            let body=JSON.stringify(fake_Payload_order) ;//js object to json

            //intercept response --> API respomnse-->intercept add fake response
            // -->sent to browser-->render data on frontend
            route.fulfill(  //fullfill sending that response back to browser
                {
                    response,
                    body
                }
            );

        }
    );

    await page.locator("button[routerlink*='myorders']").click();
    //await page.pause();
    //adding * at end of url replacing oreder id so, it will generic for any user
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
    console.log(await page.locator(".mt-4").textContent());

});