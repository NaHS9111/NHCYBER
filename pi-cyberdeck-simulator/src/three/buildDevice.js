import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { makeLabelTexture } from './labelTexture.js'

// ─── Matériaux partagés ───────────────────────────────────────────────────────
const M = {
  caseDark: () => new THREE.MeshStandardMaterial({ color: 0x3d444f, roughness: 0.5, metalness: 0.3 }),
  caseAlu: () => new THREE.MeshStandardMaterial({ color: 0xb9c0c8, roughness: 0.32, metalness: 0.9 }),
  casePrint: () => new THREE.MeshStandardMaterial({ color: 0x4a515d, roughness: 0.88, metalness: 0.05 }),
  pcb: () => new THREE.MeshStandardMaterial({ color: 0x1d7f4d, roughness: 0.66, metalness: 0.12 }),
  pcbBlack: () => new THREE.MeshStandardMaterial({ color: 0x272d35, roughness: 0.7, metalness: 0.18 }),
  gold: () => new THREE.MeshStandardMaterial({ color: 0xe8c877, roughness: 0.26, metalness: 0.95 }),
  silver: () => new THREE.MeshStandardMaterial({ color: 0xc6cdd5, roughness: 0.28, metalness: 0.9 }),
  chip: () => new THREE.MeshStandardMaterial({ color: 0x1b2027, roughness: 0.42, metalness: 0.35 }),
  key: () => new THREE.MeshStandardMaterial({ color: 0x474e59, roughness: 0.58, metalness: 0.15 }),
  bezel: () => new THREE.MeshStandardMaterial({ color: 0x14181d, roughness: 0.45, metalness: 0.35 }),
  battery: () => new THREE.MeshStandardMaterial({ color: 0x49535f, roughness: 0.55, metalness: 0.45 }),
  cell: () => new THREE.MeshStandardMaterial({ color: 0x2f8f63, roughness: 0.42, metalness: 0.55 }),
  sd: () => new THREE.MeshStandardMaterial({ color: 0x38434f, roughness: 0.68, metalness: 0.25 }),
  glass: () =>
    new THREE.MeshPhysicalMaterial({
      color: 0x0a1014,
      roughness: 0.08,
      metalness: 0,
      transmission: 0,
      opacity: 0.28,
      transparent: true,
    }),
}

function box(w, h, d, mat, radius = 0.04) {
  const r = Math.min(radius, w / 2.2, h / 2.2, d / 2.2)
  const geo = r > 0.005 ? new RoundedBoxGeometry(w, h, d, 2, r) : new THREE.BoxGeometry(w, h, d)
  const mesh = new THREE.Mesh(geo, mat)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

function at(mesh, x, y, z) {
  mesh.position.set(x, y, z)
  return mesh
}

// Crée un groupe de pièce avec ses positions assemblée / éclatée.
function part(name, category, label, assembled, explodedOffset, order) {
  const g = new THREE.Group()
  g.name = name
  g.userData = {
    category,
    label,
    assembled: new THREE.Vector3(...assembled),
    exploded: new THREE.Vector3(assembled[0] + explodedOffset[0], assembled[1] + explodedOffset[1], assembled[2] + explodedOffset[2]),
    order,
  }
  g.position.copy(g.userData.assembled)
  return g
}

// ─── Carte Raspberry Pi ───────────────────────────────────────────────────────
// zero: 6.5 × 3.0 · full: 8.5 × 5.6 (unités ≈ cm)
function makeBoard(boardId) {
  const isZero = boardId === 'pizerow' || boardId === 'pizero2w'
  const w = isZero ? 6.5 : 8.5
  const h = isZero ? 3.0 : 5.6
  const g = new THREE.Group()

  const pcb = box(w, h, 0.16, M.pcb(), 0.08)
  g.add(pcb)

  // SoC central
  const soc = box(isZero ? 1.2 : 1.5, isZero ? 1.2 : 1.5, 0.12, M.chip(), 0.02)
  g.add(at(soc, isZero ? -0.4 : -0.6, 0, 0.14))

  // Puce mémoire / contrôleur
  const ram = box(0.7, 0.7, 0.08, M.chip(), 0.02)
  g.add(at(ram, isZero ? 1.1 : 1.2, -0.9, 0.12))

  // Header GPIO 2×20 broches dorées
  const gpio = new THREE.Group()
  const pinGeo = new THREE.BoxGeometry(0.07, 0.07, 0.42)
  const pinMat = M.gold()
  const cols = 20
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < 2; r++) {
      const pin = new THREE.Mesh(pinGeo, pinMat)
      pin.position.set((c - (cols - 1) / 2) * 0.2, r * 0.2 - 0.1, 0.21)
      gpio.add(pin)
    }
  }
  const gpioBase = box(cols * 0.2 + 0.1, 0.5, 0.1, M.chip(), 0.01)
  gpio.add(at(gpioBase, 0, 0, 0.1))
  gpio.position.set(0, h / 2 - 0.42, 0)
  g.add(gpio)

  if (isZero) {
    // Ports micro-USB + mini-HDMI sur la tranche basse
    g.add(at(box(0.75, 0.32, 0.3, M.silver(), 0.03), -1.6, -h / 2 + 0.05, 0.08))
    g.add(at(box(0.55, 0.3, 0.3, M.silver(), 0.03), 0.4, -h / 2 + 0.05, 0.08))
    g.add(at(box(0.55, 0.3, 0.3, M.silver(), 0.03), 1.6, -h / 2 + 0.05, 0.08))
  } else {
    // Double USB ×2 + Ethernet sur la tranche droite
    g.add(at(box(0.6, 1.5, 0.75, M.silver(), 0.04), w / 2 - 0.25, 1.2, 0.4))
    g.add(at(box(0.6, 1.5, 0.75, M.silver(), 0.04), w / 2 - 0.25, -0.6, 0.4))
    g.add(at(box(0.6, 1.4, 0.72, M.silver(), 0.04), w / 2 - 0.25, -2.2, 0.4))
    // USB-C alim + micro-HDMI
    g.add(at(box(0.55, 0.28, 0.3, M.silver(), 0.03), -2.6, -h / 2 + 0.05, 0.1))
    g.add(at(box(0.5, 0.28, 0.3, M.silver(), 0.03), -1.2, -h / 2 + 0.05, 0.1))
  }

  // Trous de fixation
  const holeMat = M.gold()
  const holeGeo = new THREE.TorusGeometry(0.13, 0.04, 6, 14)
  ;[[-w / 2 + 0.4, h / 2 - 0.4], [w / 2 - 0.4, h / 2 - 0.4], [-w / 2 + 0.4, -h / 2 + 0.4], [w / 2 - 0.4, -h / 2 + 0.4]].forEach(([x, y]) => {
    const t = new THREE.Mesh(holeGeo, holeMat)
    t.position.set(x, y, 0.09)
    g.add(t)
  })

  return { group: g, width: w, height: h }
}

// ─── Clavier BlackBerry ───────────────────────────────────────────────────────
const BB_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '⌫'],
  ['⇧', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '⏎'],
  ['sym', 'alt', '', '', '', '', '', '.', '/', '⏎'],
]

// Mappe un caractère tapé vers la touche physique à illuminer.
export const KEY_INDEX = (() => {
  const map = {}
  BB_ROWS.forEach((row, r) => {
    row.forEach((label, c) => {
      if (!label) return
      map[label.toLowerCase()] = `${r}-${c}`
    })
  })
  map[' '] = '3-4'
  map['enter'] = '2-9'
  map['backspace'] = '1-9'
  return map
})()

function makeBBKeyboard() {
  const g = new THREE.Group()
  const keys = {}
  const KW = 0.56
  const KH = 0.44
  const GAPX = 0.06
  const GAPY = 0.07
  const cols = 10

  // Plaque support
  const plate = box(cols * (KW + GAPX) + 0.3, BB_ROWS.length * (KH + GAPY) + 0.9, 0.22, M.caseDark(), 0.1)
  g.add(at(plate, 0, -0.32, -0.12))

  // Rangée de navigation BlackBerry (touches d'appel + trackpad optique)
  const navY = (BB_ROWS.length * (KH + GAPY)) / 2 + 0.06
  const navMat = M.key()
  ;[-2.35, -1.5, 1.5, 2.35].forEach((x, i) => {
    const k = box(0.62, 0.4, 0.16, navMat, 0.07)
    g.add(at(k, x, navY, 0.06))
    const lbl = new THREE.Mesh(
      new THREE.PlaneGeometry(0.3, 0.3),
      new THREE.MeshBasicMaterial({ map: makeLabelTexture(['📞', '☰', '↩', '⏻'][i], { font: '600 46px sans-serif' }), transparent: true })
    )
    g.add(at(lbl, x, navY, 0.15))
  })
  // Trackpad optique central
  const pad = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 0.12, 24),
    new THREE.MeshStandardMaterial({ color: 0x11151a, roughness: 0.25, metalness: 0.6 })
  )
  pad.rotation.x = Math.PI / 2
  g.add(at(pad, 0, navY, 0.07))

  // Rangées de touches, légèrement arquées comme sur un Bold
  BB_ROWS.forEach((row, r) => {
    const rowY = navY - 0.5 - r * (KH + GAPY)
    let c = 0
    while (c < cols) {
      const label = row[c]
      // La barre d'espace occupe les colonnes 2 à 6 de la dernière rangée
      const isSpace = r === 3 && c === 2
      const span = isSpace ? 5 : 1
      if (label === '' && !isSpace) {
        c += 1
        continue
      }
      const wKey = KW * span + GAPX * (span - 1)
      const offset = c + (span - 1) / 2 - (cols - 1) / 2
      const arc = -Math.abs(offset) * 0.012

      const key = box(wKey, KH, 0.2, M.key(), 0.08)
      key.position.set(offset * (KW + GAPX), rowY + arc, 0.06)
      key.rotation.z = -offset * 0.018
      key.userData.baseZ = 0.06
      key.userData.baseColor = 0x24282f
      g.add(key)
      keys[`${r}-${c}`] = key

      const text = isSpace ? '' : label
      if (text) {
        const isGlyph = text.length > 1 && !/^[a-z]+$/i.test(text)
        const lbl = new THREE.Mesh(
          new THREE.PlaneGeometry(Math.min(wKey * 0.8, 0.34), 0.34),
          new THREE.MeshBasicMaterial({
            map: makeLabelTexture(text, {
              font: text.length > 2 ? '600 30px "JetBrains Mono", monospace' : isGlyph ? '600 44px sans-serif' : '700 46px "JetBrains Mono", monospace',
              color: '#aebac7',
            }),
            transparent: true,
          })
        )
        lbl.position.set(key.position.x, key.position.y, 0.165)
        lbl.rotation.z = key.rotation.z
        g.add(lbl)
        key.userData.label = lbl
      }
      c += span
    }
  })

  const bounds = new THREE.Box3().setFromObject(g)
  return { group: g, keys, height: bounds.max.y - bounds.min.y }
}

// Clavier externe générique (deck Raspberry Pi) — vue de dessus, posé à plat.
function makeFlatKeyboard(wide) {
  const g = new THREE.Group()
  const keys = {}
  const W = wide ? 21 : 17
  const D = 7.2
  const base = box(W, 0.7, D, M.caseDark(), 0.18)
  g.add(base)

  const cols = wide ? 15 : 13
  const rows = 5
  const kw = (W - 1.2) / cols - 0.12
  const kd = (D - 1.0) / rows - 0.12
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = box(kw, 0.22, kd, M.key(), 0.05)
      const x = (c - (cols - 1) / 2) * (kw + 0.12)
      const z = (r - (rows - 1) / 2) * (kd + 0.12)
      k.position.set(x, 0.42, z)
      k.userData.baseZ = 0.42
      k.userData.baseColor = 0x24282f
      k.userData.axis = 'y'
      g.add(k)
      keys[`${r}-${c}`] = k
    }
  }
  return { group: g, keys }
}

// ─── Écran ────────────────────────────────────────────────────────────────────
// La hauteur est déduite du canvas pour que la texture ne soit jamais étirée.
function makeScreen(screenCanvas, w, bezelPad = 0.35) {
  const h = w * (screenCanvas.height / screenCanvas.width)
  const g = new THREE.Group()

  const bezel = box(w + bezelPad * 2, h + bezelPad * 2, 0.28, M.bezel(), 0.12)
  g.add(bezel)

  const tex = new THREE.CanvasTexture(screenCanvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
  )
  panel.position.z = 0.15
  g.add(panel)

  // Reflet verre
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(w + bezelPad * 1.4, h + bezelPad * 1.4), M.glass())
  glass.position.z = 0.17
  g.add(glass)

  // Halo lumineux émis par la dalle
  const light = new THREE.PointLight(0x00ff9d, 0, 12, 2)
  light.position.set(0, 0, 1.2)
  g.add(light)

  return { group: g, texture: tex, light, panel, width: w, height: h }
}

// ─── Assemblage complet ───────────────────────────────────────────────────────
export function buildDevice(config, screenCanvas) {
  const root = new THREE.Group()
  const parts = []
  const registry = {}
  let screen = null
  let keys = {}

  const addPart = (p) => {
    parts.push(p)
    registry[p.userData.category] = p
    root.add(p)
  }

  const headless = config.display === 'headless'

  if (config.typeId === 'berry-deck') {
    // ── Cyberdeck BlackBerry : format portrait tenu en main ──────────────
    const W = 6.9
    const H = 11.8
    const D = 1.5

    // Coque
    const caseP = part('case', 'case', 'Coque', [0, 0, 0], [0, 0, -3.0], 0)
    const shellMat = config.case === 'alu' ? M.caseAlu() : config.case === 'print3d' ? M.casePrint() : M.caseDark()
    const shell = box(W, H, D, shellMat, 0.5)
    caseP.add(shell)
    // Évidement avant pour loger l'électronique
    const inner = box(W - 0.7, H - 0.7, 0.5, new THREE.MeshStandardMaterial({ color: 0x0b0e12, roughness: 0.9 }), 0.3)
    caseP.add(at(inner, 0, 0, D / 2 - 0.2))
    if (config.case !== 'none-case') addPart(caseP)

    // Batterie
    const powerP = part('power', 'power', 'Alimentation', [0, -1.6, -0.15], [-3.8, -0.8, 0], 1)
    if (config.power === 'li18650') {
      const cell = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 3.4, 20), M.cell())
      cell.rotation.z = Math.PI / 2
      powerP.add(cell)
      powerP.add(at(box(1.5, 1.0, 0.35, M.pcbBlack(), 0.05), 0, 0.9, 0))
    } else {
      powerP.add(box(4.2, 3.0, 0.55, M.battery(), 0.12))
      powerP.add(at(box(1.2, 0.5, 0.2, M.gold(), 0.04), 1.8, 1.0, 0))
    }
    addPart(powerP)

    // Carte Pi
    const boardBuilt = makeBoard(config.board)
    const boardP = part('board', 'board', 'Carte', [0, 2.0, 0.1], [0, 0.5, -1.5], 2)
    boardBuilt.group.rotation.z = Math.PI // header GPIO vers le bas, comme dans le mod
    boardP.add(boardBuilt.group)
    addPart(boardP)

    // Carte SD
    const sdP = part('storage', 'storage', 'Stockage', [2.6, 3.4, 0.28], [3.2, 1.0, 0.5], 3)
    sdP.add(box(1.1, 1.3, 0.09, M.sd(), 0.04))
    sdP.add(at(box(0.8, 0.35, 0.03, M.gold(), 0.01), 0, -0.42, 0.06))
    addPart(sdP)

    // Écran
    if (!headless) {
      screen = makeScreen(screenCanvas, config.display === 'oled096' ? 4.9 : 5.95, 0.3)
      const screenP = part('display', 'display', 'Écran', [0, 2.5, D / 2 - 0.05], [0, 3.0, 2.6], 4)
      screenP.add(screen.group)
      addPart(screenP)
    }

    // Clavier BlackBerry
    const kb = makeBBKeyboard()
    const kbP = part('keyboard', 'keyboard', 'Clavier', [0, -2.95, D / 2 - 0.08], [0, -3.0, 2.8], 5)
    kbP.add(kb.group)
    keys = kb.keys
    addPart(kbP)
  } else {
    // ── Cyberdeck Raspberry Pi : station posée sur un plan ───────────────
    // Socle
    const caseP = part('case', 'case', 'Châssis', [0, 0, 0], [0, -3.0, 0], 0)
    const baseMat = config.case === 'alu' ? M.caseAlu() : config.case === 'print3d' ? M.casePrint() : M.caseDark()
    caseP.add(at(box(26, 0.7, 17, baseMat, 0.25), 0, 0, 0))
    // Montant arrière qui tient l'écran
    caseP.add(at(box(24, 0.7, 3.4, baseMat, 0.2), 0, 1.4, -6.6))
    if (config.case !== 'none-case') addPart(caseP)

    // Carte Pi posée à plat sur le socle
    const boardBuilt = makeBoard(config.board)
    const boardP = part('board', 'board', 'Carte', [-7.4, 0.55, -1.4], [-3.0, 4.2, 0], 1)
    boardBuilt.group.rotation.x = -Math.PI / 2
    boardP.add(boardBuilt.group)
    addPart(boardP)

    // Stockage
    const sdP = part('storage', 'storage', 'Stockage', [-7.4, 0.5, 2.6], [-3.4, 2.6, 3.0], 2)
    if (config.storage === 'ssdusb') {
      sdP.add(box(5.0, 0.9, 3.2, M.silver(), 0.15))
      sdP.add(at(box(0.9, 0.4, 0.35, M.chip(), 0.03), 2.4, 0.1, 0))
    } else {
      const sd = box(1.3, 0.08, 1.1, M.sd(), 0.04)
      sd.rotation.y = Math.PI / 2
      sdP.add(sd)
    }
    addPart(sdP)

    // Alimentation
    const powerP = part('power', 'power', 'Alimentation', [8.2, 1.2, -2.0], [4.0, 3.2, 0], 3)
    if (config.power === 'powerbank') {
      powerP.add(box(9.0, 2.2, 6.4, M.battery(), 0.3))
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), new THREE.MeshBasicMaterial({ color: 0x00ff9d }))
      powerP.add(at(led, -3.6, 1.2, 3.0))
    } else if (config.power === 'lipo1200') {
      powerP.add(box(6.0, 1.1, 4.2, M.battery(), 0.15))
    } else {
      powerP.add(box(5.4, 2.4, 3.4, M.caseDark(), 0.2))
      const cable = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.14, 8, 24, Math.PI * 1.4), M.chip())
      cable.rotation.set(Math.PI / 2, 0, 0)
      powerP.add(at(cable, 3.4, -0.6, 0))
    }
    addPart(powerP)

    // Écran redressé à l'arrière
    if (!headless) {
      const sw = config.display === 'hdmi7' ? 15.5 : 9.6
      screen = makeScreen(screenCanvas, sw, 0.55)
      const sh = screen.height
      const screenP = part('display', 'display', 'Écran', [0, sh / 2 + 2.6, -6.2], [0, 4.6, -3.0], 4)
      screenP.rotation.x = -0.16
      screenP.userData.rotX = -0.16
      screenP.add(screen.group)
      // Pied
      screenP.add(at(box(3.0, 1.4, 0.6, M.caseDark(), 0.1), 0, -sh / 2 - 0.9, -0.2))
      addPart(screenP)
    }

    // Clavier
    const kb = makeFlatKeyboard(config.keyboard === 'usb-full')
    const kbP = part('keyboard', 'keyboard', 'Clavier', [0, 0.7, 4.6], [0, 0.6, 7.0], 5)
    kbP.add(kb.group)
    keys = kb.keys
    addPart(kbP)
  }

  return { root, parts, registry, screen, keys }
}

export { M as MATERIALS }
