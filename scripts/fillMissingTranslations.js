const fs = require('fs')
const path = require('path')
const { batchTranslate, singleTranslate } = require('google-translate-api-x')

const localesDir = path.join(__dirname, '../src/locales')
const enPath = path.join(localesDir, 'en.json')

const LOCALE_TO_GOOGLE = {
  fil: 'tl',
  zh: 'zh-CN',
}

function parseArgs() {
  const args = process.argv.slice(2)
  const out = { only: null, dryRun: false }
  for (const a of args) {
    if (a === '--dry-run') out.dryRun = true
    else if (a.startsWith('--only='))
      out.only = a
        .slice('--only='.length)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
  }
  return out
}

function protectPlaceholders(str) {
  const parts = []
  const masked = str.replace(/\{\{[^}]+\}\}/g, (m) => {
    parts.push(m)
    return `⟦${parts.length - 1}⟧`
  })
  return { masked, parts }
}

function restorePlaceholders(str, parts) {
  let out = str
  for (let i = 0; i < parts.length; i++) {
    const token = `⟦${i}⟧`
    if (out.includes(token)) out = out.split(token).join(parts[i])
    else {
      const loose = new RegExp(`⟦\\s*${i}\\s*⟧`, 'g')
      out = out.replace(loose, parts[i])
    }
  }
  return out
}

function collectUntranslated(enNode, locNode, keyPath, acc) {
  if (typeof enNode === 'string') {
    const locVal =
      locNode !== undefined && locNode !== null ? String(locNode) : enNode
    if (enNode.length > 0 && locVal === enNode) {
      acc.push({ keyPath, en: enNode })
    }
    return
  }
  if (
    enNode &&
    typeof enNode === 'object' &&
    !Array.isArray(enNode) &&
    Object.keys(enNode).length
  ) {
    const loc =
      locNode && typeof locNode === 'object' && !Array.isArray(locNode)
        ? locNode
        : {}
    for (const k of Object.keys(enNode)) {
      collectUntranslated(enNode[k], loc[k], [...keyPath, k], acc)
    }
  }
}

function setAtPath(root, keyPath, value) {
  let cur = root
  for (let i = 0; i < keyPath.length - 1; i++) {
    const k = keyPath[i]
    if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {}
    cur = cur[k]
  }
  cur[keyPath[keyPath.length - 1]] = value
}

function getAtPath(root, keyPath) {
  let cur = root
  for (const k of keyPath) {
    if (cur == null) return undefined
    cur = cur[k]
  }
  return cur
}

async function translateOneFallback(text, googleLang) {
  const { masked, parts } = protectPlaceholders(text)
  const r = await singleTranslate(masked, { from: 'en', to: googleLang })
  const raw =
    r && typeof r.text === 'string'
      ? r.text
      : r && r.text != null
        ? String(r.text)
        : null
  if (raw == null) return null
  return restorePlaceholders(raw, parts)
}

async function translateChunk(items, googleLang) {
  const masked = items.map(({ en }) => protectPlaceholders(en))
  const payload = masked.map((m) => ({
    text: m.masked,
    from: 'en',
    to: googleLang,
  }))
  const results = await batchTranslate(payload, {
    rejectOnPartialFail: false,
  })
  const out = []
  for (let i = 0; i < items.length; i++) {
    const r = Array.isArray(results) ? results[i] : results
    const raw =
      r && typeof r.text === 'string'
        ? r.text
        : r && r.text != null
          ? String(r.text)
          : null
    if (raw != null) {
      out.push(restorePlaceholders(raw, masked[i].parts))
      continue
    }
    let retry = null
    try {
      retry = await translateOneFallback(items[i].en, googleLang)
    } catch (e) {
      console.warn('  (single retry failed):', items[i].keyPath.join('.'), e.message || e)
    }
    if (retry != null) {
      out.push(retry)
    } else {
      console.warn('  (skip failed translation):', items[i].keyPath.join('.'))
      out.push(items[i].en)
    }
    await sleep(120)
  }
  return out
}

const BATCH = 35
const DELAY_MS = 400

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function fillLocale(en, localeCode, dryRun) {
  const filePath = path.join(localesDir, `${localeCode}.json`)
  const raw = fs.readFileSync(filePath, 'utf8')
  const locale = JSON.parse(raw)
  const googleLang = LOCALE_TO_GOOGLE[localeCode] || localeCode

  const todo = []
  collectUntranslated(en, locale, [], todo)

  if (todo.length === 0) {
    console.log(`${localeCode}: nothing to translate (all strings differ from en)`)
    return 0
  }

  console.log(`${localeCode} → ${googleLang}: ${todo.length} string(s)`)
  if (dryRun) return todo.length

  const out = JSON.parse(JSON.stringify(locale))
  for (let i = 0; i < todo.length; i += BATCH) {
    const slice = todo.slice(i, i + BATCH)
    let translated
    try {
      translated = await translateChunk(
        slice.map((t) => ({ ...t })),
        googleLang,
      )
    } catch (e) {
      console.error(`${localeCode} batch failed at ${i}:`, e.message || e)
      throw e
    }
    slice.forEach((item, j) => {
      setAtPath(out, item.keyPath, translated[j])
    })
    if (i + BATCH < todo.length) await sleep(DELAY_MS)
  }

  fs.writeFileSync(filePath, JSON.stringify(out, null, 2) + '\n')
  return todo.length
}

async function main() {
  const { only, dryRun } = parseArgs()
  const en = JSON.parse(fs.readFileSync(enPath, 'utf8'))

  let files = fs
    .readdirSync(localesDir)
    .filter((n) => n.endsWith('.json') && n !== 'en.json')
    .map((n) => n.replace('.json', ''))
    .sort()

  if (only) files = files.filter((c) => only.includes(c))

  if (dryRun) {
    let total = 0
    for (const code of files) {
      const locale = JSON.parse(
        fs.readFileSync(path.join(localesDir, `${code}.json`), 'utf8'),
      )
      const todo = []
      collectUntranslated(en, locale, [], todo)
      console.log(`${code}: ${todo.length} untranslated (same as en)`)
      total += todo.length
    }
    console.log(`\nTotal untranslated strings across listed locales: ${total}`)
    return
  }

  let grand = 0
  for (const code of files) {
    try {
      grand += await fillLocale(en, code, false)
    } catch (e) {
      console.error(`Stopped at locale ${code}:`, e.message || e)
      process.exitCode = 1
      break
    }
    await sleep(DELAY_MS)
  }
  console.log(`\nDone. Updated strings (approx): ${grand}`)
}

main()
