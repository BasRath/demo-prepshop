#!/usr/bin/env node
// Fetches a ticket from the scrum board and stores a snapshot in docs/tickets/<id>/ticket.json.
// Usage: node .github/skills/refine-ticket/scripts/fetch-ticket.mjs <ticket-number>
// Accepts "5", "#5" or "ticket-5". Prints the ticket as JSON (plus a branch-friendly slug) to stdout.
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const API = 'https://basic-scrum-board.vercel.app/api/tickets';

function fail(message) {
  console.error(`fetch-ticket: ${message}`);
  process.exit(1);
}

const raw = String(process.argv[2] ?? '').trim();
const match = raw.match(/^(?:#|ticket-)?(\d+)$/i);
if (!match) fail(`"${raw}" is not a valid ticket number. Expected digits only, e.g. 5 or #5.`);
const id = Number(match[1]);

let response;
try {
  response = await fetch(`${API}/${id}`, { headers: { Accept: 'application/json' } });
} catch (error) {
  fail(`could not reach ${API}/${id}: ${error.message}`);
}

const body = await response.json().catch(() => ({}));
if (response.status === 404) fail(`ticket ${id} does not exist (${body.error ?? 'not found'}).`);
if (!response.ok) fail(`board returned HTTP ${response.status}: ${body.error ?? 'unknown error'}.`);

const t = body.ticket;
if (!t || typeof t.title !== 'string' || typeof t.description !== 'string') {
  fail('unexpected response shape; expected { ticket: { id, title, description, status } }.');
}

const slug = t.title
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 40)
  .replace(/-+$/g, '');

// Fixed key order keeps the snapshot diff-friendly and deterministic.
const ticket = {
  id: t.id,
  title: t.title,
  status: t.status,
  slug,
  url: `${API}/${id}`,
  createdAt: t.createdAt,
  updatedAt: t.updatedAt,
  description: t.description.replace(/\r\n/g, '\n').trimEnd()
};

const dir = join('docs', 'tickets', String(id));
await mkdir(dir, { recursive: true });
await writeFile(join(dir, 'ticket.json'), `${JSON.stringify(ticket, null, 2)}\n`);

console.log(JSON.stringify(ticket, null, 2));
