import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: Number(process.argv[3]||1440), height: Number(process.argv[4]||900) } })
const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())})
await p.goto('http://localhost:4319/', { waitUntil: 'networkidle' })
const d = p.locator('.footer-dissolve')
await d.scrollIntoViewIfNeeded()
await p.waitForTimeout(500)
console.log(JSON.stringify(await d.evaluate(n => {
  const c = n.querySelector('canvas')
  return { cssW: Math.round(c.getBoundingClientRect().width), cssH: Math.round(c.getBoundingClientRect().height),
           bufW: c.width, bufH: c.height, srText: n.querySelector('.sr-only').textContent }
})))
for (const at of [0, 900, 1800, 2700, 3600]) {
  if (at) await p.waitForTimeout(900)
  await d.screenshot({ path: `${process.argv[2]}/f-${at}.png` })
}
console.log('errors:', errs.length?errs:'none')
await b.close()
