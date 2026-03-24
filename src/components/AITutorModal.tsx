import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Question } from '../data/questions';
import { GoogleGenAI } from '@google/genai';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null;
  userAnswer: boolean | undefined;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export function AITutorModal({ isOpen, onClose, question, userAnswer }: AITutorModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<GoogleGenAI | null>(null);
  const chatRef = useRef<ReturnType<GoogleGenAI['chats']['create']> | null>(null);
  const msgIdCounter = useRef(0);
  const nextMsgId = () => `msg-${++msgIdCounter.current}`;

  useEffect(() => {
    if (isOpen && question) {
      // Initialize chat
      setMessages([]);
      setIsLoading(true);
      
      const initChat = async () => {
        try {
          if (!aiRef.current) {
            // WARNING: VITE_ env vars are embedded in the client bundle.
            // For production, route AI requests through a backend proxy.
            aiRef.current = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY });
          }
          
          const systemInstruction = `Sei un istruttore di scuola guida italiano esperto, paziente e incoraggiante. 
Il tuo compito è aiutare lo studente a capire perché ha sbagliato una domanda dell'esame teorico per la Patente B.
Usa un tono amichevole, chiaro e conciso. Fai esempi pratici se necessario.
Non dare solo la risposta, ma spiega il ragionamento logico o la regola del codice della strada che sta alla base.

Contesto della domanda attuale:
Domanda: "${question.text}"
Risposta corretta: ${question.answer ? 'Vero' : 'Falso'}
Risposta data dallo studente: ${userAnswer === undefined ? 'Non data' : (userAnswer ? 'Vero' : 'Falso')}
Spiegazione ufficiale (se presente): ${question.explanation || 'Nessuna'}
Categoria: ${question.category.replace(/-/g, ' ')}

Inizia la conversazione salutando lo studente e spiegando in modo semplice e diretto perché la sua risposta è errata, basandoti sul contesto fornito.`;

          chatRef.current = aiRef.current.chats.create({
            model: 'gemini-2.0-flash',
            config: {
              systemInstruction,
              temperature: 0.7,
            }
          });

          const response = await chatRef.current.sendMessage({ message: "Ciao istruttore, ho sbagliato questa domanda. Puoi aiutarmi a capire perché?" });
          
          setMessages([
            { id: nextMsgId(), role: 'user', content: "Ciao istruttore, ho sbagliato questa domanda. Puoi aiutarmi a capire perché?" },
            { id: nextMsgId(), role: 'model', content: response.text ?? 'Nessuna risposta ricevuta. Riprova.' }
          ]);
        } catch (error) {
          console.error("AI Tutor Error:", error);
          setMessages([
            { id: 'err', role: 'model', content: "Scusa, sto avendo problemi di connessione al momento. Riprova più tardi." }
          ]);
        } finally {
          setIsLoading(false);
        }
      };

      initChat();
    }
  }, [isOpen, question, userAnswer]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: nextMsgId(), role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { id: nextMsgId(), role: 'model', content: response.text ?? 'Nessuna risposta ricevuta. Riprova.' }]);
    } catch (error) {
      console.error("AI Tutor Error:", error);
      setMessages(prev => [...prev, { id: nextMsgId(), role: 'model', content: "Si è verificato un errore di comunicazione. Riprova." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && question && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/90 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-surface border-2 border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.15)] z-[101] h-[85vh] sm:h-[600px] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-surface-border bg-surface/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg uppercase tracking-widest text-primary">
                    AI <span className="text-indigo-400">Tutor</span>
                  </h2>
                  <p className="text-[10px] font-mono text-secondary uppercase tracking-widest">
                    Assistente Virtuale PatenteNext
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-none shrink-0 hover:bg-danger/20 hover:text-danger">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Question Context */}
            <div className="p-4 border-b border-surface-border bg-background/50 shrink-0">
              <div className="font-mono text-[10px] text-secondary uppercase tracking-widest mb-2">Domanda in analisi:</div>
              <p className="text-sm font-medium text-primary leading-snug">"{question.text}"</p>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-background/30">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-surface border border-surface-border text-primary' : 'bg-indigo-500/20 border border-indigo-500/50 text-indigo-400'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[80%] p-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-surface border border-surface-border text-primary' : 'bg-indigo-500/10 border border-indigo-500/30 text-primary/90'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 text-indigo-400 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs font-mono uppercase tracking-widest">Elaborazione...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-surface-border bg-surface/80 shrink-0">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Chiedi un chiarimento all'istruttore..."
                  className="flex-1 bg-background border border-surface-border px-4 py-2 text-sm text-primary focus:outline-none focus:border-indigo-500/50 transition-colors"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  className="bg-indigo-500 text-white hover:bg-indigo-600 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
