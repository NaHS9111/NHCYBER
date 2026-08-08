import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDevices } from '../context/DeviceContext.jsx'
import { createInitialState, runCommand, prompt as promptFor } from '../utils/terminalEngine.js'
import { MISSIONS } from '../data/missions.js'

const WELCOME = [
  'Simulateur de terminal — 100% hors ligne, aucune action réelle.',
  "Tape 'help' pour la liste des commandes.",
  '',
]

export default function Terminal({ missionId, onExitMission, onBackHome }) {
  const { activeDevice, missionProgress, markStepDone } = useDevices()
  const mission = MISSIONS.find((m) => m.id === missionId) || null

  const [engineState, setEngineState] = useState(() => createInitialState(deviceInfo(activeDevice)))
  const [lines, setLines] = useState(() => WELCOME.map((t) => ({ type: 'output', text: t })))
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setEngineState(createInitialState(deviceInfo(activeDevice)))
  }, [activeDevice?.id])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines])

  const progress = mission ? missionProgress[mission.id] || { completedSteps: [] } : null
  const currentStepIndex = mission ? progress.completedSteps.length : -1
  const currentStep = mission && currentStepIndex < mission.steps.length ? mission.steps[currentStepIndex] : null
  const missionDone = mission && currentStepIndex >= mission.steps.length

  const submit = (raw) => {
    const wasMasked = engineState.mode === 'awaiting-password' || engineState.mode === 'awaiting-newpassword'
    const echoText = wasMasked ? '•'.repeat(raw.length || 1) : raw
    const p = promptFor(engineState)

    const result = runCommand(engineState, raw)
    const newLines = [{ type: 'input', text: p + echoText }]
    result.lines.forEach((l) => newLines.push({ type: 'output', text: l }))

    if (result.clear) {
      setLines([])
    } else {
      setLines((ls) => [...ls, ...newLines])
    }
    setEngineState(result.state)

    if (mission && currentStep && currentStep.match(raw, result.state)) {
      markStepDone(mission.id, currentStep.id)
      setLines((ls) => [...ls, { type: 'success', text: `✔ Étape validée : ${currentStep.prompt}` }])
    }
  }

  const onSubmitForm = (e) => {
    e.preventDefault()
    if (input === '') return
    submit(input)
    setInput('')
  }

  if (!activeDevice) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-16 text-center text-term/50 text-sm">
        Aucun cyberdeck actif. Assemble d'abord un appareil.
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-8 w-full grid lg:grid-cols-[1fr_320px] gap-5 flex-1">
      <div
        className="border border-wire rounded-lg bg-black/70 flex flex-col overflow-hidden h-[70vh]"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="px-3 py-2 border-b border-wire text-[10px] text-term/40 flex items-center justify-between flex-shrink-0">
          <span>{activeDevice.name} — {activeDevice.osName}</span>
          <span className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-term/60" />
          </span>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 text-[12.5px] leading-relaxed">
          {lines.map((l, i) => (
            <div
              key={i}
              className={
                l.type === 'input'
                  ? 'text-white/90'
                  : l.type === 'success'
                  ? 'text-term font-semibold'
                  : 'text-term/70 whitespace-pre-wrap'
              }
            >
              {l.text}
            </div>
          ))}
          <form onSubmit={onSubmitForm} className="flex items-center text-white/90">
            <span className="text-term/80 mr-1 whitespace-pre">{promptFor(engineState)}</span>
            <input
              ref={inputRef}
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type={engineState.mode === 'awaiting-password' || engineState.mode === 'awaiting-newpassword' ? 'password' : 'text'}
              className="flex-1 bg-transparent outline-none border-none"
              spellCheck={false}
              autoComplete="off"
            />
          </form>
        </div>
      </div>

      <aside className="space-y-4">
        {mission ? (
          <div className="border border-wire rounded-lg bg-panel/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-white/90">{mission.icon} {mission.title}</div>
              <button onClick={onExitMission} className="text-[10px] text-term/40 hover:text-term">✕</button>
            </div>
            <p className="text-[11px] text-term/50 mb-3 leading-relaxed">{mission.briefing}</p>
            <ol className="space-y-2">
              {mission.steps.map((st, i) => {
                const done = progress.completedSteps.includes(st.id)
                const current = i === currentStepIndex
                return (
                  <li key={st.id} className={['text-[11px] rounded px-2 py-1.5 border', done ? 'border-term/30 text-term/70 bg-term/5' : current ? 'border-term text-white/90' : 'border-wire text-term/30'].join(' ')}>
                    <div className="flex items-start gap-1.5">
                      <span>{done ? '✔' : current ? '▶' : '○'}</span>
                      <span>{st.prompt}</span>
                    </div>
                    {current && <div className="mt-1 text-[10px] text-term/40">indice : <code className="text-amber">{st.hint}</code></div>}
                  </li>
                )
              })}
            </ol>
            {missionDone && (
              <div className="mt-3 text-[11px] text-term bg-term/10 border border-term/40 rounded p-2">{mission.reward}</div>
            )}
          </div>
        ) : (
          <div className="border border-wire rounded-lg bg-panel/50 p-4 text-[11px] text-term/40 leading-relaxed">
            Terminal libre — aucune mission active. Lance une mission depuis l'onglet <strong className="text-term/60">Missions</strong> pour un parcours guidé, ou explore librement (essaie <code className="text-amber">help</code>).
          </div>
        )}
        <button onClick={onBackHome} className="w-full text-[10px] tracking-widest text-term/40 hover:text-term border border-wire rounded px-3 py-2">
          ← RETOUR ACCUEIL
        </button>
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
