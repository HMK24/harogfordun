import sharp from 'sharp'
import { readdir, stat, unlink, rename } from 'node:fs/promises'
import { join, parse, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images')

// target width in CSS px × ~2 DPR. Portfolio/gallery displays max ~280–640 CSS px,
// so 900px physical is more than enough. Services are square tiles ~380 CSS px.
const jobs = [
  { dir: 'portfolio/hair', glob: /\.jpe?g$/i, width: 900, quality: 55, format: 'avif', replaceOriginal: true },
  { dir: 'owners', files: ['RS - NB.png'], width: 900, quality: 60, format: 'avif', replaceOriginal: true },
  { dir: 'owners', files: ['Ólöf Eir NB.avif'], width: 700, quality: 60, format: 'avif', replaceOriginal: false },
  { dir: 'services', glob: /\.avif$/i, width: 800, quality: 55, format: 'avif', replaceOriginal: false },
]

let totalBefore = 0
let totalAfter = 0

for (const job of jobs) {
  const dirAbs = join(ROOT, job.dir)
  const entries = job.files ?? (await readdir(dirAbs)).filter((f) => job.glob.test(f))

  for (const name of entries) {
    const srcPath = join(dirAbs, name)
    const { name: base, ext } = parse(name)
    const outName = `${base}.${job.format}`
    const outPath = join(dirAbs, outName)
    const tmpPath = join(dirAbs, `${base}.__tmp.${job.format}`)

    const before = (await stat(srcPath)).size
    totalBefore += before

    await sharp(srcPath, { failOn: 'none' })
      .rotate()
      .resize({ width: job.width, withoutEnlargement: true })
      .avif({ quality: job.quality, effort: 6 })
      .toFile(tmpPath)

    // Remove original if different extension
    if (ext.toLowerCase() !== `.${job.format}` && job.replaceOriginal) {
      await unlink(srcPath)
    }
    // If output exists (same-ext case), remove it before rename
    if (outPath !== srcPath) {
      try { await unlink(outPath) } catch {}
    } else {
      // Overwriting same file: delete first
      try { await unlink(srcPath) } catch {}
    }
    await rename(tmpPath, outPath)

    const after = (await stat(outPath)).size
    totalAfter += after
    console.log(`${job.dir}/${name} → ${outName}  ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`)
  }
}

console.log(`\nTotal: ${(totalBefore / 1024 / 1024).toFixed(2)}MB → ${(totalAfter / 1024 / 1024).toFixed(2)}MB  (saved ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(2)}MB)`)
