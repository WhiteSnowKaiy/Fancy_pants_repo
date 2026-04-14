import { When, Then } from '@wdio/cucumber-framework';
import { $, expect } from '@wdio/globals';
import InventoryPage from '../pages/inventory.page.js';

// Cart actions
When(/^I add "([^"]*)" to the cart$/, async (name: string) => {
    await InventoryPage.addItemToCart(name);
});

Then(/^the cart badge should show (\d+)$/, async (count: string) => {
    const actual = await InventoryPage.getShoppingCartCount();
    expect(actual).toBe(parseInt(count, 10));
});

// Product navigation
When(/^I click the product "([^"]*)"$/, async (name: string) => {
    await InventoryPage.clickItemTitle(name);
});

Then(
    /^I should see product detail page for "([^"]*)"$/,
    async (name: string) => {
        const title = await $('[data-test="inventory-item-name"]');
        await expect(title).toHaveText(name);
    }
);

// Cart page
When(/^I open the cart$/, async () => {
    await InventoryPage.clickShoppingCart();
});

Then(/^I should be on the cart page$/, async () => {
    await expect($('.cart_list')).toBeDisplayed();
});