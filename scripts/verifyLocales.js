const fs = require('fs')
const path = require('path')

const localesDir = path.join(__dirname, '../src/locales')
const en = JSON.parse(
  fs.readFileSync(path.join(localesDir, 'en.json'), 'utf8'),
)

function leafKeys(obj, prefix = '') {
  const out = []
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return [prefix]
  }
  const keys = Object.keys(obj)
  if (keys.length === 0) {
    return [prefix]
  }
  for (const k of keys) {
    const p = prefix ? `${prefix}.${k}` : k
    const v = obj[k]
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      out.push(...leafKeys(v, p))
    } else {
      out.push(p)
    }
  }
  return out
}

const enKeys = new Set(leafKeys(en))
let failed = false

for (const name of fs.readdirSync(localesDir)) {
  if (!name.endsWith('.json') || name === 'en.json') continue
  const data = JSON.parse(
    fs.readFileSync(path.join(localesDir, name), 'utf8'),
  )
  const locKeys = new Set(leafKeys(data))
  for (const k of enKeys) {
    if (!locKeys.has(k)) {
      console.error(`${name}: missing key ${k}`)
      failed = true
    }
  }
}

if (failed) process.exit(1)
console.log('All locale files include every key from en.json')
