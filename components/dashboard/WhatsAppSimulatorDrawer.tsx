'use client';

import React, { useState, useEffect } from 'react';
import { WhatsAppMessage } from '@/lib/types';
import { X, Send, CheckCheck, RefreshCw, MessageSquare } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onWebhookTriggered?: () => void;
  familyId?: string;
  parentName?: string;
  parentPhone?: string;
}

export default function WhatsAppSimulatorDrawer({
  isOpen,
  onClose,
  onWebhookTriggered,
  familyId = '',
  parentName = 'Parents',
  parentPhone = '',
}: Props) {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [customReply, setCustomReply] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/reminders/messages?familyId=${encodeURIComponent(familyId)}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, familyId]);

  if (!isOpen) return null;

  const handleSimulateReply = async (replyText: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/reminders/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: parentPhone || '+919123456789',
          body: replyText,
          familyId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchMessages();
        if (onWebhookTriggered) {
          onWebhookTriggered();
        }
      }
    } finally {
      setLoading(false);
      setCustomReply('');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md h-full bg-[#EFEAE2] flex flex-col shadow-2xl relative">
        {/* WhatsApp Top Header Bar */}
        <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-700 border border-white/30 flex items-center justify-center font-bold text-sm">
              👨‍🦳
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-tight">{parentName}</h3>
              <p className="text-[11px] text-emerald-200">{parentPhone} · WhatsApp</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchMessages}
              className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
              title="Refresh messages"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
              title="Close simulator"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-amber-50 border-b border-amber-200/60 px-4 py-2 text-[11px] text-amber-800 flex items-center gap-2">
          <span>⚡</span>
          <span>
            <strong>Interactive Two-Way Simulator:</strong> Outgoing alerts and incoming WhatsApp confirmations appear here.
          </span>
        </div>

        {/* Message Thread Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-xs text-stone-500">
              No messages sent yet. Trigger a reminder from the dashboard!
            </div>
          ) : (
            messages.map((msg) => {
              const isOutbound = msg.direction === 'outbound';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isOutbound ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm relative ${
                      isOutbound
                        ? 'bg-white text-stone-800 rounded-tl-xs border border-stone-200/50'
                        : 'bg-[#D9FDD3] text-stone-900 rounded-tr-xs border border-emerald-200/40'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.body}</p>
                    <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-stone-400">
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {isOutbound && <CheckCheck className="w-3.5 h-3.5 text-blue-500 inline" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Action Presets */}
        <div className="bg-white/90 border-t border-stone-200 p-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-stone-500">Quick Test Action:</span>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSimulateReply('DONE')}
            className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Simulate Reply: <strong>&quot;DONE&quot;</strong></span>
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (customReply.trim()) {
              handleSimulateReply(customReply.trim());
            }
          }}
          className="bg-[#F0F2F5] px-3 py-2.5 flex items-center gap-2 border-t border-stone-200"
        >
          <input
            type="text"
            placeholder="Type custom WhatsApp reply (e.g. DONE)..."
            value={customReply}
            onChange={(e) => setCustomReply(e.target.value)}
            className="flex-1 px-4 py-2 rounded-full bg-white border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
          <button
            type="submit"
            disabled={loading || !customReply.trim()}
            className="w-8 h-8 rounded-full bg-[#00A884] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#008f6f] transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
