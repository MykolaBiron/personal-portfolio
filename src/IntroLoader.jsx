import { useEffect, useRef, useState } from 'react'
import { sampleText, SWEEP_MS } from './textParticles'

const TEXT = 'Mykola Biron'
const ASSEMBLE_MS = SWEEP_MS // one full dissolve sweep, at the footer's speed
const REF_WIDTH = 900 // width SCATTER is tuned for
const SCATTER = 52 // matches FooterDissolve, so both read as the same effect
const HOLD_MS = 260 // beat on the finished word
const FADE_MS = 480 // overlay clears to reveal the page
export const INTRO_MS = ASSEMBLE_MS + HOLD_MS + FADE_MS

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function IntroLoader({ onDone }) {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return undefined

    if (prefersReducedMotion()) {
      onDone()
      return undefined
    }

    const ctx = canvas.getContext('2d')
    let cells = []
    let width = 0
    let height = 0
    let grid = 5
    let scatter = SCATTER
    let frame = 0
    let fadeTimer = 0
    let doneTimer = 0

    const build = () => {
      width = Math.max(240, Math.round(wrap.clientWidth))
      height = Math.round(Math.min(width * 0.3, wrap.clientHeight))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      grid = Math.max(2.5, Math.min(5, width / 180))
      scatter = SCATTER * (width / REF_WIDTH)
      cells = sampleText({ text: TEXT, width, height, grid }).map((cell) => {
        const angle = Math.random() * Math.PI * 2
        return {
          ...cell,
          dx: Math.cos(angle),
          dy: Math.sin(angle) * 1.35,
          mag: 0.25 + Math.random() * 0.75,
          lead: Math.random() * 0.35,
        }
      })
      ctx.fillStyle = '#fdf5ff'
    }

    let startedAt = 0
    const dot = () => grid * 0.68

    const tick = (now) => {
      if (!startedAt) startedAt = now
      const p = Math.min(1, (now - startedAt) / ASSEMBLE_MS)
      const d = dot()

      // Identical to FooterDissolve: the word is whole at both ends and a
      // travelling band breaks up only the two or three letters it covers.
      const band = width * 0.34
      const wave = -band + p * (width + band * 2)

      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < cells.length; i += 1) {
        const c = cells[i]
        const prox = 1 - Math.min(1, Math.abs(c.x - wave) / band)
        const e = prox * prox * (1 + c.lead)
        const off = e * c.mag * scatter
        ctx.globalAlpha = 1 - e * 0.55
        ctx.fillRect(c.x + c.dx * off, c.y + c.dy * off, d, d)
      }
      ctx.globalAlpha = 1

      if (p < 1) frame = requestAnimationFrame(tick)
    }

    build()
    frame = requestAnimationFrame(tick)

    fadeTimer = setTimeout(() => setLeaving(true), ASSEMBLE_MS + HOLD_MS)
    doneTimer = setTimeout(onDone, INTRO_MS)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div
      className={`intro-loader${leaving ? ' is-leaving' : ''}`}
      ref={wrapRef}
      role="status"
      aria-label={`Loading ${TEXT}`}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
