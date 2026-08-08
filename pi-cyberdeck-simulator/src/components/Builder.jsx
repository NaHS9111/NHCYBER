import React, { useEffect, useMemo, useRef, useState } from 'react'
import { DEVICE_TYPES, CATEGORIES, COMPONENTS, OS_IMAGES } from '../data/components.js'
import { useDevices } from '../context/DeviceContext.jsx'
import DeckScene from '../three/DeckScene.jsx'
import { createScreenCanvas, drawScreen } from '../three/screenRenderer.js'

const CATEGORY_LABELS = {
  board: 'Carte',
  keyboard: 'Clavier',
  display: 'Écran',
  power: 'Alimentation',
  storage: 'Stockage',
  case: 'Boîtier',
}

function compatibleFor(category, deviceTypeId) {
  return COMPONENTS[category].filter((c) => c.devices.includes(deviceTypeId))
}

export default function Builder({ onDone }) {
  const { addDevice } = useDevices()
  const [deviceTypeId, setDeviceTypeId] = useState(null)
  const [picks, setPicks] = useState({})
  const [name, setName] = useState('')
  const [osId, setOsId] = useState(OS_IMAGES[0].id)
  const [phase, setPhase] = useState('assembly') // assembly | flash | boot | done
  const [explode, setExplode] = useState(0.7)
  const [highlight, setHighlight] = useState(null)
  const [screenView, setScreenView] = useState({ mode: 'off' })

  const sceneRef = useRef(null)
  const timers = useRef([])

  const deviceType = DEVICE_TYPES.find((d) => d.id === deviceTypeId)
  const screenCanvas = useMemo(() => (deviceTypeId ? createScreenCanvas(deviceTypeId) : null), [deviceTypeId])

  const config = deviceTypeId ? { typeId: deviceTypeId, ...picks } : null

  useEffect(() => {
    if (!deviceTypeId) return
    const next = {}
    CATEGORIES.forEach((cat) => {
      const list = compatibleFor(cat, deviceTypeId)
      if (list.length) next[cat] = list[0].id
    })
    setPicks(next)
  }, [deviceTypeId])

  // Le canvas de l'écran est repeint dès que sa vue logique change.
  useEffect(() => {
    if (screenCanvas) drawScreen(screenCanvas, screenView)
  }, [screenCanvas, screenView])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const osName = OS_IMAGES.find((o) => o.id === osId)?.name || ''
  const ready = name.trim().length > 0 && CATEGORIES.every((c) => picks[c])

  // ── Séquence flash → boot → fiche terminée ────────────────────────────
  const startFlash = () => {
    setPhase('flash')
    setExplode(0)
    let progress = 0
    const log = ["Préparation de l'image..."]
    const steps = ["Préparation de l'image...", 'Écriture sur la carte...', 'Vérification des blocs...', 'Éjection sécurisée...']
    setScreenView({ mode: 'flash', deviceName: name.trim(), osName, flash: { progress: 0, log } })

    const iv = setInterval(() => {
      progress = Math.min(100, progress + 4 + Math.random() * 5)
      const idx = Math.min(steps.length - 1, Math.floor((progress / 100) * steps.length))
      if (log[log.length - 1] !== steps[idx]) log.push(steps[idx])
      setScreenView({ mode: 'flash', deviceName: name.trim(), osName, flash: { progress, log: [...log] } })
      if (progress >= 100) {
        clearInterval(iv)
        timers.current.push(setTimeout(startBoot, 600))
      }
    }, 150)
    timers.current.push(iv)
  }

  const startBoot = () => {
    setPhase('boot')
    const os = OS_IMAGES.find((o) => o.id === osId)
    const bootLines = ['[    0.000000] Cyberdeck firmware — POST OK', ...(os?.boot || ['Booting...'])]
    const acc = []
    bootLines.forEach((line, i) => {
      timers.current.push(
        setTimeout(() => {
          acc.push({ text: line, type: 'output' })
          setScreenView({ mode: 'terminal', deviceName: name.trim(), osName, lines: [...acc], promptText: '', input: '', cursorOn: true })
        }, i * 340)
      )
    })
    timers.current.push(setTimeout(finish, bootLines.length * 340 + 700))
  }

  const finish = () => {
    const get = (cat) => COMPONENTS[cat].find((c) => c.id === picks[cat])
    const os = OS_IMAGES.find((o) => o.id === osId)
    addDevice({
      id: `dev-${Date.now()}`,
      name: name.trim(),
      typeId: deviceType.id,
      typeName: deviceType.name,
      typeIcon: deviceType.icon,
      config: { typeId: deviceType.id, ...picks },
      boardName: get('board')?.name,
      boardShort: get('board')?.id,
      keyboardName: get('keyboard')?.name,
      displayName: get('display')?.name,
      powerName: get('power')?.name,
      storageName: get('storage')?.name,
      caseName: get('case')?.name,
      osName: os?.name,
      osBoot: os?.boot,
      builtAt: new Date().toISOString(),
    })
    setPhase('done')
  }

  const reset = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setDeviceTypeId(null)
    setPicks({})
    setName('')
    setOsId(OS_IMAGES[0].id)
    setPhase('assembly')
    setExplode(0.7)
    setScreenView({ mode: 'off' })
  }

  // ── Choix du type ─────────────────────────────────────────────────────
  if (!deviceTypeId) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-12 w-full">
        <h2 className="text-xl font-bold text-white mb-1">Choisis le type de cyberdeck</h2>
        <p className="text-xs text-term/50 mb-8">Deux familles de montages, deux silhouettes. Tu pourras tourner la maquette dans tous les sens.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {DEVICE_TYPES.map((dt) => (
            <button
              key={dt.id}
              onClick={() => setDeviceTypeId(dt.id)}
              className="text-left p-6 rounded-lg border border-wire hover:border-term/50 hover:bg-term/5 transition-all"
            >
              <div className="text-4xl mb-3">{dt.icon}</div>
              <div className="font-bold text-white/90 text-sm mb-1">{dt.name}</div>
              <div className="text-[11px] text-term/50 mb-2">{dt.tagline}</div>
              <div className="text-[10px] text-term/35 leading-relaxed">{dt.blurb}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Établi 3D ─────────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-0">
      {/* Viewport 3D */}
      <div className="relative flex-1 min-h-[380px] lg:min-h-0 bg-gradient-to-b from-[#0a1016] to-[#05070a]">
        <DeckScene
          ref={sceneRef}
          config={config}
          screenCanvas={screenCanvas}
          explode={explode}
          screenOn={phase !== 'assembly'}
          highlightCategory={phase === 'assembly' ? highlight : null}
          cameraPreset={phase === 'assembly' ? 'build' : 'use'}
          autoRotate={phase === 'assembly' && !highlight}
        />

        {/* Contrôles d'éclatement */}
        {phase === 'assembly' && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-panel/85 backdrop-blur border border-wire rounded-full px-4 py-2">
            <button onClick={() => setExplode(0)} className="text-[10px] tracking-widest text-term/60 hover:text-term">ASSEMBLÉ</button>
            <input
              type="range" min="0" max="1" step="0.01" value={explode}
              onChange={(e) => setExplode(parseFloat(e.target.value))}
              className="w-40 accent-term cursor-pointer"
              aria-label="Vue éclatée"
            />
            <button onClick={() => setExplode(1)} className="text-[10px] tracking-widest text-term/60 hover:text-term">ÉCLATÉ</button>
          </div>
        )}

        <div className="absolute top-4 left-4 text-[10px] text-term/30 tracking-widest pointer-events-none">
          GLISSER : PIVOTER · MOLETTE : ZOOM
        </div>

        {phase === 'done' && (
          <div className="absolute inset-0 flex items-center justify-center bg-void/75 backdrop-blur-sm">
            <div className="text-center px-6">
              <div className="text-4xl mb-3">✅</div>
              <h2 className="text-xl font-bold text-white mb-1">« {name} » est assemblé</h2>
              <p className="text-xs text-term/50 mb-7">Tu peux maintenant t'en servir depuis l'onglet Utiliser.</p>
              <div className="flex justify-center gap-3">
                <button onClick={reset} className="px-4 py-2 rounded border border-wire text-term/60 text-xs tracking-widest hover:border-term/40 hover:text-term">
                  EN ASSEMBLER UN AUTRE
                </button>
                <button onClick={onDone} className="px-4 py-2 rounded bg-term/10 border border-term text-term text-xs tracking-widest hover:bg-term/20">
                  TERMINER
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Panneau de configuration */}
      <aside className="w-full lg:w-[340px] flex-shrink-0 border-t lg:border-t-0 lg:border-l border-wire bg-panel/50 flex flex-col">
        <div className="px-4 py-3 border-b border-wire flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{deviceType.icon}</span>
            <span className="text-xs font-bold text-white/90">{deviceType.name}</span>
          </div>
          <button onClick={reset} className="text-[10px] text-term/40 hover:text-term tracking-widest">CHANGER</button>
        </div>

        {phase === 'assembly' ? (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 max-h-[46vh] lg:max-h-none">
              {CATEGORIES.map((cat) => {
                const options = compatibleFor(cat, deviceTypeId)
                return (
                  <div key={cat} onMouseEnter={() => setHighlight(cat)} onMouseLeave={() => setHighlight(null)}>
                    <div className="text-[10px] tracking-[0.2em] text-term/40 mb-1.5">{CATEGORY_LABELS[cat].toUpperCase()}</div>
                    <div className="space-y-1.5">
                      {options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => { setPicks((p) => ({ ...p, [cat]: opt.id })); setHighlight(cat) }}
                          className={[
                            'w-full text-left px-2.5 py-2 rounded border text-[11px] flex items-start gap-2 transition-colors',
                            picks[cat] === opt.id ? 'border-term bg-term/5 text-white' : 'border-wire text-term/55 hover:border-term/30',
                          ].join(' ')}
                        >
                          <span>{opt.icon}</span>
                          <span>
                            <span className="font-semibold block">{opt.name}</span>
                            <span className="text-[10px] text-term/40">{opt.specs}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}

              <div className="pt-2 border-t border-wire">
                <div className="text-[10px] tracking-[0.2em] text-term/40 mb-1.5 mt-3">IMAGE OS</div>
                <div className="space-y-1.5">
                  {OS_IMAGES.map((os) => (
                    <button
                      key={os.id}
                      onClick={() => setOsId(os.id)}
                      className={[
                        'w-full text-left px-2.5 py-2 rounded border text-[11px] flex items-start gap-2 transition-colors',
                        osId === os.id ? 'border-term bg-term/5 text-white' : 'border-wire text-term/55 hover:border-term/30',
                      ].join(' ')}
                    >
                      <span>{os.icon}</span>
                      <span>
                        <span className="font-semibold block">{os.name}</span>
                        <span className="text-[10px] text-term/40">{os.size}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-4 py-4 border-t border-wire space-y-3">
              <label className="block">
                <span className="text-[10px] tracking-[0.2em] text-term/40">NOM DE L'APPAREIL</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex : Berry-One"
                  maxLength={40}
                  className="mt-1 w-full bg-void border border-wire focus:border-term outline-none rounded px-3 py-2 text-sm text-white"
                />
              </label>
              <button
                onClick={startFlash}
                disabled={!ready}
                className="w-full py-2.5 rounded bg-term/10 border border-term text-term text-xs tracking-widest hover:bg-term/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                FLASHER L'IMAGE &amp; DÉMARRER
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 px-4 py-6 text-[11px] text-term/50 leading-relaxed">
            {phase === 'flash' && 'Écriture de l\'image sur la carte — regarde l\'écran de l\'appareil.'}
            {phase === 'boot' && 'Séquence de démarrage en cours sur la dalle...'}
            {phase === 'done' && 'Assemblage terminé.'}
          </div>
        )}
      </aside>
    </div>
  )
}
