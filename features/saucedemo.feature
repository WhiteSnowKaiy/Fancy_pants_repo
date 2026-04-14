Feature: SauceDemo E2E

  Scenario: Successful login
    Given I am on the login page
    When I login with "standard_user" and "secret_sauce"
    Then the inventory page should be loaded

  Scenario Outline: Failed login
    Given I am on the login page
    When I login with "<username>" and "<password>"
    Then I should see a flash message saying "<message>"

    Examples:
      | username         | password | message |
      |                  |          | Epic sadface: Username is required |
      | standard_user    |          | Epic sadface: Password is required |
      | nonexistent_user | foobar   | Epic sadface: Username and password do not match any user in this service|

  Scenario: Inventory shows correct number of products
    Given I am logged in
    Then I should see 6 products

  Scenario: Product has correct name and price
    Given I am logged in
    Then I should see a product named "Sauce Labs Backpack"
    And the product "Sauce Labs Backpack" should have price "$29.99"

  Scenario: Sort by name ascending
    Given I am logged in
    When I sort products by "Name (A to Z)"
    Then the products should be sorted by name ascending

  Scenario: Sort by name descending
    Given I am logged in
    When I sort products by "Name (Z to A)"
    Then the products should be sorted by name descending

  Scenario: Sort by price low to high
    Given I am logged in
    When I sort products by "Price (low to high)"
    Then the products should be sorted by price ascending

  Scenario: Sort by price high to low
    Given I am logged in
    When I sort products by "Price (high to low)"
    Then the products should be sorted by price descending

  Scenario: Open burger menu
    Given I am logged in
    When I open the burger menu
    Then the burger menu should be open

  Scenario: Close burger menu
    Given I am logged in
    When I open the burger menu
    And I close the burger menu
    Then the burger menu should be closed

  Scenario: Logout from burger menu
    Given I am logged in
    When I logout via the menu
    Then I should be on the login page

  Scenario: Add item to cart
    Given I am logged in
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show 1

  Scenario: Add multiple items to cart
    Given I am logged in
    When I add "Sauce Labs Backpack" to the cart
    And I add "Sauce Labs Bike Light" to the cart
    Then the cart badge should show 2

  Scenario: Reset app state clears cart
    Given I am logged in
    When I add "Sauce Labs Backpack" to the cart
    And I reset the app state
    Then the cart badge should show 0

  Scenario: Click product opens detail page
    Given I am logged in
    When I click the product "Sauce Labs Backpack"
    Then I should see product detail page for "Sauce Labs Backpack"

  Scenario: Cart page opens
    Given I am logged in
    When I open the cart
    Then I should be on the cart page