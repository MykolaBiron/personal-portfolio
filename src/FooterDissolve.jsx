import { useEffect, useRef } from 'react'
import { sampleText, SWEEP_MS } from './textParticles'

const TEXT = 'Mykola Biron'
const REF_WIDTH = 900 // width the pitch/scatter figures below are tuned for
const SCATTER = 52 // how far a fully dissolved cell drifts, at REF_WIDTH
const HEIGHT_RATIO = 0.3 // canvas height relative to width

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function FooterDissolve() {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return undefined

    const ctx = canvas.getContext('2d')
    let cells = []
    let width = 0
    let height = 0
    let grid = 5
    let dot = 3.4
    let scatter = SCATTER
    let frame = 0
    let visible = true
    let startedAt = 0

    // Rasterise the word once, then keep only the covered grid positions.
    const sample = () => {
      width = Math.max(240, Math.round(wrap.clientWidth))
      height = Math.round(width * HEIGHT_RATIO)
      // Scale the mesh with the canvas, or the dots swamp the letters when narrow.
      grid = Math.max(2.5, Math.min(5, width / 180))
      dot = grid * 0.68
      scatter = SCATTER * (width / REF_WIDTH)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

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
    }


    const draw = (now) => {
      if (!startedAt) startedAt = now
      const band = width * 0.34
      const wave = (((now - startedAt) % SWEEP_MS) / SWEEP_MS) * (width + band * 2) - band

      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < cells.length; i += 1) {
        const c = cells[i]
        // Distance from the sweeping band decides how far this cell has broken up.
        const d = 1 - Math.min(1, Math.abs(c.x - wave) / band)
        const e = d * d * (1 + c.lead)
        const off = e * c.mag * scatter
        ctx.globalAlpha = 1 - e * 0.55
        ctx.fillRect(c.x + c.dx * off, c.y + c.dy * off, dot, dot)
      }
      ctx.globalAlpha = 1
      if (visible) frame = requestAnimationFrame(draw)
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < cells.length; i += 1) ctx.fillRect(cells[i].x, cells[i].y, dot, dot)
    }

    const start = () => {
      sample()
      // Resizing the canvas in sample() resets context state, so colour after.
      ctx.fillStyle = '#fdf5ff'
      if (prefersReducedMotion()) {
        drawStatic()
        return
      }
      cancelAnimationFrame(frame)
      startedAt = 0
      frame = requestAnimationFrame(draw)
    }

    document.fonts?.ready.then(start).catch(start)
    start()

    // Only burn frames while the footer is actually on screen.
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting)
        if (visible && !prefersReducedMotion()) {
          cancelAnimationFrame(frame)
          frame = requestAnimationFrame(draw)
        } else {
          cancelAnimationFrame(frame)
        }
      },
      { threshold: 0 },
    )
    observer.observe(wrap)

    let resizeTimer = 0
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(start, 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="footer-dissolve" ref={wrapRef}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="sr-only">{TEXT}</span>
    </div>
  )
}
