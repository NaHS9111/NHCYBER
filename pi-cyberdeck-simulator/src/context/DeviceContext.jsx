import React, { createContext, useContext, useEffect, useState } from 'react'
import { MISSIONS } from '../data/missions'

const STORAGE_KEY = 'cyberdeck-sim:v1'
const DeviceCtx = createContext(null)

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('Lecture localStorage impossible :', e)
  }
  return { devices: [], activeDeviceId: null, missionProgress: {} }
}

export function DeviceProvider({ children }) {
  const [store, setStore] = useState(loadInitial)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    } catch (e) {
      console.warn('Écriture localStorage impossible :', e)
    }
  }, [store])

  const addDevice = (device) => {
    setStore((s) => ({ ...s, devices: [...s.devices, device], activeDeviceId: device.id }))
  }

  const removeDevice = (id) => {
    setStore((s) => ({
      ...s,
      devices: s.devices.filter((d) => d.id !== id),
      activeDeviceId: s.activeDeviceId === id ? null : s.activeDeviceId,
    }))
  }

  const setActiveDevice = (id) => setStore((s) => ({ ...s, activeDeviceId: id }))

  const markStepDone = (missionId, stepId) => {
    setStore((s) => {
      const mission = MISSIONS.find((m) => m.id === missionId)
      const prev = s.missionProgress[missionId] || { completedSteps: [] }
      if (prev.completedSteps.includes(stepId)) return s
      const completedSteps = [...prev.completedSteps, stepId]
      const done = mission ? mission.steps.every((st) => completedSteps.includes(st.id)) : false
      return {
        ...s,
        missionProgress: { ...s.missionProgress, [missionId]: { completedSteps, done } },
      }
    })
  }

  const resetMission = (missionId) => {
    setStore((s) => {
      const next = { ...s.missionProgress }
      delete next[missionId]
      return { ...s, missionProgress: next }
    })
  }

  const activeDevice = store.devices.find((d) => d.id === store.activeDeviceId) || null

  const value = {
    devices: store.devices,
    activeDevice,
    activeDeviceId: store.activeDeviceId,
    missionProgress: store.missionProgress,
    addDevice,
    removeDevice,
    setActiveDevice,
    markStepDone,
    resetMission,
  }

  return <DeviceCtx.Provider value={value}>{children}</DeviceCtx.Provider>
}

export function useDevices() {
  const ctx = useContext(DeviceCtx)
  if (!ctx) throw new Error('useDevices doit être utilisé sous DeviceProvider')
  return ctx
}
