'use client';

import { useState, useRef, useEffect } from 'react';

interface SpotData {
  name: string;
  locality: string;
  description: string;
  environment: string;
  seabed: string;
  depth: string;
  species: { name: string; rating: number; months: number[] }[];
  techniques: { name: string; rating: number; notes: string }[];
  bestBaits: string[];
  bestArtificials: string[];
  bestTime: {
    hours: string;
    tide: string;
    weather: string;
    moon: string;
  };
  tips: string[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SpotChatAIProps {
  spot: SpotData;
  regionName: string;
}

const SUGGESTED_QUESTIONS = [
  "Che esca uso per le spigole?",
  "Qual è l'orario migliore?",
  "Che attrezzatura mi serve?",
  "Si pesca bene oggi?",
];

export default function SpotChatAI({ spot, regionName }: SpotChatAIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const MAX_FREE_MESSAGES = 5;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    if (messageCount >= MAX_FREE_MESSAGES) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Hai raggiunto il limite di ${MAX_FREE_MESSAGES} messaggi gratuiti! 🎣\n\nPer continuare a chattare, iscriviti alla nostra newsletter e ricevi accesso illimitato all'assistente AI + consigli esclusivi ogni settimana!\n\n👉 [Iscriviti alla Newsletter](/registrazione)`,
        },
      ]);
      return;
    }

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/spot-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          spot: {
            name: spot.name,
            locality: spot.locality,
            region: regionName,
            description: spot.description,
            environment: spot.environment,
            seabed: spot.seabed,
            depth: spot.depth,
            species: spot.species.map((s) => ({
              name: s.name,
              rating: s.rating,
              months: s.months,
            })),
            techniques: spot.techniques,
            bestBaits: spot.bestBaits,
            bestArtificials: spot.bestArtificials,
            bestTime: spot.bestTime,
            tips: spot.tips,
          },
          history: messages.slice(-6), // Last 6 messages for context
        }),
      });

      const data = await response.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Mi dispiace, c\'è stato un errore. Riprova tra poco! 🐟',
          },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
        setMessageCount((prev) => prev + 1);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Ops! Problema di connessione. Riprova! 🎣',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden">
      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">🤖</span>
            <p className="text-slate-400 mb-4">
              Ciao! Sono l&apos;esperto AI di <strong className="text-cyan-400">{spot.name}</strong>.
              <br />
              Chiedimi qualsiasi cosa su questo spot!
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-full transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-700 text-slate-200'
              }`}
            >
              {message.role === 'assistant' && (
                <span className="text-xs text-slate-400 block mb-1">🤖 Esperto AI</span>
              )}
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-slate-200 px-4 py-2 rounded-2xl">
              <span className="text-xs text-slate-400 block mb-1">🤖 Esperto AI</span>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Counter */}
      <div className="px-4 py-2 bg-slate-900/50 text-center">
        <span className="text-xs text-slate-500">
          {messageCount}/{MAX_FREE_MESSAGES} messaggi gratuiti utilizzati
        </span>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              messageCount >= MAX_FREE_MESSAGES
                ? 'Iscriviti per continuare...'
                : `Chiedi qualcosa su ${spot.name}...`
            }
            disabled={isLoading || messageCount >= MAX_FREE_MESSAGES}
            className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-full text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || messageCount >= MAX_FREE_MESSAGES}
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-600 text-white font-bold rounded-full transition-colors"
          >
            {isLoading ? '...' : '→'}
          </button>
        </div>
      </form>
    </div>
  );
}

