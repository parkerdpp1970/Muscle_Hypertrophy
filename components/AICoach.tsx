import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatStatus } from '../types';
import { sendMessageToGemini } from '../services/gemini';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

export const AICoach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! I'm your Hypertrophy Science Coach. I can help explain the concepts in the presentation or answer any questions about muscle growth mechanisms. What's on your mind?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<ChatStatus>(ChatStatus.IDLE);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || status === ChatStatus.LOADING) return;

    const userMsg: Message = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setStatus(ChatStatus.LOADING);

    try {
      const responseText = await sendMessageToGemini(userMsg.text);
      const botMsg: Message = { role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
      setStatus(ChatStatus.IDLE);
    } catch (error) {
      console.error(error);
      setStatus(ChatStatus.ERROR);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Simple Markdown Parser
  const parseInline = (text: string) => {
    // Split by **bold**
    const parts = text.split(/(\*\*[^\*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderMessageText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Empty lines
      if (!line.trim()) return <div key={i} className="h-2" />;

      // Headers (## or ###)
      if (line.startsWith('### ')) {
        return <h4 key={i} className="font-bold text-base mt-2 mb-1">{parseInline(line.slice(4))}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={i} className="font-bold text-lg mt-3 mb-2">{parseInline(line.slice(3))}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={i} className="font-bold text-xl mt-4 mb-2">{parseInline(line.slice(2))}</h2>;
      }

      // Bullet points (* or -)
      if (/^[\*\-]\s/.test(line)) {
        return (
          <div key={i} className="flex items-start gap-2 ml-1 mb-1">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-current opacity-60 flex-shrink-0" />
            <span>{parseInline(line.replace(/^[\*\-]\s/, ''))}</span>
          </div>
        );
      }

      // Standard paragraph
      return <p key={i} className="mb-1">{parseInline(line)}</p>;
    });
  };

  return (
    <div className="flex flex-col h-[600px] lg:h-full bg-white dark:bg-slate-800 lg:rounded-none rounded-2xl border-t lg:border-t-0 border-slate-200 dark:border-slate-700 shadow-xl lg:shadow-none overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-indigo-500/50 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 text-white">
          <Bot className="w-5 h-5" />
          <h2 className="font-semibold text-lg">AI Coach</h2>
        </div>
        <div className="bg-white/20 px-2 py-1 rounded text-xs text-white font-medium flex items-center gap-1 backdrop-blur-sm">
          <Sparkles className="w-3 h-3" />
          <span>Gemini 3 Flash</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
              msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-white'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-600'
              }`}
            >
              {renderMessageText(msg.text)}
            </div>
          </div>
        ))}
        {status === ChatStatus.LOADING && (
          <div className="flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
               <Bot size={16} />
             </div>
             <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-200 dark:border-slate-600 shadow-sm">
               <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about volume, intensity, or mechanisms..."
            className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl pl-4 pr-12 py-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400 dark:placeholder-slate-500 transition-colors duration-300 shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || status === ChatStatus.LOADING}
            className="absolute right-2 top-2 p-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded-lg text-white transition-colors shadow-sm"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};