import Page from "./page.js";

type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

interface InventoryItem {
    name: string;
    description: string;
    price: string;
    element: WebdriverIO.Element;
}

class InventoryPage extends Page {
    // ── Header ────────────────────────────────────────────────────────────────

    get headerContainer() {
        return $('[data-test="header-container"]');
    }

    get primaryHeader() {
        return $('[data-test="primary-header"]');
    }

    get appLogo() {
        return $('.app_logo');
    }

    // ── Burger Menu ───────────────────────────────────────────────────────────

    get burgerMenuButton() {
        return $('#react-burger-menu-btn');
    }

    get burgerMenuCloseButton() {
        return $('#react-burger-cross-btn');
    }

    get burgerMenuWrap() {
        return $('.bm-menu-wrap');
    }

    get allItemsLink() {
        return $('[data-test="inventory-sidebar-link"]');
    }

    get aboutLink() {
        return $('[data-test="about-sidebar-link"]');
    }

    get logoutLink() {
        return $('[data-test="logout-sidebar-link"]');
    }

    get resetAppStateLink() {
        return $('[data-test="reset-sidebar-link"]');
    }

    // ── Shopping Cart ─────────────────────────────────────────────────────────

    get shoppingCartContainer() {
        return $('#shopping_cart_container');
    }

    get shoppingCartLink() {
        return $('[data-test="shopping-cart-link"]');
    }

    async getShoppingCartCount(): Promise<number> {
        const badge = await this.shoppingCartLink.$('.shopping_cart_badge');
        if (!(await badge.isExisting())) return 0;
        return parseInt(await badge.getText(), 10);
    }

    // ── Secondary Header / Sort ───────────────────────────────────────────────

    get secondaryHeader() {
        return $('[data-test="secondary-header"]');
    }

    get pageTitle() {
        return $('[data-test="title"]');
    }

    get activeOption() {
        return $('[data-test="active-option"]');
    }

    get productSortContainer() {
        return $('[data-test="product-sort-container"]');
    }

    // ── Inventory ─────────────────────────────────────────────────────────────

    get inventoryContainer() {
        return $('[data-test="inventory-container"]');
    }

    get inventoryList() {
        return $('[data-test="inventory-list"]');
    }

    get inventoryItems() {
        return $$('[data-test="inventory-item"]');
    }

    // ── Actions ───────────────────────────────────────────────────────────────

    public open() {
        return super.open('/inventory.html');
    }

    async openBurgerMenu(): Promise<void> {
        await this.burgerMenuButton.click();
        await this.burgerMenuWrap.waitForDisplayed({ timeout: 3000 });
    }

    async closeBurgerMenu(): Promise<void> {
        await this.burgerMenuCloseButton.click();
        await this.burgerMenuWrap.waitForDisplayed({ timeout: 3000, reverse: true });
    }

    async logout(): Promise<void> {
        await this.openBurgerMenu();
        await this.logoutLink.click();
    }

    async resetAppState(): Promise<void> {
        await this.openBurgerMenu();
        await this.resetAppStateLink.click();
    }

    async sortProducts(option: SortOption): Promise<void> {
        await this.productSortContainer.selectByAttribute('value', option);
    }

    async clickShoppingCart(): Promise<void> {
        await this.shoppingCartLink.click();
    }

    // ── Item helpers ──────────────────────────────────────────────────────────

    /**
     * Returns the inventory item element whose name matches the given text.
     */
    async getItemByName(name: string): Promise<WebdriverIO.Element> {
        const items = await this.inventoryItems;
        for (const item of items) {
            const itemName = await item.$('[data-test="inventory-item-name"]').getText();
            if (itemName === name) return item;
        }
        throw new Error(`Inventory item "${name}" not found`);
    }

    /**
     * Clicks the "Add to cart" button for the named item.
     */
    async addItemToCart(name: string): Promise<void> {
        const item = await this.getItemByName(name);
        await item.$('button.btn_inventory').click();
    }

    /**
     * Clicks the product image link for the named item.
     */
    async clickItemImage(name: string): Promise<void> {
        const item = await this.getItemByName(name);
        await item.$('.inventory_item_img a').click();
    }

    /**
     * Clicks the product title link for the named item.
     */
    async clickItemTitle(name: string): Promise<void> {
        const item = await this.getItemByName(name);
        await item.$('[data-test="inventory-item-name"]').click();
    }

    /**
     * Returns a plain object with the name, description, and price of every
     * visible inventory item.
     */
    async getAllItems(): Promise<InventoryItem[]> {
        const items = this.inventoryItems;
        // @ts-ignore
        return Promise.all(
            await items.map(async (el) => ({
                name: await el.$('[data-test="inventory-item-name"]').getText(),
                description: await el.$('[data-test="inventory-item-desc"]').getText(),
                price: await el.$('[data-test="inventory-item-price"]').getText(),
                element: el,
            }))
        );
    }

    /**
     * Returns all visible product names in DOM order.
     */
    async getItemNames(): Promise<string[]> {
        const items = await this.getAllItems();
        return items.map((i) => i.name);
    }

    /**
     * Returns all visible product prices as numeric values.
     */
    async getItemPrices(): Promise<number[]> {
        const items = await this.getAllItems();
        return items.map((i) => parseFloat(i.price.replace('$', '')));
    }

    // ── Assertions ────────────────────────────────────────────────────────────

    async waitForPageLoad(): Promise<void> {
        await this.inventoryContainer.waitForDisplayed({ timeout: 5000 });
    }

    async isLoaded(): Promise<boolean> {
        return (
            (await this.inventoryContainer.isDisplayed()) &&
            (await this.pageTitle.isDisplayed())
        );
    }
}

export default new InventoryPage();