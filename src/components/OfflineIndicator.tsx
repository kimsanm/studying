import React from 'react';
import { Wifi, WifiOff, CloudLightning } from 'lucide-react';

interface OfflineIndicatorProps {
  isOfflineMode: boolean;
  onToggleOffline: (offline: boolean) => void;
}

export default function OfflineIndicator({ isOfflineMode, onToggleOffline }: OfflineIndicatorProps) {
  return (
    <div className="bg-slate-900 border-b border-slate-950 text-xs py-2.5 px-3 md:px-6 flex flex-wrap justify-between items-center gap-2 shadow-sm text-slate-200">
      <div className="flex items-center gap-2 text-slate-300">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-[10px] text-slate-400">SERVER STATUS: SECURE CONNECTION ACTIVE (AWS/Cloud Run)</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Offline Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-slate-300 select-none">
          {isOfflineMode ? (
            <span className="flex items-center gap-1.5 font-medium text-amber-300">
              <WifiOff className="w-3.5 h-3.5" />
              របៀបសិក្សាក្រៅបណ្តាញ (Offline Active)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-slate-400">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              សិក្សាអនឡាញធម្មតា (Online Active)
            </span>
          )}
          <button
            onClick={() => onToggleOffline(!isOfflineMode)}
            id="toggle-offline-btn"
            className={`cursor-pointer px-2.5 py-0.5 rounded text-[10px] font-bold uppercase transition ${
              isOfflineMode
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                : 'bg-slate-700 hover:bg-slate-650 text-slate-200'
            }`}
          >
            {isOfflineMode ? 'ទៅ Online' : 'សាកល្បង Offline'}
          </button>
        </div>

        {isOfflineMode && (
          <div className="hidden sm:flex items-center gap-1.5 text-amber-500 text-[11px] animate-pulse">
            <CloudLightning className="w-3.5 h-3.5" />
            <span>មេរៀនដែលបានទាញយករួច អាចបើកមើលបានទោះអត់អុិនធឺណិត!</span>
          </div>
        )}
      </div>
    </div>
  );
}
