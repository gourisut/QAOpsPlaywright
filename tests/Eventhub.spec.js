// 

// test('@Create Account', async ({ page }) =>{

//     const email= 'gouri@gmail.com';
//     const password='Abcd@123';

//     await page.goto("https://eventhub.rahulshettyacademy.com/");

//     await page.getByText("Register").click();
//     await page.getByPlaceholder("you@email.com").fill(email);
//     await page.getByPlaceholder("password").fill(password);    
//     await page.getByPlaceholder("Repeat your password").fill(password); 
//     await page.getByText("Create Account").click();
//     //await expect(page).toHaveURL("https://eventhub.rahulshettyacademy.com/",{timeout : 50_000});
//     await expect(page).toHaveURL(/.*eventhub\.rahulshettyacademy\.com/, { timeout: 50_000 });
//     //await page.pause();

// })

import { test, expect } from '@playwright/test';

const email = 'gouri@gmail.com';
const pass = 'Abcd@123'; 
const pagelink = 'https://eventhub.rahulshettyacademy.com';

async function login(page) {
  // Fixed: Backticks used for template literal
  await page.goto(`${pagelink}/login`);

  await page.getByPlaceholder('you@email.com').fill(email);
  await page.getByLabel('Password').fill(pass);
  await page.locator('#login-btn').click();
  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

test('create event, book and verify seat reduction', async ({ page }) => {

  // Log in 
  await login(page);

  // Create a new event
  await page.goto(`${pagelink}/admin/events`);
  const myEvent = `Naad Bhairav${Date.now()}`;
  await page.locator('#event-title-input').fill(myEvent);

  await page.locator('#admin-event-form textarea').fill('Playwright test event');

  await page.getByLabel('City').fill('Test City');
  await page.getByLabel('Venue').fill('Test Venue');

  await page.getByLabel('Event Date & Time').fill('2027-12-31T10:00');

  await page.getByLabel('Price ($)').fill('1150');
  await page.getByLabel('Total Seats').fill('6');

  await page.locator('#add-event-btn').click();

  await expect(page.getByText('Event created!')).toBeVisible();

  console.log(`Created event: "${myEvent}"`);

  // Book event
  await page.goto(`${pagelink}/events`);

  const eventCards = page.getByTestId('event-card');
  await expect(eventCards.first()).toBeVisible();

  const targetCard = eventCards.filter({ hasText: myEvent }).first();
  await expect(targetCard).toBeVisible({ timeout: 5000 });

  const seatsBeforeBooking = parseInt(await targetCard.getByText('seat').first().innerText());
  console.log(`Seats before booking: ${seatsBeforeBooking}`);
  
  await targetCard.getByTestId('book-now-btn').click();

  // Booking form
  const ticketCount = page.locator('#ticket-count');
  await expect(ticketCount).toHaveText('1');

  await page.getByLabel('Full Name').fill('Test Student');

  await page.locator('#customer-email').fill('test.student@example.com');

  await page.getByPlaceholder('+91 98765 43210').fill('9876543210');
  
  await page.locator('.confirm-booking-btn').click();

  // Confirm booking
  const bookingRefEl = page.locator('.booking-ref').first();
  await expect(bookingRefEl).toBeVisible();

  const bookingRef = (await bookingRefEl.innerText()).trim();
  expect(bookingRef.charAt(0)).toBe(myEvent.trim().charAt(0).toUpperCase());

  console.log(`Booking confirmed. Ref: ${bookingRef}`);

  // Verify my booking
  await page.getByRole('link', { name: 'View My Bookings' }).click();
  
  // Fixed: Replaced custom/invalid toHavepagelink with toHaveURL
  await expect(page).toHaveURL(`${pagelink}/bookings`);

  const bookingCards = page.locator('#booking-card');
  await expect(bookingCards.first()).toBeVisible();

  // Fixed: Filter using text content directly
  const matchingCard = bookingCards.filter({ hasText: bookingRef });
  await expect(matchingCard).toBeVisible();

  await expect(matchingCard).toContainText(myEvent);

  console.log(`Booking card found in My Bookings for ref: ${bookingRef}`);

  // Verify reduced seat count  
  await page.goto(`${pagelink}/events`);
  await expect(eventCards.first()).toBeVisible();

  const updatedCard = eventCards.filter({ hasText: myEvent }).first();
  await expect(updatedCard).toBeVisible();

  const seatsAfterBooking = parseInt(await updatedCard.getByText('seat').first().innerText());
  console.log(`Seats after booking: ${seatsAfterBooking}`);

  expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
});



const User_email = { email: 'gouri@gmail.com', password: 'Abcd@123!' };

async function loginAndGoToBooking(page) {
  await page.goto(`${pagelink}/login`);
  await page.getByLabel('Email').fill(User_email.email);
  await page.getByPlaceholder('••••••').fill(User_email.password);
  await page.locator('#login-btn').click();
  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

//refund→ eligible 
test('refund eligible for single ticket booking', async ({ page }) => {
  await loginAndGoToBooking(page);

  await page.goto(`${pagelink}/events`);
  await page.getByTestId('event-card').first().getByTestId('book-now-btn').click();


  await page.getByLabel('Full Name').fill('Test User');
  await page.locator('#customer-email').fill(User_email.email);
  await page.getByPlaceholder('+91 98765 43210').fill('9999999999');
  await page.locator('.confirm-booking-btn').click();

  await page.getByRole('link', { name: 'View My Bookings' }).click();
  await expect(page).toHaveURL(`${pagelink}/bookings`);
  await page.getByRole('link', { name: 'View Details' }).first().click();
  await expect(page.getByText('Booking Information')).toBeVisible();

  const bookingRef = await page.locator('span.font-mono.font-bold').innerText();
  const eventTitle = await page.locator('h1').innerText();
  expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));

  await page.locator('#check-refund-btn').click();

  await expect(page.locator('#refund-spinner')).toBeVisible();

  await expect(page.locator('#refund-spinner')).not.toBeVisible({ timeout: 6000 });

  const result = page.locator('#refund-result');
  await expect(result).toBeVisible();
  await expect(result).toContainText('Eligible for refund');
  await expect(result).toContainText('Single-ticket bookings qualify for a full refund');
});


test('refund not eligible for group ticket booking', async ({ page }) => {
  await loginAndGoToBooking(page);

  await page.goto(`${pagelink}/events`);
  await page.getByTestId('event-card').first().getByTestId('book-now-btn').click();

  await page.locator('button:has-text("+")').click();
  await page.locator('button:has-text("+")').click();

  await page.getByLabel('Full Name').fill('Test User');
  await page.locator('#customer-email').fill(User_email.email);
  await page.getByPlaceholder('+91 98765 43210').fill('9999999999');
  await page.locator('.confirm-booking-btn').click();

  await page.getByRole('link', { name: 'View My Bookings' }).click();
  await expect(page).toHaveURL(`${pagelink}/bookings`);
  await page.getByRole('link', { name: 'View Details' }).first().click();
  await expect(page.getByText('Booking Information')).toBeVisible();

  const bookingRef = await page.locator('span.font-mono.font-bold').innerText();
  const eventTitle = await page.locator('h1').innerText();
  expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));

  await page.locator('#check-refund-btn').click();

  await expect(page.locator('#refund-spinner')).toBeVisible();

  await expect(page.locator('#refund-spinner')).not.toBeVisible({ timeout: 6000 });

  const result = page.locator('#refund-result');
  await expect(result).toBeVisible();
  await expect(result).toContainText('Not eligible for refund');
  await expect(result).toContainText('Group bookings (3 tickets) are non-refundable');
});