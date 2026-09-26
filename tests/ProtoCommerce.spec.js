const { test, expect } = require('@playwright/test');
 
test('@playwright Special Locators', async ({ page }) => {
    //test level timeout
    test.setTimeout(60000) 
    const slowExpect=expect.configure({timeout: 9000});

    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    //checkbox
    //Get by label if any locator having label
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption("Female");
    //get by placeholder
    await page.getByPlaceholder("Password").fill('AB12#4');
    //get by role
    await page.getByRole("Button",{name: 'Submit'}).click();
    //get by text
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();

    //direct apply boolean and we set gloabal 5 sec default timeout for expect assertion
    //add override timeout of 10 sec to step level--applicable for specific stepx`
    await expect(page.getByText("Success! The Form has been submitted successfully!."))
    .toBeVisible({timeout:10_000});
    //get by role link
    await page.getByRole("link",{name : "Shop"}).click();
    //testleve timeout use
    await slowExpect(page.locator(".my-4").first()).toHaveText("Shop Name");
    await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click();

    
})