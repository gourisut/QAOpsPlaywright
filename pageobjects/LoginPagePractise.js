class LoginPagePractise {

constructor(page)
{
    this.page = page;
    this.userName = page.locator("#username");
    this.password = page.locator("#password");
    this.termsCheckbox = page.locator("#terms");
    this.signInButton = page.locator("#signInBtn");
}

async goTo()
{
    await this.page.goto("https://rahulshettyacademy.com/loginpagePractise/");
}

async validLogin(username, password)
{
    await this.userName.fill(username);
    await this.password.fill(password);
    await this.termsCheckbox.check();
    await this.signInButton.click();
    await this.page.waitForLoadState('networkidle');
}

}
module.exports = {LoginPagePractise};