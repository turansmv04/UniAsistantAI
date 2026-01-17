'use client';
import { useChat } from 'ai/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function GeniChat() {
  const [budget, setBudget] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('uni_budget');
      return saved ? parseFloat(saved) : 0;
    }
    return 0;
  });

  const [days, setDays] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('uni_days');
      return saved ? parseInt(saved) : 1;
    }
    return 1;
  });

  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    body: { currentBudget: budget, daysRemaining: days },
    onResponse: async (res) => {
      const content = await res.text();
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'assistant', content }]);

      const bMatch = content.match(/Balans: \*\*(-?\d+(\.\d+)?)/i);
      const dMatch = content.match(/Qalan Gün: \*\*(\d+)/i);
      
      if (bMatch) {
        setBudget(parseFloat(bMatch[1]));
        localStorage.setItem('uni_budget', bMatch[1]);
      }
      if (dMatch) {
        setDays(parseInt(dMatch[1]));
        localStorage.setItem('uni_days', dMatch[1]);
      }
    }
  });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  if (!mounted) return null;

  return (
    <main className="flex flex-col h-screen bg-[#000814] text-white overflow-hidden">
      <div className="flex flex-col items-center pt-10 pb-4 shrink-0 relative text-center border-b border-white/5">
        <div className="w-32 h-32 bg-blue-500 rounded-full blur-[60px] absolute opacity-20 animate-pulse" />
        <h1 className="text-3xl font-bold tracking-[0.2em] z-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
          UNIASSISTANT
        </h1>
        <div className="flex gap-4 mt-3 z-10">
          <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-1 rounded-full text-[10px] text-blue-400 font-bold">
            BALANS: {budget.toFixed(2)} AZN
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-1 rounded-full text-[10px] text-blue-400 font-bold">
            MÜDDƏT: {days} GÜN
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-[25%] py-8 space-y-6 scrollbar-hide">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-30 space-y-4">
            <Sparkles size={40} className="text-blue-400" />
            <p className="text-sm italic uppercase tracking-wider">{`"100 manat 5 gün" yazaraq başla.`}</p>
          </div>
        )}
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end gap-3 max-w-[90%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-blue-600' : 'bg-gray-800'}`}>
                  {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-blue-600 rounded-br-none whitespace-pre-wrap shadow-lg' : 'bg-gray-900 rounded-tl-none border border-gray-800 shadow-2xl shadow-blue-500/5'}`}>
                  {m.role === 'user' ? (
                    m.content
                  ) : (
                    <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-strong:text-blue-400 prose-hr:border-white/10 prose-hr:my-3">
                      <ReactMarkdown>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && <div className="ml-12 text-[10px] text-blue-400/50 animate-pulse uppercase font-bold tracking-widest">UniAssistant düşünür...</div>}
      </div>

      <div className="p-6 md:px-[25%] bg-gradient-to-t from-[#000814] to-transparent">
        <form onSubmit={handleSubmit} className="relative group max-w-4xl mx-auto">
          <input 
            className="w-full bg-gray-900/60 border border-gray-800 rounded-2xl py-5 px-6 pr-16 focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder-gray-600 shadow-xl" 
            value={input} 
            placeholder="Mesajınızı yazın..." 
            onChange={handleInputChange} 
          />
          <button type="submit" disabled={isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/20">
            <Send size={18} />
          </button>
        </form>
      </div>
    </main>
  );
}