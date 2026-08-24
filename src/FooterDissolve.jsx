import { useEffect, useRef } from 'react'

const TEXT = 'Mykola Biron'
const GRID = 5 // sampling pitch in CSS px
const DOT = 3.4 // drawn square size
const SWEEP_MS = 5200 // one dissolve pass across the word
const SCATTER = 52 // how far a fully dissolved cell drifts
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
    let frame = 0
    let visible = true
    let startedAt = 0

    // Rasterise the word once, then keep only the covered grid positions.
    const sample = () => {
      width = Math.max(240, Math.round(wrap.clientWidth))
      height = Math.round(width * HEIGHT_RATIO)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const off = document.createElement('canvas')
      off.width = width
      off.height = height
      const octx = off.getContext('2d', { willReadFrequently: true })

      // Fit the word to the available width.
      let size = height * 0.9
      octx.font = `700 ${size}px "Chivo Mono", ui-sans-serif, system-ui, sans-serif`
      const fit = (width * 0.94) / octx.measureText(TEXT).width
      size = Math.max(12, size * fit)
      octx.font = `700 ${size}px "Chivo Mono", ui-sans-serif, system-ui, sans-serif`
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      octx.fillStyle = '#fff'
      octx.fillText(TEXT, width / 2, height / 2)

      const { data } = octx.getImageData(0, 0, width, height)
      const next = []
      for (let y = 0; y < height; y += GRID) {
        for (let x = 0; x < width; x += GRID) {
          if (data[(y * width + x) * 4 + 3] > 128) {
            const angle = Math.random() * Math.PI * 2
            next.push({
              x,
              y,
              dx: Math.cos(angle),
              dy: Math.sin(angle) * 1.35,
              mag: 0.25 + Math.random() * 0.75,
              lead: Math.random() * 0.35,
            })
          }
        }
      }
      cells = next
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
        const off = e * c.mag * SCATTER
        ctx.globalAlpha = 1 - e * 0.55
        ctx.fillRect(c.x + c.dx * off, c.y + c.dy * off, DOT, DOT)
      }
      ctx.globalAlpha = 1
      if (visible) frame = requestAnimationFrame(draw)
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < cells.length; i += 1) ctx.fillRect(cells[i].x, cells[i].y, DOT, DOT)
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
