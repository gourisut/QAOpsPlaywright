const { test, expect } = require('@playwright/test');

test('page play wright test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    //**/*.css any url ending with css extention and will remove images if any
    await page.route('**/*.{css,jpg,png,jpeg}',
        route => route.abort()
    );
    const userName = page.locator('#username');
    const password = page.locator("[type='password']");
    const signIn = page.locator('#signInBtn');
    const cardTitle = page.locator(".card-body a");

    //print log in output
    await page.on('request', request => console.log(request.url()));
    await page.on('response', response => console.log(response.url(), response.status()));

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    await userName.fill("RahulShetty");
    await password.fill("RahulShetty");
    await signIn.click();

    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Incorrect')

    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await password.fill("Learning@830$3mK2");
    await signIn.click();

    //select 1st item using nth indexing or first() can use
    console.log(await cardTitle.nth(0).textContent());
    console.log(await cardTitle.first().textContent());

    //get list of all products on page
    const allTitle = await cardTitle.allTextContents();
    console.log(allTitle);

})