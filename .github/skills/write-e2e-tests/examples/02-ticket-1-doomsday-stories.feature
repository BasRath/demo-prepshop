# Example feature for ticket #1. In a real run this file lives in
# tests/e2e/features/tickets/ticket-1-create-kawaii-doomsday-stories.feature
@ticket-1
Feature: Kawaii doomsday stories
  As a prepper browsing the shop on a larger screen
  I want to discover cute doomsday stories
  So that I know which supplies I might need

  # AC3 - high risk. Boundary value analysis on the agreed widths 720 / 1024 / 1440 (decision D3).
  @AC3 @risk-high
  Scenario Outline: Number of story cards on a <width> pixel wide screen is <cards>
    Given I am using a screen that is <width> pixels wide
    When I open the shop
    Then I see <cards> story cards in the header
    And the story cards do not cover the logo or the basket

    Examples:
      | width | cards |
      | 719   | 0     |
      | 720   | 1     |
      | 1023  | 1     |
      | 1024  | 3     |
      | 1439  | 3     |
      | 1440  | 5     |

  # AC4 - high risk. State transition with a time boundary: 9 seconds (no change) vs 10 seconds (change).
  @AC4 @risk-high
  Scenario: The stories move on by one after 10 seconds
    Given I am using a screen that is 1024 pixels wide
    And I open the shop
    And the story cards show "Ragnarök", "The Kraken's Bath Day" and "The Mind-Ray Mothership"
    When 9 seconds pass
    Then the first story card is still "Ragnarök"
    When 1 more second passes
    Then the story cards show "The Kraken's Bath Day", "The Mind-Ray Mothership" and "The Great Calendar Reset"

  # AC4 - high risk. State transition: paused state ignores time (decision D5).
  @AC4 @risk-high
  Scenario: Pausing the stories keeps them in place
    Given I am using a screen that is 1024 pixels wide
    And I open the shop
    When I pause the stories
    And 30 seconds pass
    Then the first story card is still "Ragnarök"

  # AC4 - medium risk. State transition: with 5 cards there is no next state.
  @AC4 @risk-medium
  Scenario: With room for all five stories nothing moves
    Given I am using a screen that is 1440 pixels wide
    And I open the shop
    When 10 seconds pass
    Then the first story card is still "Ragnarök"

  # AC5 - high risk. Use case, started from the basket page to prove the header is shared (decision D11).
  @AC5 @risk-high
  Scenario: Opening a story from its card
    Given I am using a screen that is 1440 pixels wide
    And I am on the basket page
    When I open the story "The Moon Catches a Cold"
    Then I am reading the story "The Moon Catches a Cold"

  # AC6 - medium risk. Equivalence partitioning: one partition per product.
  @AC6 @risk-medium
  Scenario: Every product is recommended by at least one of the five stories
    Given I am using a screen that is 1440 pixels wide
    When I read all stories
    Then I have read 5 stories
    And the stories recommend:
      | product              |
      | Dehydrated Water     |
      | Tinfoil Thinking Cap |
      | Canned Optimism      |
