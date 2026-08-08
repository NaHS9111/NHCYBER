import React from 'react'

const ITEMS = [
  { id: 'home', label: 'Accueil' },
  { id: 'builder', label: 'Assemblage' },
  { id: 'missions', label: 'Missions' },
  { id: 'use', label: 'Utiliser' },
]

export default function Nav({ view, setView, hasDevice }) {
  return (
    <header className="border-b border-wire bg-panel/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-glow text-term">
          <span className="text-lg">🍓📟</span>
          <span className="font-bold tracking-widest text-sm">CYBERDECK SIMULATOR</span>
        </div>
        <nav className="flex gap-1">
          {ITEMS.map((it) => {
            const disabled = (it.id === 'missions' || it.id === 'use') && !hasDevice
            const active = view === it.id
            return (
              <button
                key={it.id}
                disabled={disabled}
                onClick={() => setView(it.id)}
                title={disabled ? 'Assemble d\'abord un cyberdeck' : undefined}
                className={[
                  'px-3 py-1.5 rounded text-xs tracking-widest transition-colors border',
                  active ? 'bg-term/10 border-term text-term' : 'border-transparent text-term/50 hover:text-term hover:border-wire',
                  disabled ? 'opacity-30 cursor-not-allowed hover:text-term/50 hover:border-transparent' : '',
                ].join(' ')}
              >
                {it.label.toUpperCase()}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
