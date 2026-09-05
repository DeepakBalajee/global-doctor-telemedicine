'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Send, Lock, Stethoscope, User } from 'lucide-react'
import { ConsultationMessage } from '@/types/consultation'
import { UserRole } from '@/types/auth'
import { Button } from '@/components/ui/Button'
import { fetchTypingSignal, sendTypingSignal } from '@/lib/notifications/notification-client'
import { fetchConsultationMessages, sendConsultationMessage } from '@/lib/consultations/consultation-client'

export interface ConsultationChatPanelProps {
  appointmentId: string
  activeUserId: string
  activeUserRole: UserRole
  messages?: ConsultationMessage[]
  onSendMessage?: (text: string) => Promise<void>
}

export const ConsultationChatPanel: React.FC<ConsultationChatPanelProps> = ({
  appointmentId,
  activeUserId,
  activeUserRole,
  messages: externalMessages,
  onSendMessage: externalOnSendMessage,
}) => {
  const [internalMessages, setInternalMessages] = useState<ConsultationMessage[]>([])
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [peerTyping, setPeerTyping] = useState<{ isTyping: boolean; userName?: string }>({ isTyping: false })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)

  const loadMessages = React.useCallback(async () => {
    if (!externalMessages) {
      const list = await fetchConsultationMessages(appointmentId)
      setInternalMessages(list)
    }
  }, [appointmentId, externalMessages])

  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 3000) // Poll for incoming messages
    return () => clearInterval(interval)
  }, [loadMessages])

  const activeMessages = externalMessages || internalMessages

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeMessages])

  // Poll peer typing status
  useEffect(() => {
    async function checkTyping() {
      const res = await fetchTypingSignal(appointmentId)
      setPeerTyping(res)
    }
    const interval = setInterval(checkTyping, 2500)
    return () => clearInterval(interval)
  }, [appointmentId])

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)

    sendTypingSignal(appointmentId, true)
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    typingTimerRef.current = setTimeout(() => {
      sendTypingSignal(appointmentId, false)
    }, 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || isSubmitting) return

    setIsSubmitting(true)
    if (externalOnSendMessage) {
      await externalOnSendMessage(text)
    } else {
      await sendConsultationMessage(appointmentId, text)
      await loadMessages()
    }
    setText('')
    sendTypingSignal(appointmentId, false)
    setIsSubmitting(false)
  }

  return (
    <div className="flex flex-col h-[520px] rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
      
      {/* CHAT HEADER */}
      <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-teal-500 text-white flex items-center justify-center font-bold text-xs">
            {activeUserRole === UserRole.DOCTOR ? <User className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-tight">Secure In-Consultation Chat</h4>
            <p className="text-[10px] text-teal-300 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> End-to-End Encrypted Room
            </p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30">
          ACTIVE
        </span>
      </div>

      {/* MESSAGES SCROLL AREA */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
        {activeMessages.map((m) => {
          const isMe = m.senderId === activeUserId || (activeUserRole === UserRole.DOCTOR && m.senderRole === UserRole.DOCTOR) || (activeUserRole === UserRole.PATIENT && m.senderRole === UserRole.PATIENT)

          return (
            <div
              key={m.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold mb-1">
                <span>{m.senderName}</span>
                <span>•</span>
                <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {/* MESSAGE BUBBLE WITH ANTI-XSS ESCAPED RENDERING */}
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  isMe
                    ? 'bg-teal-700 text-white rounded-br-none shadow-xs'
                    : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none shadow-xs'
                }`}
              >
                {/* Safe plain text rendering protects against XSS injection */}
                {m.message}
              </div>
            </div>
          )
        })}

        {peerTyping.isTyping && (
          <div className="text-[11px] font-bold text-teal-600 animate-pulse italic flex items-center gap-1.5 pt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-teal-500" />
            {peerTyping.userName || 'Peer'} is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT FORM */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Type secure medical message..."
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none"
        />

        <Button
          type="submit"
          variant="teal"
          size="sm"
          disabled={!text.trim() || isSubmitting}
          className="font-bold text-xs gap-1"
        >
          <Send className="w-3.5 h-3.5" /> Send
        </Button>
      </form>

    </div>
  )
}
