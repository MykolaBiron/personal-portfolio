import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CONTRIB_START,
  CONTRIB_TOTAL,
  CONTRIB_LEVELS,
  CONTRIB_COUNTS,
} from './githubContributions'

const GITHUB_USER = 'MykolaBiron'
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// The reveal is budgeted to land at ~3s: the sweep finishes near 2.5s and the
// counter settles right behind it.
const COL_STEP = 38
const ROW_STEP = 12
const CELL_DURATION = 420
const COUNT_DURATION = 2400

const dayCount = CONTRIB_LEVELS.length
const startDate = new Date(`${CONTRIB_START}T00:00:00`)

const dateAt = (index) => {
  const d = new Date(startDate)
  d.setDate(d.getDate() + index)
  return d
}

const formatDate = (d) => `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`

const buildWeeks = () => {
  const weeks = []
  for (let i = 0; i < dayCount; i += 7) {
    const week = []
    for (let day = 0; day < 7; day += 1) {
      const index = i + day
      week.push(
        index < dayCount
          ? { index, level: Number(CONTRIB_LEVELS[index]), count: CONTRIB_COUNTS[index] }
          : null,
      )
    }
    weeks.push(week)
  }
  return weeks
}

const buildMonthLabels = (weeks) => {
  const labels = []
  let previous = -1
  weeks.forEach((week, weekIndex) => {
    const first = week.find(Boolean)
    if (!first) return
    const month = dateAt(first.index).getMonth()
    if (month !== previous) {
      previous = month
      labels.push({ weekIndex, label: MONTHS[month] })
    }
  })
  return labels
}

const buildSummary = () => {
  let best = 0
  let active = 0
  let longest = 0
  let running = 0
  for (let i = 0; i < dayCount; i += 1) {
    const count = CONTRIB_COUNTS[i]
    if (count > best) best = count
    if (count > 0) {
      active += 1
      running += 1
      if (running > longest) longest = running
    } else {
      running = 0
    }
  }
  return { best, active, longest }
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function ContributionGraph() {
  const weeks = useMemo(() => buildWeeks(), [])
  const monthLabels = useMemo(() => buildMonthLabels(weeks), [weeks])
  const summary = useMemo(() => buildSummary(), [])

  const sectionRef = useRef(null)
  // Reduced motion skips straight to the finished state, so nothing animates.
  const [live, setLive] = useState(prefersReducedMotion)
  const [total, setTotal] = useState(() => (prefersReducedMotion() ? CONTRIB_TOTAL : 0))
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    const node = sectionRef.current
    if (!node || prefersReducedMotion()) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setLive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!live || prefersReducedMotion()) return undefined
    let frame = 0
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / COUNT_DURATION, 1)
      const eased = 1 - (1 - progress) ** 3
      setTotal(Math.round(CONTRIB_TOTAL * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [live])

  const showTooltip = (day, event) => {
    const cell = event.currentTarget
    const plot = cell.closest('.contrib-plot')
    if (!plot) return
    const cellBox = cell.getBoundingClientRect()
    const plotBox = plot.getBoundingClientRect()
    const date = dateAt(day.index)
    setTooltip({
      x: cellBox.left - plotBox.left + cellBox.width / 2,
      y: cellBox.top - plotBox.top,
      text: `${day.count === 0 ? 'No' : day.count} contribution${day.count === 1 ? '' : 's'} on ${formatDate(date)}`,
    })
  }

  return (
    <div
      ref={sectionRef}
      className={`contrib-graph${live ? ' is-live' : ''}`}
      onMouseLeave={() => setTooltip(null)}
    >
      <header className="contrib-head">
        <div className="contrib-headline">
          <p className="contrib-total">
            <span>{total}</span> contributions
          </p>
          <p className="contrib-caption">
            in the last year on{' '}
            <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noopener noreferrer">
              @{GITHUB_USER}
            </a>
          </p>
        </div>
        <ul className="contrib-summary">
          <li>
            <span className="contrib-summary-value">{summary.longest}</span>
            <span className="contrib-summary-label">longest streak</span>
          </li>
          <li>
            <span className="contrib-summary-value">{summary.best}</span>
            <span className="contrib-summary-label">busiest day</span>
          </li>
          <li>
            <span className="contrib-summary-value">{summary.active}</span>
            <span className="contrib-summary-label">active days</span>
          </li>
        </ul>
      </header>

      <div className="contrib-scroll">
        <div className="contrib-plot">
          <div className="contrib-months" style={{ '--weeks': weeks.length }}>
            {monthLabels.map((month) => (
              <span
                key={`${month.label}-${month.weekIndex}`}
                style={{ gridColumnStart: month.weekIndex + 1 }}
              >
                {month.label}
              </span>
            ))}
          </div>

          <div className="contrib-body">
            <div className="contrib-weekdays">
              {WEEKDAYS.map((day, index) => (
                <span key={day}>{index % 2 === 1 ? day : ''}</span>
              ))}
            </div>

            <div className="contrib-cells" style={{ '--weeks': weeks.length }}>
              {weeks.map((week, weekIndex) =>
                week.map((day, dayIndex) =>
                  day ? (
                    <i
                      key={day.index}
                      className="contrib-cell"
                      data-level={day.level}
                      style={{
                        '--delay': `${weekIndex * COL_STEP + dayIndex * ROW_STEP}ms`,
                        '--duration': `${CELL_DURATION}ms`,
                      }}
                      onMouseEnter={(event) => showTooltip(day, event)}
                    />
                  ) : (
                    <i key={`pad-${weekIndex}-${dayIndex}`} className="contrib-cell is-empty" />
                  ),
                ),
              )}
            </div>
          </div>

          {tooltip && (
            <span
              className="contrib-tooltip"
              style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
            >
              {tooltip.text}
            </span>
          )}
        </div>
      </div>

      <footer className="contrib-legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <i key={level} className="contrib-cell is-key" data-level={level} />
        ))}
        <span>More</span>
      </footer>
    </div>
  )
}
