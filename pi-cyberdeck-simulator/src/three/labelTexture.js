import * as THREE from 'three'

const cache = new Map()

// Petite texture canvas pour graver une légende sur une touche ou un port.
export function makeLabelTexture(text, opts = {}) {
  const { size = 96, font = '600 44px "JetBrains Mono", monospace', color = '#cdd9e5' } = opts
  const key = `${text}|${size}|${font}|${color}`
  if (cache.has(key)) return cache.get(key)

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, size, size)
  ctx.fillStyle = color
  ctx.font = font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, size / 2, size / 2 + 2)

  const tex = new THREE.CanvasTexture(canvas)
  tex.anisotropy = 4
  tex.colorSpace = THREE.SRGBColorSpace
  cache.set(key, tex)
  return tex
}

export function disposeLabelCache() {
  cache.forEach((t) => t.dispose())
  cache.clear()
}
