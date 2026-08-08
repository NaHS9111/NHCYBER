import React, { useState } from 'react'
import { DeviceProvider, useDevices } from './context/DeviceContext.jsx'
import Home from './components/Home.jsx'
import Builder from './components/Builder.jsx'
import Terminal from './components/Terminal.jsx'
import Missions from './components/Missions.jsx'
import Nav from './components/Nav.jsx'

function Shell() {
  const [view, setView] = useState('home')
  const [activeMissionId, setActiveMissionId] = useState(null)
  const { activeDevice } = useDevices()

  const goToTerminal = (missionId = null) => {
    setActiveMissionId(missionId)
    setView('terminal')
  }

  return (
    <div className="min-h-screen bg-void crt-grid text-term font-mono flex flex-col">
      <Nav view={view} setView={setView} hasDevice={!!activeDevice} />
      <main className="flex-1 flex flex-col">
        {view === 'home' && <Home onBuild={() => setView('builder')} onTerminal={() => goToTerminal(null)} onMissions={() => setView('missions')} />}
        {view === 'builder' && <Builder onDone={() => setView('home')} />}
        {view === 'missions' && <Missions onLaunch={(id) => goToTerminal(id)} />}
        {view === 'terminal' && (
          <Terminal missionId={activeMissionId} onExitMission={() => setActiveMissionId(null)} onBackHome={() => setView('home')} />
        )}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <DeviceProvider>
      <Shell />
    </DeviceProvider>
  )
}
