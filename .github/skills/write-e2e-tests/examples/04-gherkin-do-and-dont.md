# Example – Gherkin do and don't

## Imperative and technical ❌

```gherkin
Scenario: Test carousel
  Given I navigate to "http://localhost:8000/index.html"
  And I set the viewport to 1024x768
  When I wait 10000 ms
  Then the element ".story-card:nth-child(1)" has text "The Kraken's Bath Day"
  And localStorage "carousel-index" equals "1"
```

Problems: URL, selector, storage key and milliseconds; title says nothing about expected behaviour; a tester cannot
judge whether it is right; checking storage tests implementation, not experience.

## Declarative, shopper language ✅

```gherkin
# AC4 - high risk. State transition with a time boundary.
@AC4 @risk-high
Scenario: The stories move on by one after 10 seconds
  Given I am using a screen that is 1024 pixels wide
  And I open the shop
  And the story cards show "Ragnarök", "The Kraken's Bath Day" and "The Mind-Ray Mothership"
  When 9 seconds pass
  Then the first story card is still "Ragnarök"
  When 1 more second passes
  Then the story cards show "The Kraken's Bath Day", "The Mind-Ray Mothership" and "The Great Calendar Reset"
```

---

## Copy-paste scenarios ❌

```gherkin
Scenario: 719 pixels
  Given I am using a screen that is 719 pixels wide
  ...
Scenario: 720 pixels
  Given I am using a screen that is 720 pixels wide
  ...
Scenario: 1200 pixels        # adds nothing: same partition as 1024
  ...
```

## One outline with only boundary values ✅

```gherkin
Scenario Outline: Number of story cards on a <width> pixel wide screen is <cards>
  Given I am using a screen that is <width> pixels wide
  When I open the shop
  Then I see <cards> story cards in the header

  Examples:
    | width | cards |
    | 719   | 0     |
    | 720   | 1     |
```

---

## Overlapping scenarios ❌

```gherkin
Scenario: Story cards are links          # fails together with "Opening a story from its card"
Scenario: Adding a product still works with story cards   # already covered by the baseline suite
```

## Unique scenarios ✅

Each remaining scenario can fail for a reason no other scenario fails for. Header-wide regressions are left to the
baseline suite and an exploratory regression charter.

---

## Vague data ❌ → concrete data ✅

```gherkin
Then the total is correct                          # ❌ correct according to whom?
Then the basket total is "$52.48"                  # ✅
```
