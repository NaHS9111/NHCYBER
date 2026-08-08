import React, { useState } from 'react'
import { DeviceProvider, useDevices } from './context/DeviceContext.jsx'
import Home from './components/Home.jsx'
import Builder from './components/Builder.jsx'
import UseDevice from './components/UseDevice.jsx'
import Missions from './components/Missions.jsx'
import Nav from './components/Nav.jsx'

function Shell() {
  const [view, setView] = useState('home')
  const [activeMissionId, setActiveMissionId] = useState(null)
  const { activeDevice } = useDevices()

  const goToUse = (missionId = null) => {
    setActiveMissionId(missionId)
    setView('use')
  }

  return (
    <div className="h-screen bg-void crt-grid text-term font-mono flex flex-col overflow-hidden">
      <Nav view={view} setView={setView} hasDevice={!!activeDevice} />
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {view === 'home' && <Home onBuild={() => setView('builder')} onUse={() => goToUse(null)} onMissions={() => setView('missions')} />}
        {view === 'builder' && <Builder onDone={() => setView('home')} />}
        {view === 'missions' && <Missions onLaunch={(id) => goToUse(id)} />}
        {view === 'use' && (
          <UseDevice missionId={activeMissionId} onExitMission={() => setActiveMissionId(null)} onBackHome={() => setView('home')} />
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
