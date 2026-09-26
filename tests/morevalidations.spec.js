const {test,expect}=require ('@playwright/test')

test("popup validation",async({page})=>{

    // await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    // // await page.goto("https://www.google.com/");
    // // await page.goBack();
    // // await page.goForward();
    
    // //make element visible
    //await page.locator(".displayed-class").click();
    await expect(page.locator(".displayed-class")).toBeVisible();
    //make it invisible
    await page.locator("#hide-textbox").click();
    //verify if invisible
    await expect(page.locator(".displayed-class")).toBeHidden();

    //accept popup also no wait whenever event occures it will accept
    await page.locator("#confirmbtn").click();
    await page.on('dialog',dialog=>dialog.accept);

    //howering cursor
    await page.locator("#mousehover").hover();
    

    //handle and automate frame current iframe is broken on page hence using href
    await page.goto('https://rahulshettyacademy.com/');
    await page.waitForLoadState('domcontentloaded');

    const statsCard = page.locator('.grid > div').nth(1);
    await statsCard.scrollIntoViewIfNeeded();
    
    console.log(await statsCard.textContent());
});

test("Screenshot and visual comparision",async({page})=>{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    await expect(page.locator(".displayed-class")).toBeVisible();
    //screenshot focused on locator
    await page.locator('#displayed-text').screenshot({path:'Locatorscreenshot.png'});
    await page.locator("#hide-textbox").click();
    //scrrenshot of full page
    await page.screenshot({path : 'screenshot.png'});
    await expect(page.locator(".displayed-class")).toBeHidden();
});

//take screenshot --> store --> take another screen shot --> compare both
// test.only('visual',async({page})=>{

//     await page.goto("https://rahulshettyacademy.com/AutomationPractice/", { waitUntil: 'domcontentloaded' });
//     //if landing page screenshot is not there test will fail but it will create landing page snap
//     //so next run will give you results
//     expect (await page.screenshot()).toMatchSnapshot('Landing.png');
// })