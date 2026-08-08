import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDevices } from '../context/DeviceContext.jsx'
import { createInitialState, runCommand, prompt as promptFor } from '../utils/terminalEngine.js'
import { MISSIONS } from '../data/missions.js'
import DeckScene from '../three/DeckScene.jsx'
import { createScreenCanvas, drawScreen } from '../three/screenRenderer.js'

const WELCOME = [
  { type: 'output', text: 'Simulateur — aucune action réelle.' },
  { type: 'output', text: "Tape 'help' pour les commandes." },
  { type: 'output', text: '' },
]

export default function UseDevice({ missionId, onExitMission, onBackHome }) {
  const { activeDevice, missionProgress, markStepDone } = useDevices()
  const mission = MISSIONS.find((m) => m.id === missionId) || null

  const [engine, setEngine] = useState(() => createInitialState(deviceInfo(activeDevice)))
  const [lines, setLines] = useState(WELCOME)
  const [input, setInput] = useState('')
  const [cursorOn, setCursorOn] = useState(true)
  const [camPreset, setCamPreset] = useState('use')
  const [flatMode, setFlatMode] = useState(false)

  const sceneRef = useRef(null)
  const inputRef = useRef(null)
  const flatEndRef = useRef(null)

  const typeId = activeDevice?.config?.typeId || activeDevice?.typeId || 'berry-deck'
  const screenCanvas = useMemo(() => createScreenCanvas(typeId), [typeId])
  const config = useMemo(
    () => activeDevice?.config || { typeId, board: activeDevice?.boardShort },
    [activeDevice?.id]
  )

  const masked = engine.mode === 'awaiting-password' || engine.mode === 'awaiting-newpassword'

  useEffect(() => {
    setEngine(createInitialState(deviceInfo(activeDevice)))
    setLines(WELCOME)
    setInput('')
  }, [activeDevice?.id])

  useEffect(() => {
    const iv = setInterval(() => setCursorOn((v) => !v), 530)
    return () => clearInterval(iv)
  }, [])

  // Peinture de la dalle
  useEffect(() => {
    if (!activeDevice) return
    drawScreen(screenCanvas, {
      mode: 'terminal',
      deviceName: activeDevice.name,
      osName: activeDevice.osName,
      lines,
      promptText: promptFor(engine),
      input,
      cursorOn,
      masked,
    })
  }, [screenCanvas, activeDevice, lines, engine, input, cursorOn, masked])

  useEffect(() => {
    if (flatMode) flatEndRef.current?.scrollIntoView({ block: 'end' })
  }, [lines, flatMode])

  const submit = () => {
    const raw = input
    const echo = masked ? '•'.repeat(raw.length || 1) : raw
    const p = promptFor(engine)
    const result = runCommand(engine, raw)

    const added = [{ type: 'input', text: p + echo }, ...result.lines.map((t) => ({ type: 'output', text: t }))]
    setLines((ls) => (result.clear ? [] : [...ls, ...added]))
    setEngine(result.state)
    setInput('')

    if (mission && currentStep && currentStep.match(raw, result.state)) {
      markStepDone(mission.id, currentStep.id)
      setLines((ls) => [...ls, { type: 'success', text: `✔ Étape validée : ${currentStep.prompt}` }])
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      sceneRef.current?.pressKey('enter')
      e.preventDefault()
      submit()
    } else if (e.key === 'Backspace') {
      sceneRef.current?.pressKey('backspace')
    } else if (e.key.length === 1) {
      sceneRef.current?.pressKey(e.key)
    }
  }

  const progress = mission ? missionProgress[mission.id] || { completedSteps: [] } : null
  const stepIdx = mission ? progress.completedSteps.length : -1
  const currentStep = mission && stepIdx < mission.steps.length ? mission.steps[stepIdx] : null
  const missionDone = mission && stepIdx >= mission.steps.length

  if (!activeDevice) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-16 text-center text-term/50 text-sm">
        Aucun cyberdeck actif. Assemble d'abord un appareil.
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-0">
      {/* Scène 3D — on tape directement dessus */}
      <div
        className="relative flex-1 min-h-[400px] lg:min-h-0 bg-gradient-to-b from-[#0a1016] to-[#05070a]"
        onClick={() => inputRef.current?.focus()}
      >
        <DeckScene
          ref={sceneRef}
          config={config}
          screenCanvas={screenCanvas}
          explode={0}
          screenOn
          cameraPreset={camPreset}
        />

        {/* Champ invisible qui capte la frappe clavier */}
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          type={masked ? 'password' : 'text'}
          spellCheck={false}
          autoComplete="off"
          aria-label="Saisie sur le cyberdeck"
          className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[92%] max-w-xl bg-void/80 border border-wire focus:border-term/60 rounded px-3 py-2 text-xs text-white outline-none"
          placeholder="Tape ici — la frappe s'affiche sur l'écran de l'appareil"
        />

        <div className="absolute top-4 left-4 flex gap-1.5">
          {[['use', 'ÉCRAN'], ['front', 'FACE'], ['build', '3/4']].map(([id, label]) => (
            <button
              key={id}
              onClick={(e) => { e.stopPropagation(); setCamPreset(id) }}
              className={[
                'px-2.5 py-1 rounded text-[9px] tracking-widest border transition-colors',
                camPreset === id ? 'border-term text-term bg-term/10' : 'border-wire text-term/40 hover:text-term',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
          <button
            onClick={(e) => { e.stopPropagation(); setFlatMode((v) => !v) }}
            className="px-2.5 py-1 rounded text-[9px] tracking-widest border border-wire text-term/40 hover:text-term"
          >
            {flatMode ? 'VUE 3D' : 'ÉCRAN PLAT'}
          </button>
        </div>

        {/* Terminal plein écran, plus lisible que la dalle en perspective */}
        {flatMode && (
          <div className="absolute inset-0 bg-void/95 backdrop-blur-sm p-4 pt-14 flex flex-col">
            <div className="flex-1 overflow-y-auto font-mono text-[12.5px] leading-relaxed">
              {lines.map((l, i) => (
                <div
                  key={i}
                  className={l.type === 'input' ? 'text-white/90' : l.type === 'success' ? 'text-term font-semibold' : 'text-term/70 whitespace-pre-wrap'}
                >
                  {l.text}
                </div>
              ))}
              <div className="text-white/90">
                <span className="text-term/80">{promptFor(engine)}</span>
                {masked ? '•'.repeat(input.length) : input}
                <span className={cursorOn ? 'opacity-100' : 'opacity-0'}>▊</span>
              </div>
              <div ref={flatEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Panneau mission */}
      <aside className="w-full lg:w-[320px] flex-shrink-0 border-t lg:border-t-0 lg:border-l border-wire bg-panel/50 flex flex-col">
        <div className="px-4 py-3 border-b border-wire">
          <div className="text-xs font-bold text-white/90">{activeDevice.name}</div>
          <div className="text-[10px] text-term/40">{activeDevice.osName}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 max-h-[42vh] lg:max-h-none">
          {mission ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold text-white/90">{mission.icon} {mission.title}</div>
                <button onClick={onExitMission} className="text-[10px] text-term/40 hover:text-term">✕</button>
              </div>
              <p className="text-[11px] text-term/50 mb-3 leading-relaxed">{mission.briefing}</p>
              <ol className="space-y-2">
                {mission.steps.map((st, i) => {
                  const done = progress.completedSteps.includes(st.id)
                  const current = i === stepIdx
                  return (
                    <li
                      key={st.id}
                      className={[
                        'text-[11px] rounded px-2 py-1.5 border',
                        done ? 'border-term/30 text-term/70 bg-term/5' : current ? 'border-term text-white/90' : 'border-wire text-term/30',
                      ].join(' ')}
                    >
                      <div className="flex items-start gap-1.5">
                        <span>{done ? '✔' : current ? '▶' : '○'}</span>
                        <span>{st.prompt}</span>
                      </div>
                      {current && <div className="mt-1 text-[10px] text-term/40">indice : <code className="text-amber">{st.hint}</code></div>}
                    </li>
                  )
                })}
              </ol>
              {missionDone && <div className="mt-3 text-[11px] text-term bg-term/10 border border-term/40 rounded p-2">{mission.reward}</div>}
            </>
          ) : (
            <div className="text-[11px] text-term/40 leading-relaxed">
              Usage libre — aucune mission active. Tape <code className="text-amber">help</code> pour découvrir les commandes,
              ou lance un parcours guidé depuis l'onglet <strong className="text-term/60">Missions</strong>.
            </div>
          )}
        </div>

        <div className="p-4 border-t border-wire">
          <button onClick={onBackHome} className="w-full text-[10px] tracking-widest text-term/40 hover:text-term border border-wire rounded px-3 py-2">
            ← RETOUR ACCUEIL
          </button>
        </div>
      </aside>
    </div>
  )
}

function deviceInfo(device) {
  if (!device) return {}
  return {
    name: device.name,
    boardShort: device.boardShort,
    boardName: device.boardName,
    osName: device.osName,
    osBoot: device.osBoot,
    keyboardName: device.keyboardName,
    displayName: device.displayName,
    powerName: device.powerName,
  }
}
