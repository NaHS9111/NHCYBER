// Dessine l'écran de l'appareil sur un canvas hors-écran, utilisé comme
// texture de la dalle 3D. Tout est peint à la main pour garder le rendu CRT.

const COLORS = {
  bg: '#04070a',
  text: '#5ef2b4',
  dim: '#2f7f60',
  bright: '#c7fff0',
  input: '#eafff7',
  accent: '#00ff9d',
  warn: '#ffb000',
}

// Le portatif reçoit une dalle carrée façon BlackBerry Passport : elle remplit
// le haut du boîtier sans laisser de zone morte au-dessus du clavier.
export function createScreenCanvas(typeId) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = typeId === 'berry-deck' ? 1024 : 576
  return canvas
}

function wrapLine(ctx, text, maxWidth) {
  if (!text) return ['']
  const out = []
  let line = ''
  for (const ch of text) {
    const test = line + ch
    if (ctx.measureText(test).width > maxWidth && line !== '') {
      out.push(line)
      line = ch
    } else {
      line = test
    }
  }
  out.push(line)
  return out
}

export function drawScreen(canvas, view) {
  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height
  const { mode = 'terminal', deviceName = '', osName = '', lines = [], promptText = '', input = '', cursorOn = true, masked = false, flash = null } = view

  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, W, H)

  if (mode === 'off') {
    // Léger halo de veille : la dalle éteinte ne doit pas lire comme un trou noir.
    const g = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W * 0.6)
    g.addColorStop(0, 'rgba(0,255,157,0.07)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
    drawScanlines(ctx, W, H, 0.3)
    ctx.fillStyle = 'rgba(150,190,210,0.3)'
    ctx.font = '500 30px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText('— EN VEILLE —', W / 2, H / 2)
    ctx.textAlign = 'left'
    return
  }

  // La dalle du modèle portatif est physiquement minuscule : on y grossit le
  // texte pour qu'il reste lisible une fois la surface vue en perspective.
  const compact = H > 640
  const PAD = compact ? 22 : 26
  const FS = compact ? 26 : 19
  const LH = compact ? 34 : 25
  ctx.font = `400 ${FS}px "JetBrains Mono", monospace`
  ctx.textBaseline = 'top'
  ctx.textAlign = 'left'

  // Bandeau supérieur
  const headerH = compact ? 46 : 40
  ctx.fillStyle = 'rgba(0,255,157,0.06)'
  ctx.fillRect(0, 0, W, headerH)
  ctx.fillStyle = 'rgba(0,255,157,0.22)'
  ctx.fillRect(0, headerH - 1, W, 1)
  ctx.font = `500 ${compact ? 19 : 16}px "JetBrains Mono", monospace`
  ctx.fillStyle = COLORS.dim
  ctx.fillText(`${deviceName}`, PAD, compact ? 14 : 12)
  ctx.textAlign = 'right'
  ctx.fillText(osName, W - PAD, compact ? 14 : 12)
  ctx.textAlign = 'left'

  // Écran de flash pendant l'écriture de l'image
  if (mode === 'flash' && flash) {
    ctx.font = '700 24px "JetBrains Mono", monospace'
    ctx.fillStyle = COLORS.bright
    ctx.fillText("ÉCRITURE DE L'IMAGE", PAD, headerH + 40)

    const barY = headerH + 96
    const barW = W - PAD * 2
    ctx.strokeStyle = 'rgba(0,255,157,0.35)'
    ctx.lineWidth = 2
    ctx.strokeRect(PAD, barY, barW, 26)
    ctx.fillStyle = COLORS.accent
    ctx.fillRect(PAD + 3, barY + 3, (barW - 6) * (flash.progress / 100), 20)

    ctx.font = '400 18px "JetBrains Mono", monospace'
    ctx.fillStyle = COLORS.text
    ctx.fillText(`${Math.floor(flash.progress)} %`, PAD, barY + 40)

    let y = barY + 84
    flash.log.slice(-6).forEach((l) => {
      ctx.fillStyle = COLORS.dim
      ctx.fillText(`> ${l}`, PAD, y)
      y += LH
    })
    drawScanlines(ctx, W, H, 0.22)
    drawVignette(ctx, W, H)
    return
  }

  // Corps : lignes de terminal + invite courante
  const maxWidth = W - PAD * 2
  const bodyTop = headerH + 14
  const maxRows = Math.floor((H - bodyTop - PAD) / LH)

  const rendered = []
  for (const l of lines) {
    for (const w of wrapLine(ctx, l.text, maxWidth)) rendered.push({ text: w, type: l.type })
  }
  if (mode === 'terminal') {
    const shown = masked ? '•'.repeat(input.length) : input
    for (const w of wrapLine(ctx, promptText + shown, maxWidth)) rendered.push({ text: w, type: 'live' })
  }

  const visible = rendered.slice(-maxRows)
  let y = bodyTop
  visible.forEach((l) => {
    ctx.fillStyle =
      l.type === 'input' ? COLORS.input : l.type === 'success' ? COLORS.accent : l.type === 'live' ? COLORS.input : COLORS.text
    ctx.font = `${l.type === 'success' ? '700' : '400'} ${FS}px "JetBrains Mono", monospace`
    ctx.fillText(l.text, PAD, y)
    y += LH
  })

  // Curseur clignotant en fin de ligne courante
  if (mode === 'terminal' && cursorOn && visible.length) {
    const last = visible[visible.length - 1]
    ctx.font = `400 ${FS}px "JetBrains Mono", monospace`
    const cx = PAD + ctx.measureText(last.text).width + 2
    ctx.fillStyle = COLORS.accent
    ctx.fillRect(cx, y - LH + 2, FS * 0.55, FS + 2)
  }

  drawScanlines(ctx, W, H, 0.22)
  drawVignette(ctx, W, H)
}

function drawScanlines(ctx, W, H, alpha) {
  ctx.fillStyle = `rgba(0,0,0,${alpha})`
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1)
}

function drawVignette(ctx, W, H) {
  const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.25, W / 2, H / 2, Math.max(W, H) * 0.72)
  g.addColorStop(0, 'rgba(0,0,0,0)')
  g.addColorStop(1, 'rgba(0,0,0,0.55)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
}
