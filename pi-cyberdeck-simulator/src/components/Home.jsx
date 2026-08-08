import React, { useMemo } from 'react'
import { useDevices } from '../context/DeviceContext.jsx'
import DeviceCard from './DeviceCard.jsx'
import DeckScene from '../three/DeckScene.jsx'
import { createScreenCanvas, drawScreen } from '../three/screenRenderer.js'

export default function Home({ onBuild, onUse, onMissions }) {
  const { devices, setActiveDevice, activeDevice } = useDevices()
  const typeId = activeDevice?.config?.typeId || activeDevice?.typeId

  const screenCanvas = useMemo(() => {
    if (!typeId) return null
    const c = createScreenCanvas(typeId)
    drawScreen(c, {
      mode: 'terminal',
      deviceName: activeDevice.name,
      osName: activeDevice.osName,
      lines: [
        { type: 'output', text: 'Système prêt.' },
        { type: 'input', text: `trainee@${activeDevice.boardShort || 'pi'}:~$ ` },
      ],
      promptText: '',
      input: '',
      cursorOn: true,
    })
    return c
  }, [activeDevice?.id, typeId])

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 w-full">
      <section className="mb-12 relative overflow-hidden rounded-xl border border-wire bg-panel/40">
        <div className="grid md:grid-cols-2 gap-0 items-stretch">
          <div className="p-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
              Simulateur de <span className="text-term text-glow">Cyberdeck</span> DIY
            </h1>
            <p className="text-sm text-term/60 leading-relaxed mb-6">
              Assemble en 3D un <strong className="text-white/80">Raspberry Pi Cyberdeck</strong> ou un{' '}
              <strong className="text-white/80">BlackBerry Pi</strong> (le mod culte : un Pi Zero greffé dans un clavier
              BlackBerry). Vue éclatée, flash de l'OS, puis sers-toi vraiment de l'appareil — le terminal tourne sur sa
              propre dalle et les touches s'enfoncent quand tu tapes.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={onBuild} className="px-5 py-2.5 rounded bg-term/10 border border-term text-term text-xs tracking-widest hover:bg-term/20 transition-colors">
                🛠 ASSEMBLER EN 3D
              </button>
              <button
                onClick={onMissions}
                disabled={!activeDevice}
                className="px-5 py-2.5 rounded border border-wire text-term/60 text-xs tracking-widest hover:border-term/40 hover:text-term disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                🎯 MISSIONS
              </button>
              <button
                onClick={onUse}
                disabled={!activeDevice}
                className="px-5 py-2.5 rounded border border-wire text-term/60 text-xs tracking-widest hover:border-term/40 hover:text-term disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ⌨ UTILISER L'APPAREIL
              </button>
            </div>
          </div>

          {/* Aperçu 3D de l'appareil actif */}
          <div className="relative min-h-[280px] overflow-hidden bg-gradient-to-br from-[#0b1219] to-[#05070a] border-t md:border-t-0 md:border-l border-wire">
            {activeDevice && screenCanvas ? (
              <>
                <div className="absolute left-0 right-0 h-px bg-term/50 shadow-[0_0_12px_2px_rgba(0,255,157,0.45)] animate-scan pointer-events-none z-10" />
                <DeckScene
                  config={activeDevice.config || { typeId, board: activeDevice.boardShort }}
                  screenCanvas={screenCanvas}
                  explode={0}
                  screenOn
                  cameraPreset="build"
                  autoRotate
                />
                <div className="absolute bottom-3 left-4 text-[10px] text-term/40 tracking-widest pointer-events-none">
                  {activeDevice.name.toUpperCase()}
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                <div>
                  <div className="text-4xl mb-3 opacity-40">🍓📟</div>
                  <p className="text-[11px] text-term/30 leading-relaxed">
                    Aucun appareil actif.<br />Assemble ton premier cyberdeck pour le voir apparaître ici.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xs tracking-[0.2em] text-term/50 mb-4">MES CYBERDECKS ({devices.length})</h2>
        {devices.length === 0 ? (
          <div className="border border-dashed border-wire rounded-lg p-8 text-center text-term/30 text-xs">
            Aucun appareil assemblé pour l'instant. Lance l'assemblage pour créer ton premier cyberdeck.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((d) => (
              <DeviceCard key={d.id} device={d} onSelect={setActiveDevice} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-14 border-t border-wire pt-6 text-[11px] text-term/30 leading-relaxed">
        <p>
          ⚠️ Ceci est un simulateur pédagogique fermé : aucune commande n'agit sur un vrai système ou réseau. Les
          missions se déroulent dans un labo fictif isolé, à but exclusif d'apprentissage.
        </p>
      </section>
    </div>
  )
}
