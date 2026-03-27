import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page.js';

// Navigation
Given(/^I am on the login page$/, async () => {
    await LoginPage.open();
});

// Logged in shortcut
Given(/^I am logged in$/, async () => {
    await LoginPage.open();
    await LoginPage.login('standard_user', 'secret_sauce');
});

// Actions
When(
    /^I login with "([^"]*)" and "([^"]*)"$/,
    async (username: string, password: string) => {
        await LoginPage.login(username, password);
    }
);

// Assertions
Then(
    /^I should see a flash message saying "([^"]*)"$/,
    async (message: string) => {
        await expect(LoginPage.flashAlert).toBeDisplayed();
        await expect(LoginPage.flashAlert).toHaveText(message);
    }
);

Then(/^I should be on the login page$/, async () => {
    await expect(LoginPage.inputUsername).toBeDisplayed();
});
