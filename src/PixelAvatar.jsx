import { useEffect, useRef } from 'react'

const REF_PITCH = 110 // cells across the circle; pitch derives from this
const BUILD_MS = 1400 // assemble sweep
const DOT_COLOR = '253, 245, 255'
const CENTER = [0.5, 0.5] // module-level so the default doesn't re-run the effect each render

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Halftone portrait: the image is sampled on a grid and each cell drawn as a
 * square sized by its luminance, so highlights read as dense dots on the dark
 * page. `focal` picks which part of the photo the circular crop centres on.
 */
export default function PixelAvatar({
  src,
  alt,
  focal = CENTER,
  // >1 crops in tighter. A tight face crop is what keeps a busy or bright
  // background out of the circle, since bright sky halftones into solid dots.
  zoom = 1,
  // Foliage and other saturated background survives a plain luminance pass, so
  // optionally drop strongly coloured cells. 1 disables the knockout.
  maxSaturation = 1,
  invert = false,
  // Flat bright sky is greyer than skin, so saturation separates them cleanly:
  // drop cells that are both bright and near-colourless.
  skyLum = 0.55,
  skySat = 0.12,
}) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return undefined

    const ctx = canvas.getContext('2d')
    let cells = []
    let size = 0
    let grid = 3
    let frame = 0
    let startedAt = 0
    let running = false

    const build = (image) => {
      size = Math.max(80, Math.round(wrap.clientWidth))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(size * dpr)
      canvas.height = Math.round(size * dpr)
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      grid = Math.max(1.6, Math.min(3.4, size / REF_PITCH))

      // Downscale to exactly one pixel per cell: the browser's own filtering
      // area-averages for us, which beats point-sampling every grid position.
      const cols = Math.ceil(size / grid)
      const off = document.createElement('canvas')
      off.width = cols
      off.height = cols
      const octx = off.getContext('2d', { willReadFrequently: true })
      octx.imageSmoothingEnabled = true
      octx.imageSmoothingQuality = 'high'

      // Cover-fit the photo into the square, biased to the focal point.
      const scale = Math.max(size / image.width, size / image.height) * zoom
      const dw = image.width * scale
      const dh = image.height * scale
      const k = cols / size
      octx.drawImage(
        image,
        (size - dw) * focal[0] * k,
        (size - dh) * focal[1] * k,
        dw * k,
        dh * k,
      )

      const { data } = octx.getImageData(0, 0, cols, cols)
      const radius = size / 2
      const next = []
      for (let gy = 0; gy < cols; gy += 1) {
        for (let gx = 0; gx < cols; gx += 1) {
          const x = gx * grid
          const y = gy * grid
          const dist = Math.hypot(x + grid / 2 - radius, y + grid / 2 - radius)
          if (dist > radius) continue

          const i = (gy * cols + gx) * 4
          const r = data[i] / 255
          const g = data[i + 1] / 255
          const b = data[i + 2] / 255
          const max = Math.max(r, g, b)
          const min = Math.min(r, g, b)
          const sat = max === 0 ? 0 : (max - min) / max
          if (sat > maxSaturation) continue

          const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
          if (lum > skyLum && sat < skySat) continue

          // Soften the last few pixels so the circle dissolves instead of cutting.
          const edge = Math.min(1, (radius - dist) / (radius * 0.28))
          next.push({ x, y, lum, edge, delay: dist / radius + Math.random() * 0.35 })
        }
      }

      // Stretch contrast across the crop's actual range: raw luminance spans
      // too narrow a band to give the dots visible size variation.
      const sorted = next.map((c) => c.lum).sort((a, b) => a - b)
      const lo = sorted[Math.floor(sorted.length * 0.04)] ?? 0
      const hi = sorted[Math.floor(sorted.length * 0.96)] ?? 1
      const span = Math.max(0.001, hi - lo)
      for (let i = 0; i < next.length; i += 1) {
        const n = Math.max(0, Math.min(1, (next[i].lum - lo) / span))
        next[i].weight = Math.pow(invert ? 1 - n : n, 0.85)
      }

      cells = next
    }

    const paint = (progress) => {
      ctx.clearRect(0, 0, size, size)
      for (let i = 0; i < cells.length; i += 1) {
        const c = cells[i]
        // Dots assemble outward from the centre.
        const local = Math.max(0, Math.min(1, (progress * 1.6 - c.delay) / 0.55))
        if (local <= 0) continue
        const eased = local * (2 - local)
        if (c.weight < 0.06) continue
        const d = grid * (0.1 + 0.95 * c.weight) * eased
        ctx.globalAlpha = c.edge
        const o = (grid - d) / 2
        ctx.fillRect(c.x + o, c.y + o, d, d)
      }
      ctx.globalAlpha = 1
    }

    const tick = (now) => {
      if (!startedAt) startedAt = now
      const progress = Math.min(1, (now - startedAt) / BUILD_MS)
      paint(progress)
      if (progress < 1) frame = requestAnimationFrame(tick)
      else running = false
    }

    const image = new Image()
    image.decoding = 'async'

    let observer
    image.onload = () => {
      build(image)
      ctx.fillStyle = `rgb(${DOT_COLOR})`

      if (prefersReducedMotion()) {
        paint(1)
        return
      }

      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting) && !running) {
            running = true
            startedAt = 0
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(tick)
            observer.disconnect()
          }
        },
        { threshold: 0.3 },
      )
      observer.observe(wrap)
    }
    image.src = src

    let resizeTimer = 0
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (!image.complete) return
        build(image)
        ctx.fillStyle = `rgb(${DOT_COLOR})`
        paint(1)
      }, 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      observer?.disconnect()
    }
  }, [src, focal, maxSaturation, zoom, invert, skyLum, skySat])

  return (
    <div className="pixel-avatar" ref={wrapRef}>
      <canvas ref={canvasRef} role="img" aria-label={alt} />
    </div>
  )
}
