import { test, expect } from '@playwright/test';

// Base Configuration
const BASE_URL = 'https://eventhub.rahulshettyacademy.com';

// FIXED: API endpoints live on the api. sub-domain according to Swagger docs
const API_URL = 'https://api.eventhub.rahulshettyacademy.com/api';

// User Credentials
const YAHOO_USER = {
  email: 'gouri@yahoo.com',
  password: 'Abcd@123',
  name: 'Yahoo User',
  phone: '9876543210',
};

const GMAIL_USER = {
  email: 'gouri@gmail.com',
  password: 'Abcd@123',
  name: 'Gmail User',
};

// Helper function 
async function loginAs(page, user) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.locator('#login-btn').click();
  // Ensure login completed before proceeding
  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

test.describe('EventHub Unauthorized Booking Access Security Test', () => {
  test('Gmail user should get Access Denied when attempting to access Yahoo user booking URL', async ({ request, page }) => {

    //  Optional Auto-register Yahoo User (Ensures account exists)

    await request.post(`${API_URL}/auth/register`, {
      data: {
        name: YAHOO_USER.name,
        email: YAHOO_USER.email,
        password: YAHOO_USER.password,
        phone: YAHOO_USER.phone,
      },
    });

    // Login as Yahoo user via API
    const loginRes = await request.post(`${API_URL}/auth/login`, {
      data: {
        email: YAHOO_USER.email,
        password: YAHOO_USER.password,
      },
    });

    expect(loginRes.ok()).toBeTruthy();
    const loginData = await loginRes.json();
    
    const token = loginData.token || loginData.data?.token || loginData.accessToken;
    expect(token).toBeTruthy();

    //  Fetch events via API to get a valid event ID

    const eventsRes = await request.get(`${API_URL}/events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(eventsRes.ok()).toBeTruthy();
    const eventsData = await eventsRes.json();
    const eventId = eventsData.data[0].id;
    expect(eventId).toBeDefined();


    // Create a booking via API as Yahoo user

    const bookingRes = await request.post(`${API_URL}/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        eventId: eventId,
        customerName: YAHOO_USER.name,
        customerEmail: YAHOO_USER.email,
        customerPhone: YAHOO_USER.phone,
        quantity: 1,
      },
    });

    expect(bookingRes.ok()).toBeTruthy();
    const bookingResponseBody = await bookingRes.json();
    const yahooBookingId = bookingResponseBody.data.id;
    expect(yahooBookingId).toBeDefined();

    // Login as Gmail user via browser UI

    await loginAs(page, GMAIL_USER);
    await page.goto(`${BASE_URL}/bookings/${yahooBookingId}`, {
      waitUntil: 'networkidle',
    });
    
    //access denied
    const accessDeniedHeading = page.getByText('Access Denied', { exact: false });
    await expect(accessDeniedHeading).toBeVisible();

    const unauthorizedMessage = page.getByText(
      'You are not authorized to view this booking',
      { exact: false }
    );
    await expect(unauthorizedMessage).toBeVisible();
  });
});