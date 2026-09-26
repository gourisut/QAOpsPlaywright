//annotation test and expect
const{test,expect}=require('@playwright/test');

//.only will be useed if we want to trigger perticular testcase onlynpx playwright test --project=chromium
test('fisrt play wright test',async ({browser})=>
{
    /*
    async wait need to be added before every step/test asplaywright does 
    not exececute testcases in sequence and will move to next test cease or 
    step if it takes time to response
    */
    // open fresh browser instance
    const context=await browser.newContext();

    //open actual page where you can run test cases
    const page= await context.newPage();

    //hit or open url
    await page.goto("https://www.tutedude.com/");

    //get title of page and print with console.log
    console.log(await page.title());

    //Assertions
    await expect(page).toHaveTitle("Tutedude: Online Tech Courses with 100% Refund Guarantee");

}); 

test('page play wright test',async ({browser})=>
{
    /*  
    Commentes structure is not needed as playwright gives it auomatically
    You can directly start from page url as well

    //open fresh browser instance
    const context=await browser.newContext();
    //open actual page where you can run test cases
    const page= await context.newPage();

    */
    const context=await browser.newContext();
    const page= await context.newPage();
    const userName= page.locator('#username');
    const password= page.locator("[type='password']");
    const signIn=page.locator('#signInBtn');
    const cardTitle=page.locator(".card-body a");
  
    //hit or open url
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    // css locators use fill to enter something, the updated version of playwright have deprecated type method
    //page.locator('#username').type("RahulShetty")
    await userName.fill("RahulShetty");
    await password.fill("RahulShetty");
    //click sign in
    await signIn.click();
    //error validation
    //console.log( await page.locator(".alert.alert-danger.col-md-12").textContent()); //with class
    console.log( await page.locator("[style*='block']").textContent());
    //validate error message with assertion, you can specify whole msg or part of message as well
    await expect(page.locator("[style*='block']")).toContainText('Incorrect')

    //clear existing content with fill blank
    await userName.fill("");

    //enter correct data
    await userName.fill("rahulshettyacademy");
    //enter pass
    await password.fill("Learning@830$3mK2");
    //sign in btn
    await  signIn.click();

    //select 1st item using nth indexing or first() can use
    console.log( await cardTitle.nth(0).textContent());
    console.log( await cardTitle.first().textContent());

    //get list of all products on page
    const allTitle=await cardTitle.allTextContents();
    console.log(allTitle);

})

test('UI controls',async ({page})=>
{
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    const userName= page.locator('#username');
    const password= page.locator("[type='password']");
    const signIn=page.locator('#signInBtn');
    //handling dropedown
    const dropdown= page.locator("select.form-control");
    const documentLink=page.locator("[href*='documents-request']");
    await dropdown.selectOption("consult");


    //radio button
    await page.locator(".radiotextsty").last().click();
    await page.locator("#okayBtn").click();

    //assertion for click ok 
    expect(await page.locator(".radiotextsty").last()).toBeChecked();


    // asertions to check if check box is unchecked
    await page.locator("#terms").click();
    await expect(page.locator("#terms")).toBeChecked();

    //Use page pause to see results on page
    //await page.pause();

    //assert to check if check box is not checked
    await page.locator("#terms").uncheck();
    expect(await page.locator("#terms").isChecked());

    await expect(documentLink).toHaveAttribute('class','blinkingText');

})

test('Child window handle',async ({browser})=>{

    const context= await browser.newContext();
    const page= await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const documentLink=page.locator("[href*='documents-request']");

    //wait until all parallel executions are done 
    const [newPage]=await Promise.all(
        [    
        //use waitfor event in case new page is being invoked page status- pending,rejected,fulfilled
        context.waitForEvent('page'), //start listing to new page
        //open new page
        documentLink.click(),
        ]
    )

    const text = await newPage.locator(".red").textContent();
    //split array
    const arrayText= text.split("@");
    //split array with whitespace and store 0th index
    const email =arrayText[1].split(" ")[0];
    console.log(email);
    console.log(text);

        //console.log(domain);
    await page.locator("#username").fill(email);
    console.log(await page.locator("#username").inputValue());

})