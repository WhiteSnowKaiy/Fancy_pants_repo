import { Given, When, Then } from '@wdio/cucumber-framework';
import { $, browser, expect } from '@wdio/globals';

import loginPage from '../pages/login.page.js';
import inventoryPage from '../pages/inventory.page.js';


// ─────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────

Given('I am on the login page', async () => {
    await loginPage.open();
});

When(
    'I login with {string} and {string}',
    async (username: string, password: string) => {
        await loginPage.login(username, password);
    }
);

Then('the inventory page should be loaded', async () => {
    await inventoryPage.waitForPageLoad();
    expect(await inventoryPage.isLoaded()).toBeTruthy();
});

Then(
    'I should see a flash message saying {string}',
    async (message: string) => {
        const error = await loginPage.flashAlert.getText();
        expect(error).toEqual(message);
    }
);

// ─────────────────────────────────────────────────────────────
// SHARED LOGIN STATE
// ─────────────────────────────────────────────────────────────

Given('I am logged in', async () => {
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.waitForPageLoad();
});

// ─────────────────────────────────────────────────────────────
// INVENTORY
// ─────────────────────────────────────────────────────────────

Then('I should see {int} products', async (count: number) => {
    const items = await inventoryPage.inventoryItems;
    expect(items.length).toEqual(count);
});

Then('I should see a product named {string}', async (name: string) => {
    const names = await inventoryPage.getItemNames();
    expect(names).toContain(name);
});

Then(
    'the product {string} should have price {string}',
    async (name: string, price: string) => {
        const item = await inventoryPage.getItemByName(name);
        const actualPrice = await item
            .$('[data-test="inventory-item-price"]')
            .getText();

        expect(actualPrice).toEqual(price);
    }
);

// ─────────────────────────────────────────────────────────────
// SORTING
// ─────────────────────────────────────────────────────────────

When('I sort products by {string}', async (option: string) => {
    const map: Record<string, any> = {
        'Name (A to Z)': 'az',
        'Name (Z to A)': 'za',
        'Price (low to high)': 'lohi',
        'Price (high to low)': 'hilo',
    };

    await inventoryPage.sortProducts(map[option]);
});

Then('the products should be sorted by name ascending', async () => {
    const names = await inventoryPage.getItemNames();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
});

Then('the products should be sorted by name descending', async () => {
    const names = await inventoryPage.getItemNames();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
});

Then('the products should be sorted by price ascending', async () => {
    const prices = await inventoryPage.getItemPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
});

Then('the products should be sorted by price descending', async () => {
    const prices = await inventoryPage.getItemPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
});

// ─────────────────────────────────────────────────────────────
// BURGER MENU
// ─────────────────────────────────────────────────────────────

When('I open the burger menu', async () => {
    await inventoryPage.openBurgerMenu();
});

When('I close the burger menu', async () => {
    await inventoryPage.closeBurgerMenu();
});

Then('the burger menu should be open', async () => {
    expect(await inventoryPage.burgerMenuWrap.isDisplayed()).toBeTruthy;
});

Then('the burger menu should be closed', async () => {
    expect(await inventoryPage.burgerMenuWrap.isDisplayed()).toBeFalsy;
});

When('I logout via the menu', async () => {
    await inventoryPage.logout();
});

Then('I should be on the login page', async () => {
    expect(await loginPage.inputUsername.isDisplayed()).toBeTruthy;
});

// ─────────────────────────────────────────────────────────────
// CART
// ─────────────────────────────────────────────────────────────

When('I add {string} to the cart', async (name: string) => {
    await inventoryPage.addItemToCart(name);
});

Then('the cart badge should show {int}', async (count: number) => {
    const actual = await inventoryPage.getShoppingCartCount();
    expect(actual).toEqual(count);
});

When('I reset the app state', async () => {
    await inventoryPage.resetAppState();
});

// ─────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────

When('I click the product {string}', async (name: string) => {
    await inventoryPage.clickItemTitle(name);
});

Then(
    'I should see product detail page for {string}',
    async (name: string) => {
        const title = await $('[data-test="inventory-item-name"]').getText();
        expect(title).toEqual(name);
    }
);

When('I open the cart', async () => {
    await inventoryPage.clickShoppingCart();
});

Then('I should be on the cart page', async () => {
    const url = await browser.getUrl();
    expect(url).toContain('cart');
});

// Cart actions
When(/^I add "([^"]*)" to the cart$/, async (name: string) => {
    await inventoryPage.addItemToCart(name);
});

Then(/^the cart badge should show (\d+)$/, async (count: string) => {
    const actual = await inventoryPage.getShoppingCartCount();
    expect(actual).toBe(parseInt(count, 10));
});

// Product navigation
When(/^I click the product "([^"]*)"$/, async (name: string) => {
    await inventoryPage.clickItemTitle(name);
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
    await inventoryPage.clickShoppingCart();
});

Then(/^I should be on the cart page$/, async () => {
    await expect($('.cart_list')).toBeDisplayed();
});

// Navigation
Given(/^I am on the login page$/, async () => {
    await loginPage.open();
});

// Logged in shortcut
Given(/^I am logged in$/, async () => {
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
});

// Actions
When(
    /^I login with "([^"]*)" and "([^"]*)"$/,
    async (username: string, password: string) => {
        await loginPage.login(username, password);
    }
);

// Assertions
Then(
    /^I should see a flash message saying "([^"]*)"$/,
    async (message: string) => {
        await expect(loginPage.flashAlert).toBeDisplayed();
        await expect(loginPage.flashAlert).toHaveText(message);
    }
);

Then(/^I should be on the login page$/, async () => {
    await expect(loginPage.inputUsername).toBeDisplayed();
});
