import { test, expect } from '@playwright/test';

test('a new user can sign up and publish a post', async ({ page }) => {
    const stamp = Date.now();
    const email = `e2e-${stamp}@test.com`;
    const postText = `e2e post ${stamp}`;

    await page.goto('/signup');
    await page.getByPlaceholder('Kaelen Vance').fill(`E2E ${stamp}`);
    await page.getByPlaceholder('name@example.com').fill(email);
    await page.locator('input[type="password"]').fill('pass1234');
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page).toHaveURL('/');

    await page.getByPlaceholder("What's sparking in your mind?").fill(postText);
    await page.getByRole('button', { name: 'Post', exact: true }).click();

    await expect(page.getByText(postText)).toBeVisible();
});