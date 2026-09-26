import { test, expect } from './utils/Event_fixtures.js';

test('newly event appearing on eventpage', async ({ authenticatedPage, createEvent }) => {
  await authenticatedPage.goto('https://eventhub.rahulshettyacademy.com/events');
  await expect(authenticatedPage.getByText(createEvent.title)).toBeVisible();
});