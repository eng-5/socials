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

test('a new post survives a slow, stale feed response', async ({ page }) => {
    let releaseFeed;
    const feedGate = new Promise(r => { releaseFeed = r; });

    let snapshotTaken;
    const snapshotReady = new Promise(r => { snapshotTaken = r; });
    const stamp = Date.now();
    const email = `e2e-${stamp}@test.com`;
    const postText = `e2e post ${stamp}`;

    await page.route(u => u.pathname === '/api/content/posts', async route => {
        if (route.request().method() !== 'GET') return route.continue();
        const response = await route.fetch();
        snapshotTaken();
        await feedGate;
        await route.fulfill({ response });
    });

    await page.goto('/signup');
    await page.getByPlaceholder('Kaelen Vance').fill(`E2E ${stamp}`);
    await page.getByPlaceholder('name@example.com').fill(email);
    await page.locator('input[type="password"]').fill('pass1234');



    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page).toHaveURL('/');

    await snapshotReady;

    await page.getByPlaceholder("What's sparking in your mind?").fill(postText);

    const postSaved = page.waitForResponse(
        res => res.request().method() === 'POST' && res.url().includes('/api/content/posts')
    )
    await page.getByRole('button', { name: 'Post', exact: true }).click();
    await postSaved;

    await expect(page.getByText(postText)).toBeVisible();
    await expect(page.getByTestId('post-card')).toHaveCount(1);
    releaseFeed();

    await expect(page.getByTestId('post-card')).not.toHaveCount(1, { timeout: 5000 });

    await expect(page.getByText(postText)).toBeVisible();


    await page.unrouteAll({ behavior: 'ignoreErrors' });

});