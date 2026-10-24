@baseline
Feature: Shopping basket
  As a prepper
  I want to collect products in my basket
  So that I know what I am buying and what it will cost

  # Risk: wrong counts or totals lead to wrong orders and lost trust (impact high, likelihood medium).
  @risk-high
  Scenario: The basket shows the right products, count and total
    Given my basket is empty
    When I add "Dehydrated Water" to my basket 2 times
    And I add "Tinfoil Thinking Cap" to my basket
    Then the basket icon shows 3 items
    When I open my basket
    Then I see "Dehydrated Water" with quantity 2 for "$39.98"
    And I see "Tinfoil Thinking Cap" with quantity 1 for "$12.50"
    And the basket total is "$52.48"

  # Technique: boundary value analysis on the maximum of 99 per product.
  # The lower boundary (0 -> 1) is already covered by the scenario above.
  @risk-medium
  Scenario Outline: Adding one more when the basket already holds <before> (maximum is 99)
    Given my basket contains <before> "Canned Optimism"
    When I add "Canned Optimism" to my basket
    Then the basket icon shows <after> items

    Examples:
      | before | after |
      | 98     | 99    |
      | 99     | 99    |

  @risk-medium
  Scenario: Removing one product keeps the rest of the basket
    Given my basket contains:
      | product          | quantity |
      | Dehydrated Water | 1        |
      | Canned Optimism  | 2        |
    When I open my basket
    And I remove "Dehydrated Water" from my basket
    Then I no longer see "Dehydrated Water" in my basket
    And the basket total is "$15.54"
    And the basket icon shows 2 items

  @risk-medium
  Scenario: Clearing the basket empties it and blocks checkout
    Given my basket contains 1 "Tinfoil Thinking Cap"
    When I open my basket
    And I clear all products
    Then I see the message "Basket is Currently Empty"
    And I cannot proceed to checkout
    And the basket icon shows 0 items
