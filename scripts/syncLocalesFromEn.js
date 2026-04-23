const fs = require('fs')
const path = require('path')

const localesDir = path.join(__dirname, '../src/locales')
const enPath = path.join(localesDir, 'en.json')
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'))

function deepMerge(base, override) {
  if (
    override === null ||
    typeof override !== 'object' ||
    Array.isArray(override)
  ) {
    return override !== undefined ? override : base
  }
  if (
    base === null ||
    typeof base !== 'object' ||
    Array.isArray(base)
  ) {
    return override !== undefined ? override : base
  }
  const out = {}
  for (const k of Object.keys(base)) {
    if (Object.prototype.hasOwnProperty.call(override, k)) {
      const bv = base[k]
      const ov = override[k]
      if (
        ov &&
        typeof ov === 'object' &&
        !Array.isArray(ov) &&
        bv &&
        typeof bv === 'object' &&
        !Array.isArray(bv)
      ) {
        out[k] = deepMerge(bv, ov)
      } else {
        out[k] = ov
      }
    } else {
      out[k] = base[k]
    }
  }
  for (const k of Object.keys(override)) {
    if (!Object.prototype.hasOwnProperty.call(base, k)) {
      out[k] = override[k]
    }
  }
  return out
}

for (const name of fs.readdirSync(localesDir)) {
  if (!name.endsWith('.json') || name === 'en.json') continue
  const filePath = path.join(localesDir, name)
  let existing = {}
  try {
    const raw = fs.readFileSync(filePath, 'utf8').trim()
    if (raw) existing = JSON.parse(raw)
  } catch {
    existing = {}
  }
  const merged = deepMerge(en, existing)
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + '\n')
}

console.log('Merged en.json into all locale files (existing translations preserved).')
