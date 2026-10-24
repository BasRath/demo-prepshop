#!/usr/bin/env node
// Generates a deterministic Markdown test report for a ticket.
//
// Usage:
//   node .github/skills/test-report/scripts/generate-report.mjs --ticket <id>
//        [--dir docs/tickets/<id>] [--results test-results/e2e-results.json] [--out <dir>/report.md]
//
// Inputs (all in --dir unless stated otherwise):
//   ticket.json        snapshot written by refine-ticket/scripts/fetch-ticket.mjs
//   requirements.json  refined acceptance criteria, decisions and risks (refine-ticket + write-e2e-tests)
//   exploratory.json   exploratory sessions and findings (exploratory-testing)
//   --results          Playwright JSON reporter output (npm run test:e2e)
//
// Determinism: the same inputs always produce a byte-identical report. The report contains no
// timestamps, durations, worker ids or random values, every list is sorted on a stable key and
// every section is always present (with an explicit "None" when empty).
import { readFile, writeFile, access } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';

// ---------- arguments ----------
const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, value, index, all) => {
    if (value.startsWith('--')) pairs.push([value.slice(2), all[index + 1]]);
    return pairs;
  }, [])
);
const fail = (message) => {
  console.error(`generate-report: ${message}`);
  process.exit(1);
};
if (!/^\d+$/.test(String(args.ticket ?? ''))) fail('missing or invalid --ticket <number>.');
const ticketId = Number(args.ticket);
const dir = args.dir ?? join('docs', 'tickets', String(ticketId));
const resultsPath = args.results ?? join('test-results', 'e2e-results.json');
const outPath = args.out ?? join(dir, 'report.md');

// ---------- constants ----------
const SEVERITIES = ['critical', 'high', 'medium', 'low'];
const RISK_LEVELS = ['high', 'medium', 'low'];
const FINDING_STATUSES = ['open', 'fixed', 'accepted'];
const SESSION_STATUSES = ['completed', 'blocked'];
const ICON = {
  Passed: '✅ Passed',
  'Passed with issues': '⚠️ Passed with issues',
  Failed: '❌ Failed',
  'Not covered': '⏸️ Not covered',
  passed: '✅ passed',
  failed: '❌ failed',
  flaky: '⚠️ flaky',
  skipped: '⏭️ skipped'
};
const VERDICT = {
  PASSED: '✅ PASSED',
  'PASSED WITH ISSUES': '⚠️ PASSED WITH ISSUES',
  FAILED: '❌ FAILED',
  INCOMPLETE: '⏸️ INCOMPLETE'
};

// ---------- helpers ----------
const exists = (path) => access(path).then(() => true, () => false);
const readJson = async (path, label) => {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    fail(`cannot read ${label} at ${path}: ${error.message}`);
  }
};
const cell = (value) => String(value ?? '').replace(/\r?\n/g, ' ').replace(/\|/g, '\\|').trim() || '–';
const row = (values) => `| ${values.map(cell).join(' | ')} |`;
const table = (headers, rows) =>
  rows.length === 0
    ? '_None._'
    : [row(headers), row(headers.map(() => '---')), ...rows.map(row)].join('\n');
const byNumericId = (a, b) =>
  String(a.id).localeCompare(String(b.id), 'en', { numeric: true, sensitivity: 'base' });
const stripAnsi = (text) => String(text ?? '').replace(/\u001b\[[0-9;]*m/g, '');
const firstLine = (text) => stripAnsi(text).split('\n').map((l) => l.trim()).find(Boolean) ?? '';
const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;
const linkTo = (path) => `[${path}](${relative(dirname(outPath), path).split('\\').join('/')})`;

// ---------- load and validate ----------
const ticket = await readJson(join(dir, 'ticket.json'), 'ticket snapshot');
const requirements = await readJson(join(dir, 'requirements.json'), 'requirements');
const hasExploratory = await exists(join(dir, 'exploratory.json'));
const exploratory = hasExploratory
  ? await readJson(join(dir, 'exploratory.json'), 'exploratory log')
  : { sessions: [], findings: [] };
const hasResults = await exists(resultsPath);
const results = hasResults ? await readJson(resultsPath, 'Playwright JSON results') : null;

const problems = [];
const acs = [...(requirements.acceptanceCriteria ?? [])].sort(byNumericId);
const decisions = [...(requirements.decisions ?? [])].sort(byNumericId);
const sessions = [...(exploratory.sessions ?? [])].sort(byNumericId);
const findings = [...(exploratory.findings ?? [])].sort(
  (a, b) => SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity) || byNumericId(a, b)
);
const acIds = new Set(acs.map((ac) => ac.id));

if (ticket.id !== ticketId) problems.push(`ticket.json id ${ticket.id} does not match --ticket ${ticketId}.`);
if (acs.length === 0) problems.push('requirements.json has no acceptanceCriteria.');
for (const ac of acs) {
  if (!/^AC\d+$/.test(ac.id ?? '')) problems.push(`acceptance criterion id "${ac.id}" must look like AC1.`);
  if (!ac.refined) problems.push(`${ac.id}: "refined" is required.`);
  if (!RISK_LEVELS.includes(ac.risk?.level)) problems.push(`${ac.id}: risk.level must be one of ${RISK_LEVELS.join('/')}.`);
}
for (const d of decisions) {
  if (!['user', 'derived'].includes(d.source)) problems.push(`${d.id}: decision source must be "user" or "derived".`);
}
for (const s of sessions) {
  if (!SESSION_STATUSES.includes(s.status)) problems.push(`${s.id}: session status must be ${SESSION_STATUSES.join('/')}.`);
  for (const id of s.acceptanceCriteria ?? []) if (!acIds.has(id)) problems.push(`${s.id}: unknown acceptance criterion ${id}.`);
}
for (const f of findings) {
  if (!SEVERITIES.includes(f.severity)) problems.push(`${f.id}: severity must be ${SEVERITIES.join('/')}.`);
  if (!FINDING_STATUSES.includes(f.status)) problems.push(`${f.id}: status must be ${FINDING_STATUSES.join('/')}.`);
  if (f.acceptanceCriterion && !acIds.has(f.acceptanceCriterion)) problems.push(`${f.id}: unknown acceptance criterion ${f.acceptanceCriterion}.`);
}
if (problems.length) fail(`invalid input:\n  - ${problems.join('\n  - ')}`);

// ---------- automated results ----------
function collectSpecs(suite, featureFile, featureTitle, path, out) {
  for (const spec of suite.specs ?? []) {
    const statuses = (spec.tests ?? []).map((t) => t.status);
    const status = statuses.includes('unexpected')
      ? 'failed'
      : statuses.includes('flaky')
        ? 'flaky'
        : statuses.length && statuses.every((s) => s === 'skipped')
          ? 'skipped'
          : 'passed';
    const error = (spec.tests ?? [])
      .flatMap((t) => t.results ?? [])
      .flatMap((r) => r.errors ?? [])
      .map((e) => firstLine(e.message))
      .find(Boolean);
    const title = /^Example #\d+$/.test(spec.title) ? [...path, spec.title].join(' › ') : spec.title;
    out.push({
      feature: featureFile,
      featureTitle,
      title,
      line: spec.line,
      tags: (spec.tags ?? []).map((t) => t.replace(/^@/, '')),
      status,
      error: error ? error.slice(0, 300) : ''
    });
  }
  for (const child of suite.suites ?? []) {
    collectSpecs(child, featureFile, featureTitle ?? child.title, featureTitle ? [...path, child.title] : path, out);
  }
}

const specs = [];
for (const fileSuite of results?.suites ?? []) {
  const featureFile = `tests/e2e/features/${fileSuite.file.replace(/^.*?features\//, '').replace(/\.spec\.[cm]?js$/, '')}`;
  collectSpecs(fileSuite, featureFile, undefined, [], specs);
}
specs.sort((a, b) => a.feature.localeCompare(b.feature) || a.line - b.line || a.title.localeCompare(b.title));

const ticketTag = `ticket-${ticketId}`;
const ticketSpecs = specs.filter((s) => s.tags.includes(ticketTag));
const regressionSpecs = specs.filter((s) => !s.tags.includes(ticketTag));
const acTags = (spec) => spec.tags.filter((t) => /^AC\d+$/.test(t)).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
const riskTag = (spec) => spec.tags.find((t) => t.startsWith('risk-'))?.replace('risk-', '') ?? '';
const count = (list, status) => list.filter((s) => s.status === status).length;

// ---------- acceptance criteria status ----------
const isOpen = (f) => f.status === 'open';
const isBlocking = (f) => isOpen(f) && ['critical', 'high'].includes(f.severity);
const acRows = acs.map((ac) => {
  const linkedSpecs = ticketSpecs.filter((s) => acTags(s).includes(ac.id));
  const linkedSessions = sessions.filter((s) => (s.acceptanceCriteria ?? []).includes(ac.id));
  const linkedFindings = findings.filter((f) => f.acceptanceCriterion === ac.id);
  let status;
  if (linkedSpecs.some((s) => s.status === 'failed') || linkedFindings.some(isBlocking)) status = 'Failed';
  else if (linkedSpecs.length === 0 && !linkedSessions.some((s) => s.status === 'completed')) status = 'Not covered';
  else if (linkedFindings.some(isOpen) || linkedSpecs.some((s) => s.status === 'flaky')) status = 'Passed with issues';
  else status = 'Passed';
  return { ac, linkedSpecs, linkedSessions, linkedFindings, status };
});

// ---------- verdict ----------
const reasons = [];
const failedSpecs = specs.filter((s) => s.status === 'failed');
if (failedSpecs.length) reasons.push(`${plural(failedSpecs.length, 'automated scenario')} failed.`);
const blocking = findings.filter(isBlocking);
if (blocking.length) reasons.push(`${plural(blocking.length, 'open critical/high finding')}.`);
const failedAcs = acRows.filter((r) => r.status === 'Failed');
if (failedAcs.length) reasons.push(`Acceptance criteria failed: ${failedAcs.map((r) => r.ac.id).join(', ')}.`);
const incompleteReasons = [];
if (!hasResults) incompleteReasons.push(`No automated results found at ${resultsPath}.`);
if (!hasExploratory) incompleteReasons.push('No exploratory testing log (exploratory.json) found.');
const uncovered = acRows.filter((r) => r.status === 'Not covered');
if (uncovered.length) incompleteReasons.push(`Acceptance criteria not covered: ${uncovered.map((r) => r.ac.id).join(', ')}.`);
const blockedSessions = sessions.filter((s) => s.status === 'blocked');
if (blockedSessions.length) incompleteReasons.push(`Blocked sessions: ${blockedSessions.map((s) => s.id).join(', ')}.`);
const openMinor = findings.filter((f) => isOpen(f) && !isBlocking(f));
const flaky = specs.filter((s) => s.status === 'flaky');

let verdict;
if (reasons.length) verdict = 'FAILED';
else if (incompleteReasons.length) verdict = 'INCOMPLETE';
else if (openMinor.length || flaky.length) {
  verdict = 'PASSED WITH ISSUES';
  if (openMinor.length) reasons.push(`${plural(openMinor.length, 'open medium/low finding')}.`);
  if (flaky.length) reasons.push(`${plural(flaky.length, 'flaky scenario')}.`);
} else {
  verdict = 'PASSED';
  reasons.push('All acceptance criteria passed, all automated scenarios passed and no findings are open.');
}
const verdictReasons = verdict === 'INCOMPLETE' ? incompleteReasons : [...reasons, ...incompleteReasons];

// ---------- render ----------
const out = [];
const section = (title) => out.push('', `## ${title}`, '');

out.push(`# Test report – Ticket #${ticket.id}: ${ticket.title}`, '');
out.push(table(['Item', 'Value'], [
  ['Ticket', `[#${ticket.id}](${ticket.url})`],
  ['Ticket status', ticket.status],
  ['Ticket last updated', ticket.updatedAt],
  ['Verdict', `**${VERDICT[verdict]}**`]
]));

section('1. Summary');
out.push(...verdictReasons.map((r) => `- ${r}`), '');
out.push(table(['Area', 'Passed', 'Passed with issues', 'Failed', 'Not covered / skipped', 'Total'], [
  ['Acceptance criteria', ...['Passed', 'Passed with issues', 'Failed', 'Not covered'].map((s) => acRows.filter((r) => r.status === s).length), acRows.length],
  ['Automated scenarios – this ticket', count(ticketSpecs, 'passed'), count(ticketSpecs, 'flaky'), count(ticketSpecs, 'failed'), count(ticketSpecs, 'skipped'), ticketSpecs.length],
  ['Automated scenarios – regression', count(regressionSpecs, 'passed'), count(regressionSpecs, 'flaky'), count(regressionSpecs, 'failed'), count(regressionSpecs, 'skipped'), regressionSpecs.length],
  ['Exploratory sessions', sessions.filter((s) => s.status === 'completed').length, 0, 0, blockedSessions.length, sessions.length]
]));
out.push('');
out.push(table(['Findings', ...SEVERITIES], [
  ['Open', ...SEVERITIES.map((sev) => findings.filter((f) => isOpen(f) && f.severity === sev).length)],
  ['Fixed', ...SEVERITIES.map((sev) => findings.filter((f) => f.status === 'fixed' && f.severity === sev).length)],
  ['Accepted', ...SEVERITIES.map((sev) => findings.filter((f) => f.status === 'accepted' && f.severity === sev).length)]
]));

section('2. Goal and scope');
out.push(`**Goal:** ${requirements.summary ?? '–'}`, '');
out.push('**Affected areas:**', '');
out.push(...([...(requirements.affectedAreas ?? [])].sort().map((a) => `- ${a}`)), ...((requirements.affectedAreas ?? []).length ? [] : ['- None listed.']), '');
out.push('**Out of scope:**', '');
out.push(...((requirements.outOfScope ?? []).map((a) => `- ${a}`)), ...((requirements.outOfScope ?? []).length ? [] : ['- Nothing explicitly excluded.']));

section('3. Clarifications and decisions');
out.push(table(['ID', 'Topic', 'Decision', 'Source', 'Evidence'], decisions.map((d) => [
  d.id, d.topic, d.decision, d.source === 'user' ? '🙋 Asked' : '🔎 Derived', d.evidence
])));

section('4. Acceptance criteria');
out.push(table(['AC', 'Criterion', 'Risk', 'Automated', 'Exploratory', 'Findings', 'Status'], acRows.map((r) => [
  r.ac.id,
  r.ac.refined,
  r.ac.risk.level,
  r.linkedSpecs.length ? `${count(r.linkedSpecs, 'passed')}/${r.linkedSpecs.length} passed` : (r.ac.testApproach?.automated === false ? 'Not automated (see 9)' : 'None'),
  r.linkedSessions.map((s) => s.id).join(', ') || 'None',
  r.linkedFindings.map((f) => `${f.id} (${f.status})`).join(', ') || 'None',
  ICON[r.status]
])));

section('5. Automated scenarios – this ticket');
out.push(table(['#', 'Feature', 'Scenario', 'AC', 'Risk', 'Result'], ticketSpecs.map((s, i) => [
  i + 1, s.featureTitle, s.title, acTags(s).join(', '), riskTag(s), ICON[s.status]
])));
const ticketFailures = ticketSpecs.filter((s) => s.status !== 'passed' && s.error);
if (ticketFailures.length) {
  out.push('', '**Failure details:**', '');
  out.push(...ticketFailures.map((s) => `- _${s.title}_ (${s.feature}): \`${s.error}\``));
}

section('6. Regression – existing scenarios');
const features = [...new Set(regressionSpecs.map((s) => s.feature))];
out.push(table(['Feature file', 'Passed', 'Failed', 'Flaky', 'Skipped'], features.map((f) => {
  const list = regressionSpecs.filter((s) => s.feature === f);
  return [f, count(list, 'passed'), count(list, 'failed'), count(list, 'flaky'), count(list, 'skipped')];
})));
const regressionFailures = regressionSpecs.filter((s) => s.status === 'failed' || s.status === 'flaky');
if (regressionFailures.length) {
  out.push('', '**Regressions:**', '');
  out.push(...regressionFailures.map((s) => `- ${ICON[s.status]} _${s.featureTitle} › ${s.title}_: \`${s.error || 'no error message'}\``));
}

section('7. Exploratory testing sessions');
if (sessions.length === 0) out.push('_None._');
for (const s of sessions) {
  out.push(`### ${s.id} – ${s.charter}`, '');
  out.push(table(['Field', 'Value'], [
    ['Status', s.status === 'completed' ? '✅ completed' : '⏸️ blocked'],
    ['Acceptance criteria', (s.acceptanceCriteria ?? []).join(', ')],
    ['Heuristics', (s.heuristics ?? []).join(', ')],
    ['Environments', (s.environments ?? []).join(', ')],
    ['Findings', findings.filter((f) => f.session === s.id).map((f) => f.id).join(', ') || 'None']
  ]));
  out.push('', '**Notes:**', '');
  out.push(...((s.notes ?? []).map((n) => `- ${n}`)), ...((s.notes ?? []).length ? [] : ['- None.']));
  out.push('', '**Evidence:**', '');
  const evidence = [...(s.evidence ?? [])].sort();
  out.push(...evidence.map((e) => `- ${linkTo(join(dir, e))}`), ...(evidence.length ? [] : ['- None.']), '');
}
if (sessions.length) out.pop();

section('8. Findings');
out.push(table(['ID', 'Severity', 'Status', 'AC', 'Session', 'Title'], findings.map((f) => [
  f.id, f.severity, f.status, f.acceptanceCriterion, f.session, f.title
])));
for (const f of findings) {
  out.push('', `### ${f.id} – ${f.title}`, '');
  out.push('**Steps to reproduce:**', '');
  out.push(...((f.steps ?? []).map((step, i) => `${i + 1}. ${step}`)));
  out.push('', `**Expected:** ${f.expected ?? '–'}`, '', `**Actual:** ${f.actual ?? '–'}`);
  if (f.resolution) out.push('', `**Resolution:** ${f.resolution}`);
  if ((f.evidence ?? []).length) out.push('', `**Evidence:** ${[...f.evidence].sort().map((e) => linkTo(join(dir, e))).join(', ')}`);
}

section('9. Residual risks');
const residual = [
  ...acs.filter((ac) => ac.testApproach?.automated === false).map((ac) => `${ac.id} (${ac.risk.level} risk) is not automated: ${ac.testApproach.reason ?? 'no reason given'}`),
  ...findings.filter(isOpen).map((f) => `${f.id} (${f.severity}) is still open: ${f.title}`),
  ...findings.filter((f) => f.status === 'accepted').map((f) => `${f.id} (${f.severity}) was accepted: ${f.resolution ?? f.title}`),
  ...((exploratory.notExplored ?? []).map((n) => `Not explored: ${n}`))
];
out.push(...(residual.length ? residual.map((r) => `- ${r}`) : ['- None identified.']));

section('10. Artifacts');
const artifacts = [
  join(dir, 'ticket.json'),
  join(dir, 'requirements.json'),
  join(dir, 'exploratory.json'),
  ...[...new Set(ticketSpecs.map((s) => s.feature))]
];
out.push(...artifacts.map((a) => `- ${linkTo(a)}`));

out.push('', '---', '', '_Generated by `.github/skills/test-report/scripts/generate-report.mjs`. Do not edit by hand; re-run the script instead._', '');

await writeFile(outPath, out.join('\n'));
console.log(`Report written to ${outPath} – verdict: ${verdict}`);
