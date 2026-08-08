import React from 'react'
import { MISSIONS } from '../data/missions.js'
import { useDevices } from '../context/DeviceContext.jsx'

export default function Missions({ onLaunch }) {
  const { missionProgress } = useDevices()

  return (
    <div className="max-w-5xl mx-auto px-5 py-10 w-full">
      <h1 className="text-lg font-bold text-white mb-1">Missions guidées</h1>
      <p className="text-xs text-term/50 mb-8 max-w-2xl leading-relaxed">
        Des scénarios pas-à-pas pour apprendre à utiliser ton cyberdeck, du premier démarrage à la reconnaissance
        réseau — toujours dans le labo fictif isolé fourni avec le simulateur, jamais sur un système réel.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {MISSIONS.map((m) => {
          const prog = missionProgress[m.id] || { completedSteps: [] }
          const done = prog.completedSteps.length >= m.steps.length
          const started = prog.completedSteps.length > 0
          const lockedBy = (m.requires || []).find((r) => !(missionProgress[r]?.completedSteps.length >= (MISSIONS.find((mm) => mm.id === r)?.steps.length || 0)))

          return (
            <button
              key={m.id}
              onClick={() => !lockedBy && onLaunch(m.id)}
              disabled={!!lockedBy}
              className={[
                'text-left p-4 rounded-lg border transition-all',
                done ? 'border-term/50 bg-term/5' : lockedBy ? 'border-wire opacity-40 cursor-not-allowed' : 'border-wire hover:border-term/40',
              ].join(' ')}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-bold text-white/90">{m.icon} {m.title}</div>
                {done && <span className="text-[9px] px-2 py-0.5 rounded-full border border-term text-term">TERMINÉ</span>}
                {!done && started && <span className="text-[9px] px-2 py-0.5 rounded-full border border-amber text-amber">EN COURS</span>}
              </div>
              <div className="text-[10px] text-term/40 mb-2">{m.difficulty} · {m.steps.length} étapes</div>
              <p className="text-[11px] text-term/50 leading-relaxed line-clamp-3">{m.briefing}</p>
              {lockedBy && (
                <div className="mt-2 text-[10px] text-red-400/60">
                  🔒 Termine d'abord « {MISSIONS.find((mm) => mm.id === lockedBy)?.title} »
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
