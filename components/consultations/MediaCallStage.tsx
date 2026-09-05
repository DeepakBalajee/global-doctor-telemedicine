'use client'

import React, { useState } from 'react'
import { Video, VideoOff, Mic, MicOff, PhoneOff, Wifi, ShieldCheck, User } from 'lucide-react'
import { MediaCallState } from '@/types/consultation'
import { Button } from '@/components/ui/Button'

export interface MediaCallStageProps {
  participantName: string
  participantRoleLabel: string
  consultationType: string
  onEndCallClick: () => void
}

export const MediaCallStage: React.FC<MediaCallStageProps> = ({
  participantName,
  participantRoleLabel,
  consultationType,
  onEndCallClick,
}) => {
  const [callState, setCallState] = useState<MediaCallState>({
    isMicMuted: false,
    isCameraOff: false,
    connectionStatus: 'CONNECTED',
  })

  const isAudioOnly = consultationType === 'ONLINE_AUDIO'

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[450px] sm:min-h-[520px] bg-slate-950 text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-800 p-4 sm:p-6">
      
      {/* STAGE TOP BAR */}
      <div className="w-full flex items-center justify-between text-xs z-10 bg-slate-900/60 backdrop-blur-xs p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-extrabold text-white">{participantName}</span>
          <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
            {participantRoleLabel}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
          <Wifi className="w-3.5 h-3.5" />
          <span>{callState.connectionStatus}</span>
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
        </div>
      </div>

      {/* VIDEO / AUDIO CANVAS AREA */}
      <div className="flex-1 w-full my-4 relative flex items-center justify-center rounded-xl bg-slate-900/80 border border-slate-800/80 overflow-hidden">
        {!isAudioOnly && !callState.isCameraOff ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
            {/* SIMULATED HIGH DEFINITION VIDEO FEED */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="z-10 flex flex-col items-center space-y-3">
              <div className="h-24 w-24 rounded-full bg-slate-800 border-2 border-teal-500/50 flex items-center justify-center shadow-2xl">
                <User className="h-12 w-12 text-teal-400" />
              </div>
              <p className="text-xs font-bold text-slate-300">Live Encrypted Video Stream (HD)</p>
            </div>

            {/* SELF PREVIEW PIP */}
            <div className="absolute bottom-3 right-3 h-28 w-20 sm:h-32 sm:w-24 rounded-xl bg-slate-900 border border-slate-700 shadow-xl overflow-hidden flex items-center justify-center">
              <span className="text-[9px] font-bold text-slate-400">Self (HD)</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 text-center p-6">
            <div className="h-28 w-28 rounded-full bg-slate-800/80 border-2 border-slate-700 flex items-center justify-center shadow-xl">
              <User className="h-14 w-14 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">{participantName}</h4>
              <p className="text-xs text-slate-400">
                {isAudioOnly ? 'Audio Consultation Active' : 'Camera is Turned Off'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CALL CONTROL BAR */}
      <div className="z-10 flex items-center justify-center gap-4 bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-800">
        
        {/* MIC TOGGLE */}
        <button
          type="button"
          onClick={() => setCallState({ ...callState, isMicMuted: !callState.isMicMuted })}
          className={`p-3 rounded-full transition-all ${
            callState.isMicMuted
              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
              : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
          title={callState.isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {callState.isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* CAMERA TOGGLE (VIDEO CALLS ONLY) */}
        {!isAudioOnly && (
          <button
            type="button"
            onClick={() => setCallState({ ...callState, isCameraOff: !callState.isCameraOff })}
            className={`p-3 rounded-full transition-all ${
              callState.isCameraOff
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
            title={callState.isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {callState.isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>
        )}

        {/* END CALL BUTTON */}
        <Button
          type="button"
          variant="primary"
          onClick={onEndCallClick}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-3 rounded-full gap-2 shadow-lg shadow-red-600/30"
        >
          <PhoneOff className="w-4 h-4" /> End Call
        </Button>

      </div>

    </div>
  )
}
