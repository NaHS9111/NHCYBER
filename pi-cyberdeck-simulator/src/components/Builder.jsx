import React, { useEffect, useMemo, useRef, useState } from 'react'
import { DEVICE_TYPES, CATEGORIES, COMPONENTS, OS_IMAGES } from '../data/components.js'
import { useDevices } from '../context/DeviceContext.jsx'

const CATEGORY_LABELS = {
  board: 'Carte',
  keyboard: 'Clavier',
  display: 'Écran',
  power: 'Alimentation',
  storage: 'Stockage',
  case: 'Boîtier',
}

const STEPS = ['Type', 'Composants', 'Système & nom', 'Flash', 'Premier boot', 'Terminé']

function compatibleFor(category, deviceTypeId) {
  return COMPONENTS[category].filter((c) => c.devices.includes(deviceTypeId))
}

export default function Builder({ onDone }) {
  const { addDevice } = useDevices()
  const [step, setStep] = useState(0)
  const [deviceTypeId, setDeviceTypeId] = useState(null)
  const [picks, setPicks] = useState({})
  const [name, setName] = useState('')
  const [osId, setOsId] = useState(null)
  const [flashProgress, setFlashProgress] = useState(0)
  const [flashLog, setFlashLog] = useState([])
  const [bootLines, setBootLines] = useState([])
  const flashTimer = useRef(null)
  const bootTimer = useRef(null)

  const deviceType = DEVICE_TYPES.find((d) => d.id === deviceTypeId)

  useEffect(() => {
    if (!deviceTypeId) return
    const next = {}
    CATEGORIES.forEach((cat) => {
      const list = compatibleFor(cat, deviceTypeId)
      if (list.length) next[cat] = list[0].id
    })
    setPicks(next)
  }, [deviceTypeId])

  useEffect(() => () => {
    clearInterval(flashTimer.current)
    clearInterval(bootTimer.current)
  }, [])

  const canGoComponents = !!deviceTypeId
  const canGoOsStep = CATEGORIES.every((cat) => picks[cat])
  const canFlash = name.trim().length > 0 && !!osId

  const startFlash = () => {
    setStep(3)
    setFlashProgress(0)
    const steps = ["Préparation de l'image...", "Écriture sur la carte SD...", 'Vérification des blocs...', 'Éjection sécurisée...', 'Flash terminé.']
    let i = 0
    setFlashLog([steps[0]])
    flashTimer.current = setInterval(() => {
      setFlashProgress((p) => {
        const next = Math.min(100, p + 7 + Math.random() * 6)
        const stepIdx = Math.min(steps.length - 1, Math.floor((next / 100) * (steps.length - 1)))
        if (stepIdx !== i) {
          i = stepIdx
          setFlashLog((l) => [...l, steps[stepIdx]])
        }
        if (next >= 100) {
          clearInterval(flashTimer.current)
          setTimeout(startBoot, 500)
        }
        return next
      })
    }, 180)
  }

  const startBoot = () => {
    setStep(4)
    const os = OS_IMAGES.find((o) => o.id === osId)
    const lines = os?.boot || ['Booting...', 'login: ']
    setBootLines([])
    let i = 0
    bootTimer.current = setInterval(() => {
      setBootLines((l) => [...l, lines[i]])
      i += 1
      if (i >= lines.length) {
        clearInterval(bootTimer.current)
        setTimeout(finishBuild, 400)
      }
    }, 380)
  }

  const finishBuild = () => {
    const board = COMPONENTS.board.find((c) => c.id === picks.board)
    const keyboard = COMPONENTS.keyboard.find((c) => c.id === picks.keyboard)
    const display = COMPONENTS.display.find((c) => c.id === picks.display)
    const power = COMPONENTS.power.find((c) => c.id === picks.power)
    const storage = COMPONENTS.storage.find((c) => c.id === picks.storage)
    const kase = COMPONENTS.case.find((c) => c.id === picks.case)
    const os = OS_IMAGES.find((o) => o.id === osId)

    const device = {
      id: `dev-${Date.now()}`,
      name: name.trim(),
      typeId: deviceType.id,
      typeName: deviceType.name,
      typeIcon: deviceType.icon,
      boardName: board?.name,
      boardShort: board?.id,
      keyboardName: keyboard?.name,
      displayName: display?.name,
      powerName: power?.name,
      storageName: storage?.name,
      caseName: kase?.name,
      osName: os?.name,
      osBoot: os?.boot,
      builtAt: new Date().toISOString(),
    }
    addDevice(device)
    setStep(5)
  }

  const reset = () => {
    setStep(0)
    setDeviceTypeId(null)
    setPicks({})
    setName('')
    setOsId(null)
    setFlashProgress(0)
    setFlashLog([])
    setBootLines([])
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10 w-full">
      <Stepper step={step} />

      {step === 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Choisis le type de cyberdeck</h2>
          <p className="text-xs text-term/50 mb-6">Deux familles de montages, deux philosophies.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {DEVICE_TYPES.map((dt) => (
              <button
                key={dt.id}
                onClick={() => setDeviceTypeId(dt.id)}
                className={[
                  'text-left p-5 rounded-lg border transition-all',
                  deviceTypeId === dt.id ? 'border-term bg-term/5' : 'border-wire hover:border-term/40',
                ].join(' ')}
                style={{ boxShadow: deviceTypeId === dt.id ? `0 0 24px -8px ${dt.color}` : undefined }}
              >
                <div className="text-3xl mb-2">{dt.icon}</div>
                <div className="font-bold text-white/90 text-sm mb-1">{dt.name}</div>
                <div className="text-[11px] text-term/50 mb-2">{dt.tagline}</div>
                <div className="text-[10px] text-term/35 leading-relaxed">{dt.blurb}</div>
              </button>
            ))}
          </div>
          <NavButtons onNext={() => setStep(1)} nextDisabled={!canGoComponents} />
        </div>
      )}

      {step === 1 && deviceType && (
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Choisis les composants — {deviceType.name}</h2>
          <p className="text-xs text-term/50 mb-6">Chaque catégorie liste uniquement le matériel compatible avec ce type de montage.</p>
          <div className="space-y-6">
            {CATEGORIES.map((cat) => {
              const options = compatibleFor(cat, deviceTypeId)
              return (
                <div key={cat}>
                  <div className="text-[10px] tracking-[0.2em] text-term/40 mb-2">{CATEGORY_LABELS[cat].toUpperCase()}</div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setPicks((p) => ({ ...p, [cat]: opt.id }))}
                        className={[
                          'text-left px-3 py-2.5 rounded border text-xs flex items-start gap-2 transition-colors',
                          picks[cat] === opt.id ? 'border-term bg-term/5 text-white' : 'border-wire text-term/60 hover:border-term/30',
                        ].join(' ')}
                      >
                        <span>{opt.icon}</span>
                        <span>
                          <div className="font-semibold">{opt.name}</div>
                          <div className="text-[10px] text-term/40 mt-0.5">{opt.specs}</div>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <NavButtons onBack={() => setStep(0)} onNext={() => setStep(2)} nextDisabled={!canGoOsStep} />
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Nom du cyberdeck & système d'exploitation</h2>
          <p className="text-xs text-term/50 mb-6">Dernière étape avant le flash de la carte.</p>
          <label className="block mb-6">
            <span className="text-[10px] tracking-[0.2em] text-term/40">NOM DE L'APPAREIL</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex : Berry-One"
              className="mt-1 w-full bg-panel border border-wire focus:border-term outline-none rounded px-3 py-2 text-sm text-white"
              maxLength={40}
            />
          </label>
          <div className="text-[10px] tracking-[0.2em] text-term/40 mb-2">IMAGE OS</div>
          <div className="grid sm:grid-cols-2 gap-2 mb-6">
            {OS_IMAGES.map((os) => (
              <button
                key={os.id}
                onClick={() => setOsId(os.id)}
                className={[
                  'text-left px-3 py-2.5 rounded border text-xs flex items-start gap-2 transition-colors',
                  osId === os.id ? 'border-term bg-term/5 text-white' : 'border-wire text-term/60 hover:border-term/30',
                ].join(' ')}
              >
                <span>{os.icon}</span>
                <span>
                  <div className="font-semibold">{os.name} <span className="text-term/30">· {os.size}</span></div>
                  <div className="text-[10px] text-term/40 mt-0.5">{os.desc}</div>
                </span>
              </button>
            ))}
          </div>
          <NavButtons onBack={() => setStep(1)} onNext={startFlash} nextDisabled={!canFlash} nextLabel="FLASHER L'IMAGE" />
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Flash de l'image en cours...</h2>
          <div className="w-full h-3 rounded-full bg-panel border border-wire overflow-hidden mb-4">
            <div className="h-full bg-term transition-all duration-200" style={{ width: `${flashProgress}%` }} />
          </div>
          <div className="text-xs text-term/50 mb-1">{Math.floor(flashProgress)}%</div>
          <div className="font-mono text-[11px] bg-black/40 border border-wire rounded p-3 space-y-1 min-h-[120px]">
            {flashLog.map((l, i) => (
              <div key={i} className="text-term/70">$ {l}</div>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Premier démarrage</h2>
          <div className="font-mono text-[11px] bg-black/60 border border-wire rounded p-4 min-h-[160px] space-y-1">
            {bootLines.map((l, i) => (
              <div key={i} className="text-term/80">{l}</div>
            ))}
            <span className="inline-block w-2 h-3 bg-term animate-blink align-middle" />
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="text-center py-10">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-white mb-2">Cyberdeck assemblé !</h2>
          <p className="text-xs text-term/50 mb-8">« {name} » est prêt. Retrouve-le sur ton tableau de bord.</p>
          <div className="flex justify-center gap-3">
            <button onClick={reset} className="px-4 py-2 rounded border border-wire text-term/60 text-xs tracking-widest hover:border-term/40 hover:text-term">
              ASSEMBLER UN AUTRE
            </button>
            <button onClick={onDone} className="px-4 py-2 rounded bg-term/10 border border-term text-term text-xs tracking-widest hover:bg-term/20">
              RETOUR À L'ACCUEIL
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Stepper({ step }) {
  return (
    <div className="flex items-center gap-1 mb-8 text-[9px] tracking-widest">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className={['px-2 py-1 rounded', i === step ? 'bg-term/10 text-term border border-term' : i < step ? 'text-term/40' : 'text-term/20'].join(' ')}>
            {s.toUpperCase()}
          </div>
          {i < STEPS.length - 1 && <div className="w-4 h-px bg-wire" />}
        </React.Fragment>
      ))}
    </div>
  )
}

function NavButtons({ onBack, onNext, nextDisabled, nextLabel = 'SUIVANT →' }) {
  return (
    <div className="flex justify-between mt-8">
      {onBack ? (
        <button onClick={onBack} className="px-4 py-2 rounded border border-wire text-term/50 text-xs tracking-widest hover:border-term/30">
          ← RETOUR
        </button>
      ) : <span />}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="px-4 py-2 rounded bg-term/10 border border-term text-term text-xs tracking-widest hover:bg-term/20 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {nextLabel}
      </button>
    </div>
  )
}
