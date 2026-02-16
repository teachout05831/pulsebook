/**
 * Generate simple PWA placeholder icons.
 * Run: node scripts/generate-icons.js
 * Replace with actual logo later.
 */
const fs = require('fs')
const path = require('path')

function createSvgIcon(size) {
  const fontSize = Math.round(size * 0.35)
  const y = Math.round(size * 0.58)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.15)}" fill="#111827"/>
  <text x="50%" y="${y}" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-weight="bold" font-size="${fontSize}">SP</text>
</svg>`
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons')
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true })

// Write SVG icons (browsers accept SVG for PWA icons via manifest)
for (const size of [192, 512]) {
  const svg = createSvgIcon(size)
  fs.writeFileSync(path.join(iconsDir, `icon-${size}.svg`), svg)
  console.log(`Created icon-${size}.svg`)
}

console.log('\nPlaceholder icons created in public/icons/')
console.log('Replace with actual PNG logos when ready.')
console.log('To convert SVG to PNG, use: npx sharp-cli -i public/icons/icon-192.svg -o public/icons/icon-192.png')
