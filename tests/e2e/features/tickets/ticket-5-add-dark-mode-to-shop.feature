@ticket-5
Feature: Dark appearance
  As a Prep Shop shopper
  I want the shop to follow my device's appearance preference
  So that I can browse comfortably in dark mode

  # AC1 – high risk. Technique: decision table, checking the dark appearance and its interactive controls.
  @AC1 @risk-high
  Scenario: The shop uses a dark appearance when my device prefers dark
    Given my device prefers dark appearance
    When I open the shop
    Then the shop uses its dark appearance

  # AC1 – high risk. Technique: decision table, checking a secondary basket control in dark appearance.
  @AC1 @risk-high
  Scenario: Secondary basket controls remain readable in dark appearance
    Given my device prefers dark appearance
    And my basket contains 1 "Canned Optimism"
    When I open my basket
    Then secondary basket controls remain readable

  # AC2 – high risk. Technique: use case, checking the light appearance while completing a basket journey.
  @AC2 @risk-high
  Scenario: The shop keeps its light appearance and shopping still works
    Given my device prefers light appearance
    And my basket is empty
    When I add "Canned Optimism" to my basket
    And I open my basket
    Then the shop keeps its original light appearance and shows a "$7.77" total
