/**
 * Refresh src/lib/data/contrib.json from the public profile calendar.
 *
 * No token, no API key: the same fragment GitHub's own profile page fetches
 * (`X-Requested-With: XMLHttpRequest` on /users/<user>/contributions) carries
 * exact per-day counts in its tooltips. The file is baked at CI build time —
 * the client never needs credentials (CORS rules out the GraphQL calendar).
 *
 * Fails loudly on scrape-shape drift; CI keeps this step `continue-on-error`
 * so a GitHub HTML change can never break the deploy — the committed snapshot
 * simply ages one day.
 */
import { writeFile } from 'node:fs/promises';

const USER = process.env.GH_USER ?? 'Olyno';
const OUT = new URL('../src/lib/data/contrib.json', import.meta.url);

const MONTHS = {
	January: 1,
	February: 2,
	March: 3,
	April: 4,
	May: 5,
	June: 6,
	July: 7,
	August: 8,
	September: 9,
	October: 10,
	November: 11,
	December: 12
};

const res = await fetch(`https://github.com/users/${USER}/contributions`, {
	headers: {
		Accept: 'text/html',
		'X-Requested-With': 'XMLHttpRequest',
		'User-Agent': 'olyno.dev portfolio refresh (github.com/Olyno/portfolio)'
	}
});
if (!res.ok) throw new Error(`contributions fragment: HTTP ${res.status}`);
const html = await res.text();

// every day cell: id = contribution-day-component-<row>-<col>, tooltip carries the count
const cell =
	/data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="contribution-day-component-(\d+)-(\d+)"[^>]*data-level="(\d)"[\s\S]{0,500}?<tool-tip[^>]*>\s*([\d,]+|No)\s+contributions?\s+on\s+([A-Z][a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)/g;

const cells = [];
for (const m of html.matchAll(cell)) {
	const [, date, row, col, , count, month, day] = m;
	const mo = MONTHS[month];
	if (!mo) continue;
	const y = Number(date.slice(0, 4));
	const n = count === 'No' ? 0 : Number(count.replace(/,/g, ''));
	cells.push({ row: +row, col: +col, y, mo, d: +day, date, count: n });
}
if (cells.length < 300) {
	throw new Error(`expected ~365 day cells, parsed ${cells.length} — GitHub markup changed?`);
}

// grid year = majority year of the parsed dates
const year = +Object.entries(
	cells.reduce(
		(a, c) => ((a[c.y] = (a[c.y] ?? 0) + 1), a),
		/** @type {Record<string, number>} */ ({})
	)
).sort((a, b) => b[1] - a[1])[0][0];

const inYear = cells.filter((c) => c.y === year);
inYear.sort((a, b) => a.col - b.col || a.row - b.row);

const dates = inYear.map((c) => c.date);
const counts = inYear.map((c) => c.count);
// column-major order (weeks of 7, Sun first) — start = the grid's first cell
const start = dates[0];
const total = counts.reduce((a, b) => a + b, 0);

const out = { year, start, dates, counts };
await writeFile(OUT, JSON.stringify(out) + '\n');
console.log(
	`contrib.json refreshed: year=${year} start=${start} days=${dates.length} total=${total}`
);
