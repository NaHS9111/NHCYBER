import React from 'react'
import { useDevices } from '../context/DeviceContext.jsx'
import DeviceCard from './DeviceCard.jsx'

export default function Home({ onBuild, onTerminal, onMissions }) {
  const { devices, setActiveDevice, activeDevice } = useDevices()

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 w-full">
      <section className="mb-12 relative overflow-hidden rounded-xl border border-wire p-8 bg-panel/40">
        <div className="absolute left-0 right-0 h-px bg-term/60 shadow-[0_0_12px_2px_rgba(0,255,157,0.5)] animate-scan pointer-events-none" />
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
          Simulateur de <span className="text-term text-glow">Cyberdeck</span> DIY
        </h1>
        <p className="text-sm text-term/60 max-w-2xl leading-relaxed mb-6">
          Assemble virtuellement un <strong className="text-white/80">Raspberry Pi Cyberdeck</strong> ou un{' '}
          <strong className="text-white/80">BlackBerry Pi</strong> (le mod culte : un Pi Zero greffé dans un clavier
          BlackBerry), flashe un OS, puis entraîne-toi à l'utiliser via un terminal simulé et des missions guidées —
          entièrement hors ligne, dans un labo fictif isolé.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={onBuild} className="px-5 py-2.5 rounded bg-term/10 border border-term text-term text-xs tracking-widest hover:bg-term/20 transition-colors">
            🛠 ASSEMBLER UN CYBERDECK
          </button>
          <button
            onClick={onMissions}
            disabled={!activeDevice}
            className="px-5 py-2.5 rounded border border-wire text-term/60 text-xs tracking-widest hover:border-term/40 hover:text-term disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            🎯 MISSIONS GUIDÉES
          </button>
          <button
            onClick={onTerminal}
            disabled={!activeDevice}
            className="px-5 py-2.5 rounded border border-wire text-term/60 text-xs tracking-widest hover:border-term/40 hover:text-term disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ⌨ OUVRIR LE TERMINAL
          </button>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs tracking-[0.2em] text-term/50">MES CYBERDECKS ({devices.length})</h2>
        </div>
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
