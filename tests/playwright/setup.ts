import { test as base } from '@playwright/test';
import { waitForPageLoad } from './utils/test-helpers';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto('/');
    
    await waitForPageLoad(page);
    
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    await page.waitForSelector('#root', { timeout: 10000 });
    
    await use(page);
  },
});

export { expect } from '@playwright/test';
