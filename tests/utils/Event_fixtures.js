import { test as base, expect } from '@playwright/test';

const LOGIN_URL = 'https://eventhub.rahulshettyacademy.com/login';
const API_BASE_URL = 'https://api.eventhub.rahulshettyacademy.com';

const credentials = {
  email: 'rahulshetty1@yahoo.com',
  password: 'Magiclife1!',
};

export const test = base.extend({   // base.extend, not base.test.extend

  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(LOGIN_URL);
    await page.locator('#email').fill(credentials.email);
    await page.locator('#password').fill(credentials.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Featured Events')).toBeVisible();

    await use(page);
    await context.close();
  },

  createEvent: async ({ playwright }, use) => {
    const apiContext = await playwright.request.newContext({ baseURL: API_BASE_URL });

    const loginRes = await apiContext.post('/api/auth/login', { data: credentials });
    expect(loginRes.ok(), `Login failed: ${loginRes.status()} ${await loginRes.text()}`).toBeTruthy();
    const loginBody = await loginRes.json();
    const token = loginBody.token || loginBody.data?.token;
    expect(token, 'No token in login response').toBeTruthy();

    // Always a future date (30 days from now)
    const eventDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const createRes = await apiContext.post('/api/events', {
      data: {
        title: `Tech Talks Event ${Date.now()}`,
        description: 'fixture for testing.',
        category: 'Conference',
        venue: 'Westin hotel koregao park',
        city: 'Pune',
        eventDate,
        price: 1350,
        totalSeats: 100,
        imageUrl: 'https://guyanachronicle.com/wp-content/uploads/2024/06/Tech-Talk.jpg',
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(createRes.ok(), `Create failed: ${createRes.status()} ${await createRes.text()}`).toBeTruthy();

    const body = await createRes.json();
    const event = body.data || body.event || body;
    console.log('Created event:', event);   // remove once it works

    await use(event);

    if (event?.id) {
      await apiContext.delete(`/api/events/${event.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    await apiContext.dispose();
  },
});

export { expect };