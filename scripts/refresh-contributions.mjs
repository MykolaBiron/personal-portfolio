/**
 * Regenerates src/githubContributions.js.
 *
 * Without a token GitHub only reports PUBLIC contributions. Your profile page
 * shows public + private because you are logged in and have "Private
 * contributions" enabled, which is why the totals differ.
 *
 *   GITHUB_TOKEN=ghp_xxx node scripts/refresh-contributions.mjs
 *
 * The token needs the `read:user` scope and is only used here, at generation
 * time — the committed data file contains numbers only, never the token.
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const USER = process.env.GITHUB_USER || 'MykolaBiron'
const TOKEN = process.env.GITHUB_TOKEN
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'githubContributions.js')

const QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`

const fetchAuthenticated = async () => {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'portfolio-contribution-refresh',
    },
    body: JSON.stringify({ query: QUERY, variables: { login: USER } }),
  })
  if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}: ${await res.text()}`)
  const body = await res.json()
  if (body.errors) throw new Error(JSON.stringify(body.errors))

  const collection = body.data.user.contributionsCollection
  const calendar = collection.contributionCalendar
  const days = calendar.weeks
    .flatMap((week) => week.contributionDays)
    .map((day) => ({ date: day.date, count: day.contributionCount }))
  return { days, total: calendar.totalContributions, private: collection.restrictedContributionsCount }
}

// GitHub's own graph endpoint, unauthenticated. Authoritative for what the
// public actually sees, and it hands back GitHub's own level buckets.
const fetchPublic = async () => {
  const res = await fetch(`https://github.com/users/${USER}/contributions`, {
    headers: { 'User-Agent': 'portfolio-contribution-refresh' },
  })
  if (!res.ok) throw new Error(`GitHub contributions ${res.status}`)
  const html = await res.text()

  const tips = new Map()
  for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const text = m[2].trim()
    tips.set(m[1], text.startsWith('No ') ? 0 : Number(/(\d+)/.exec(text)?.[1] ?? 0))
  }

  const days = []
  for (const m of html.matchAll(
    /<td[^>]*data-date="(\d{4}-\d\d-\d\d)"[^>]*id="([^"]+)"[^>]*data-level="(\d)"/g,
  )) {
    days.push({ date: m[1], count: tips.get(m[2]) ?? 0, level: Number(m[3]) })
  }
  if (!days.length) throw new Error('Could not parse the contribution calendar')

  return { days, total: days.reduce((sum, day) => sum + day.count, 0), private: 0 }
}

// Only needed for the authenticated path: GraphQL returns counts but no level
// buckets, so approximate GitHub's quartiles-of-busiest-day banding.
const levelFor = (count, busiest) => {
  if (count === 0) return 0
  const share = count / Math.max(busiest, 1)
  if (share > 0.75) return 4
  if (share > 0.5) return 3
  if (share > 0.25) return 2
  return 1
}

const { days, total, private: restricted } = TOKEN ? await fetchAuthenticated() : await fetchPublic()
days.sort((a, b) => a.date.localeCompare(b.date))

const busiest = days.reduce((max, day) => Math.max(max, day.count), 0)
// Prefer GitHub's own buckets when the public path supplied them.
const levels = days.map((day) => day.level ?? levelFor(day.count, busiest)).join('')
const counts = days.map((day) => day.count)

writeFileSync(
  OUT,
  `// Generated from GitHub contribution data for @${USER}\n` +
    `// Fetched ${new Date().toISOString().slice(0, 10)} — ${TOKEN ? 'authenticated (includes private)' : 'PUBLIC ONLY (no GITHUB_TOKEN)'}.\n` +
    `// Regenerate with: node scripts/refresh-contributions.mjs\n\n` +
    `export const CONTRIB_START = ${JSON.stringify(days[0].date)}\n` +
    `export const CONTRIB_TOTAL = ${total}\n` +
    `export const CONTRIB_LEVELS = ${JSON.stringify(levels)}\n` +
    `export const CONTRIB_COUNTS = ${JSON.stringify(counts)}\n`,
)

console.log(`${TOKEN ? 'authenticated' : 'public-only'}: ${days.length} days, ${total} contributions` +
  (restricted ? ` (${restricted} private)` : '') + `, busiest ${busiest}`)
console.log(`wrote ${OUT}`)
