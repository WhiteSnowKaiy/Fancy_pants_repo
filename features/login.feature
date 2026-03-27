Feature: Login

  Scenario: Successful login
    Given I am on the login page
    When I login with "standard_user" and "secret_sauce"
    Then the inventory page should be loaded

  Scenario Outline: Failed login
    Given I am on the login page
    When I login with <username> and <password>
    Then I should see a flash message saying <message>

    Examples:
      | username         | password | message |
      |                  |          | Epic sadface: Username is required |
      | standard_user    |          | Epic sadface: Password is required |
      | nonexistent_user | foobar   | Epic sadface: Username and password do not match any user in this service |
