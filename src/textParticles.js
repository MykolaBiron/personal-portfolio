// One dissolve pass. Shared so the intro and the footer run at one speed.
export const SWEEP_MS = 5200

export const PARTICLE_FONT = '"Chivo Mono", ui-sans-serif, system-ui, sans-serif'

/**
 * Rasterise `text` into a box and return the grid positions it covers, so the
 * word can be drawn as discrete squares instead of glyphs.
 */
export function sampleText({ text, width, height, grid, font = PARTICLE_FONT, fill = 0.94 }) {
  const off = document.createElement('canvas')
  off.width = width
  off.height = height
  const ctx = off.getContext('2d', { willReadFrequently: true })

  let size = height * 0.9
  ctx.font = `700 ${size}px ${font}`
  const measured = ctx.measureText(text).width
  if (measured > 0) size = Math.max(12, size * ((width * fill) / measured))
  ctx.font = `700 ${size}px ${font}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#fff'
  ctx.fillText(text, width / 2, height / 2)

  const { data } = ctx.getImageData(0, 0, width, height)
  const cells = []
  for (let gy = 0; gy * grid < height; gy += 1) {
    for (let gx = 0; gx * grid < width; gx += 1) {
      const x = Math.round(gx * grid)
      const y = Math.round(gy * grid)
      if (data[(y * width + x) * 4 + 3] > 128) cells.push({ x, y })
    }
  }
  return cells
}
