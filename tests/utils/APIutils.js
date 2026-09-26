const { expect } = require('@playwright/test');

class APIutils {
    // sent API context created to utils
    constructor(apiContext, loginPayload) {
        // create new instance variable so that it will have access to complete class
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }

    async getToken() {
        const loginresrponse = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login', {
            data: this.loginPayload
        });

        expect(loginresrponse.ok()).toBeTruthy();
        const login_resp_json = await loginresrponse.json();
        const token = login_resp_json.token; // declared with const — no more implicit global
        console.log(token);
        return token;
    }

    async createOrder(orderPayload) {
        let response = {};
        response.token = await this.getToken(); // fetch once, reuse below

        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
            data: orderPayload,
            headers: {
                'Authorization': response.token, // reuse the token we already fetched — no second call, no unawaited Promise
                'content-type': 'application/json'
            },
        });

        expect(orderResponse.ok()).toBeTruthy(); // fail fast with a clear error if order creation fails

        const orderResponsejson = await orderResponse.json();
        console.log(orderResponsejson);

        response.orderId = orderResponsejson.orders[0]; // declared as a property, not an implicit global
       

        return response; // return the FULL object — test needs both token and orderId
    }
}

module.exports = { APIutils };