import { useEffect, useState } from 'react'

const EXTRUDE_LAYERS = 10

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const line = (
  <>
    Hello, I&apos;m <span className="gradient-text">Mykola Biron</span>
  </>
)

export default function HeroName() {
  // Hold the reveal until webfonts settle, otherwise a first-visit font swap
  // lands mid-animation and the extrusion visibly jumps.
  const [ready, setReady] = useState(() => prefersReducedMotion())

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    let cancelled = false
    const start = () => {
      if (!cancelled) setReady(true)
    }
    const timer = setTimeout(start, 400)
    document.fonts?.ready.then(start).catch(start)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  return (
    <h1 className={`hero-name${ready ? ' is-live' : ''}`}>
      <span className="hero-name-inner">
        <span className="hero-name-glow" aria-hidden="true" />
        <span className="hero-name-stack" aria-hidden="true">
          {Array.from({ length: EXTRUDE_LAYERS }, (_, i) => (
            <span key={i} className="hero-name-layer" style={{ '--i': EXTRUDE_LAYERS - i }}>
              {line}
            </span>
          ))}
        </span>
        <span className="hero-name-face">{line}</span>
      </span>
    </h1>
  )
}
