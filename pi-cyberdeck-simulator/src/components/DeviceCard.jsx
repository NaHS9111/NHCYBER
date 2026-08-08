import React from 'react'
import { useDevices } from '../context/DeviceContext.jsx'

export default function DeviceCard({ device, onSelect }) {
  const { activeDeviceId, removeDevice } = useDevices()
  const active = device.id === activeDeviceId

  return (
    <div
      className={[
        'border rounded-lg p-4 bg-panel/60 transition-all cursor-pointer',
        active ? 'border-term shadow-[0_0_20px_-4px_rgba(0,255,157,0.4)]' : 'border-wire hover:border-term/40',
      ].join(' ')}
      onClick={() => onSelect?.(device.id)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{device.typeIcon}</span>
          <div>
            <div className="font-bold text-sm text-white/90">{device.name}</div>
            <div className="text-[10px] text-term/40 tracking-wide">{device.typeName}</div>
          </div>
        </div>
        {active && <span className="text-[9px] px-2 py-0.5 rounded-full border border-term text-term">ACTIF</span>}
      </div>
      <div className="text-[11px] text-term/50 space-y-0.5">
        <div>Carte : {device.boardName}</div>
        <div>OS : {device.osName}</div>
        <div>Clavier : {device.keyboardName}</div>
      </div>
      <div className="flex justify-end mt-3">
        <button
          onClick={(e) => {
            e.stopPropagation()
            removeDevice(device.id)
          }}
          className="text-[10px] text-red-400/50 hover:text-red-400 tracking-wide"
        >
          DÉMANTELER
        </button>
      </div>
    </div>
  )
}
