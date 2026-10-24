@baseline
Feature: Checkout
  As a prepper
  I want to place my order with as little effort as possible
  So that I am ready before doomsday arrives

  # Risk: a broken checkout means no order at all (impact high, likelihood medium).
  @risk-high
  Scenario: Placing an order with only the required details
    Given my basket contains 1 "Canned Optimism"
    When I go to the checkout page
    And I fill in "Name" with "Sakura Prepper"
    And I fill in "Address line 1" with "1 Bunker Lane"
    And I submit my order
    Then I see the message "Thank you for your order"
    And the basket icon shows 0 items

  # Technique: equivalence partitioning - each required field is left empty on its own.
  # "Address line 2" is optional; leaving it empty is covered by the scenario above.
  @risk-high
  Scenario Outline: An order is not placed when "<missing field>" is empty
    Given my basket contains 1 "Canned Optimism"
    When I go to the checkout page
    And I fill in "<filled field>" with "<value>"
    And I submit my order
    Then the order is not placed
    And I am asked to fill in "<missing field>"

    Examples:
      | missing field  | filled field   | value          |
      | Name           | Address line 1 | 1 Bunker Lane  |
      | Address line 1 | Name           | Sakura Prepper |

  @risk-medium
  Scenario: Checkout is not possible with an empty basket
    Given my basket is empty
    When I go to the checkout page
    Then I see the message "Basket is Currently Empty"
    And I do not see the order form
