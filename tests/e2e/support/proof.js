// Screenshot proof for E2E scenarios. Every `Then` step calls `captureProof` with the element that shows the
// verified behaviour. The helper guarantees the screenshot actually shows that element:
//   1. scrolls it into view,
//   2. asserts it is inside the viewport (fully, or as much as fits when it is taller than the viewport),
//   3. asserts it is not covered by another element (e.g. a sticky header or overlay),
//   4. outlines it, takes a viewport screenshot and attaches it as "proof: <description>".
// The test-report script copies these attachments into docs/tickets/<id>/proof/ and embeds them in report.html.
import { unlink } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const OUTLINE = '4px solid #ff00aa';

export async function captureProof(page, locator, description) {
  const target = locator.first();
  await target.scrollIntoViewIfNeeded();

  const viewport = page.viewportSize();
  const box = await target.boundingBox();
  if (!box || box.width === 0 || box.height === 0) {
    throw new Error(`Proof "${description}": the element has no visible size, so it cannot prove anything. Pick a visible element.`);
  }
  const ratio = Math.min(1, viewport.height / box.height, viewport.width / box.width) * 0.95;
  await expect(target, `Proof "${description}" must be visible in the viewport`).toBeInViewport({ ratio });

  const uncovered = await target.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const top = Math.max(rect.top, 0);
    const bottom = Math.min(rect.bottom, window.innerHeight);
    const x = rect.left + rect.width / 2;
    const y = top + (bottom - top) / 2;
    const hit = document.elementFromPoint(x, y);
    return Boolean(hit) && (element.contains(hit) || hit.contains(element));
  });
  expect(uncovered, `Proof "${description}" must not be covered by another element`).toBe(true);

  const previous = await target.evaluate((element, outline) => {
    const old = { outline: element.style.outline, offset: element.style.outlineOffset };
    element.style.outline = outline;
    element.style.outlineOffset = '2px';
    return old;
  }, OUTLINE);
  const info = test.info();
  const index = info.attachments.filter((a) => a.name.startsWith('proof: ')).length + 1;
  const path = info.outputPath(`proof-${String(index).padStart(2, '0')}.png`);
  await page.screenshot({ path, animations: 'disabled', caret: 'hide' });
  await target.evaluate((element, old) => {
    element.style.outline = old.outline;
    element.style.outlineOffset = old.offset;
  }, previous);

  // attach() copies the file into the attachments folder; the JSON results reference that copy by path.
  await info.attach(`proof: ${description}`, { path, contentType: 'image/png' });
  await unlink(path);
}
