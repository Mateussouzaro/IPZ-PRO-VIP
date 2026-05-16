import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Check, RefreshCw, Smartphone, Target, Shield, Copy, Bot, User, MessageSquare, Zap, Target as Crosshair } from 'lucide-react';
import Markdown from 'react-markdown';
import { sound } from '../services/soundService';
import { generateVipSensiChatResponse, VipSensiChatResponse } from '../services/geminiService';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sensitivities?: {
    arma1Tiro: number;
    metralhadora: number;
    fuzil: number;
    submetralhadora: number;
    espingarda: number;
    dpi: number;
    velocidadeToque: number;
    cursorMovel: number;
  };
  applied?: boolean;
}

interface IpzGeradorSensiVipProps {
  currentDevice: string;
  currentDpi: number;
  onApplySensitivities: (newSensi: {
    arma1Tiro: number;
    metralhadora: number;
    fuzil: number;
    submetralhadora: number;
    espingarda: number;
    dpi: number;
    velocidadeToque: number;
    cursorMovel: number;
  }) => void;
  showToastNotification: (msg: string) => void;
}

export default function IpzGeradorSensiVip({
  currentDevice,
  currentDpi,
  onApplySensitivities,
  showToastNotification,
}: IpzGeradorSensiVipProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `### 🤖 BEM-VINDO À IA IPZ GERADOR SENSI VIP!
      
Faaaala tropinha! Eu sou o seu **IPZ GERADOR SENSI VIP** alimentado por Inteligência Artificial ultra-precisa Militar.

Gostaria de amassar e dar **Full Vermelho** no Free Fire? É só me dizer qual é o seu **aparelho celular** ou selecionar uma das sugestões abaixo. Eu calculo na hora algoritmos secretos de **0 a 200** para bugar as físicas de pixel do seu Android/iOS e travar a mira direta na cabeça!

*Sem enrolação, sem configurações proibidas, 100% Antiban!* 🔥`,
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    { text: 'Sensi de Samsung FULL VERMELHO', icon: '📱' },
    { text: 'Calibrar para Motorola (Mira Leve)', icon: '⚡' },
    { text: 'Sensi Secreta para iPhone 100% HS', icon: '🍎' },
    { text: 'Armas de 1 tiro Sensi (0 a 200)', icon: '🎯' },
  ];

  // Auto scroll chat to bottom when a new message is added or starting animation finishes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    sound.playClick();
    const userMessageId = 'msg_' + Math.random().toString(36).substring(2, 11);
    const updatedMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMessageId,
        role: 'user',
        text: textToSend,
      }
    ];

    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      // Map helper formats chat history for the Gemini API
      const geminiHistory = updatedMessages.slice(1, -1).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const modelResponse: VipSensiChatResponse = await generateVipSensiChatResponse(
        textToSend,
        geminiHistory,
        currentDevice,
        currentDpi
      );

      const botMessageId = 'msg_' + Math.random().toString(36).substring(2, 11);
      setMessages(prev => [
        ...prev,
        {
          id: botMessageId,
          role: 'model',
          text: modelResponse.message,
          sensitivities: modelResponse.hasSensi ? modelResponse.sensitivities : undefined,
          applied: false,
        }
      ]);
      sound.playVIPUpgrade();

    } catch (error) {
      console.error(error);
      showToastNotification('Erro ao gerar sua sensibilidade VIP.');
    } finally {
      setIsLoading(false);
    }
  };

  const applySensiToApp = (messageId: string, sensi: any) => {
    if (!sensi) return;
    sound.playVIPUpgrade();
    onApplySensitivities(sensi);
    
    // Mark as applied in chat history UI
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, applied: true } : m));
    showToastNotification('🎯 SENSI VIP APLICADA NOS SLIDERS COM SUCESSO!');
  };

  return (
    <div className="bg-[#111] border border-zinc-900 rounded-2xl p-4 flex flex-col space-y-3 relative overflow-hidden text-left" id="ipz_gerador_sensi_chat_root">
      {/* Absolute futuristic decorative aura block */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff1b1b]/5 rounded-full blur-2xl pointer-events-none"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="bg-[#ff1b1b]/10 p-1.5 rounded-xl border border-[#ff1b1b]/30 relative">
            <Bot size={18} className="text-[#ff1b1b] filter drop-shadow-[0_0_5px_rgba(255,27,27,0.7)]" />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-zinc-950 animate-pulse"></span>
          </div>
          <div>
            <span className="font-orbitron font-extrabold text-[12px] tracking-widest text-white uppercase block">
              IPZ GERADOR SENSI VIP
            </span>
            <span className="text-[9px] text-gray-500 font-mono tracking-wide flex items-center gap-1">
              <Sparkles size={10} className="text-[#ffb300]" /> GERADOR DE SENSI ESCALA 0 A 200 • ONLINE
            </span>
          </div>
        </div>

        <span className="text-[7.5px] font-mono font-bold text-[#ff1b1b] bg-[#ff1b1b]/10 border border-[#ff1b1b]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
          FULL CAPA 100%
        </span>
      </div>

      {/* Main chat log output */}
      <div 
        ref={scrollRef}
        className="h-[280px] overflow-y-auto pr-1 space-y-3.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent pr-2 relative z-10"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isBot = msg.role === 'model';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className={`flex gap-2 text-left ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-6 h-6 rounded-full bg-[#ff1b1b]/15 border border-[#ff1b1b]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={11} className="text-[#ff1b1b]" />
                  </div>
                )}

                <div className="flex flex-col space-y-1.5 max-w-[85%]">
                  <div 
                    className={`rounded-2xl p-3 text-[11px] font-sans leading-relaxed ${
                      isBot 
                        ? 'bg-zinc-950/70 border border-zinc-900 text-gray-200' 
                        : 'bg-[#ff1b1b] text-white font-medium shadow-[0_3px_10px_rgba(255,27,27,0.15)]'
                    }`}
                  >
                    {isBot ? (
                      <div className="markdown-body prose prose-invert prose-xs leading-normal font-sans tracking-wide">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    ) : (
                      <p>{msg.text}</p>
                    )}
                  </div>

                  {/* Sensitivity preset card attachment inside message block if available */}
                  {isBot && msg.sensitivities && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-[#050505] border border-[#ff1b1b]/20 rounded-xl p-3 space-y-2.5 shadow-md text-left"
                    >
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                        <span className="text-[9px] font-orbitron font-extrabold text-[#ffb300] tracking-wider flex items-center gap-1">
                          <Zap size={10} className="text-[#ffb300] animate-pulse" /> PRESET SENSI VIP DE 0 A 200
                        </span>
                        <span className="text-[7.5px] font-mono text-zinc-500 uppercase">CALIBRAÇÃO INTENSIVA</span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-[9.5px]">
                        <div className="flex justify-between border-b border-zinc-950 pb-0.5">
                          <span className="text-gray-400">Geral:</span>
                          <span className="text-white font-bold">{msg.sensitivities.arma1Tiro}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-950 pb-0.5">
                          <span className="text-gray-400">Red Dot:</span>
                          <span className="text-white font-bold">{msg.sensitivities.metralhadora}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-950 pb-0.5">
                          <span className="text-gray-400">Mira 2x:</span>
                          <span className="text-white font-bold">{msg.sensitivities.fuzil}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-950 pb-0.5">
                          <span className="text-gray-400">Mira 4x:</span>
                          <span className="text-white font-bold">{msg.sensitivities.submetralhadora}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-950 pb-0.5">
                          <span className="text-gray-400">AWM:</span>
                          <span className="text-white font-bold">{msg.sensitivities.espingarda}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-950 pb-0.5">
                          <span className="text-gray-400">DPI:</span>
                          <span className="text-[#ff1b1b] font-bold">{msg.sensitivities.dpi}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-950 pb-0.5 col-span-2">
                          <span className="text-gray-400">Tempo de Toque:</span>
                          <span className="text-[#22c55e] font-bold">{msg.sensitivities.velocidadeToque} ms</span>
                        </div>
                      </div>

                      {/* Apply button trigger */}
                      <button
                        type="button"
                        onClick={() => applySensiToApp(msg.id, msg.sensitivities)}
                        disabled={msg.applied}
                        className={`w-full py-2 px-3 rounded-lg text-[9.5px] font-orbitron font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                          msg.applied 
                            ? 'bg-zinc-900 border border-zinc-850 text-emerald-500 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-[#ff1b1b] to-[#b30000] hover:scale-[1.02] shadow-[0_0_10px_rgba(255,27,27,0.25)] text-white hover:brightness-110 active:scale-95'
                        }`}
                      >
                        {msg.applied ? (
                          <>
                            <Check size={11} />
                            <span>SENSI APLICADA COM SUCESSO!</span>
                          </>
                        ) : (
                          <>
                            <Crosshair size={11} className="animate-spin-slow" />
                            <span>APLICAR NA SENSI DO APP</span>
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}
                </div>

                {!isBot && (
                  <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={10} className="text-white" />
                  </div>
                )}
              </motion.div>
            );
          })}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start gap-2 text-left"
            >
              <div className="w-6 h-6 rounded-full bg-[#ff1b1b]/15 border border-[#ff1b1b]/20 flex items-center justify-center shrink-0">
                <Bot size={11} className="text-[#ff1b1b] animate-spin-slow" />
              </div>
              <div className="bg-zinc-950/70 border border-zinc-900 rounded-2xl p-3 text-[11px] text-gray-500 flex items-center gap-2 font-mono">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff1b1b] animate-bounce" style={{ animationDelay: '0s' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff1b1b] animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff1b1b] animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                </span>
                <span>IPZ calculando sensibilidade full capa...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick suggestions area */}
      <div className="grid grid-cols-2 gap-1.5 font-sans relative z-10" id="quick_suggestions_grid">
        {quickSuggestions.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(s.text)}
            disabled={isLoading}
            className="p-2 border border-zinc-900 hover:border-zinc-800 bg-[#070707] hover:bg-[#121212] rounded-xl text-[9px] font-sans font-medium text-gray-400 hover:text-white transition-colors text-left flex items-center gap-1.5 select-none"
          >
            <span className="text-xs shrink-0">{s.icon}</span>
            <span className="truncate">{s.text}</span>
          </button>
        ))}
      </div>

      {/* Form Action Container */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="flex items-center gap-1.5 bg-[#050505] border border-zinc-900 rounded-xl p-1.5 relative z-10"
        id="ipz_sensi_chat_input_form"
      >
        <input
          type="text"
          value={inputValue}
          disabled={isLoading}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isLoading ? "Carregando coordenadas..." : "Peça aqui a sensibilidade VIP do seu celular..."}
          className="flex-1 bg-transparent text-[11px] placeholder:text-gray-500 text-gray-200 indent-1 focus:outline-hidden disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="bg-transparent hover:bg-zinc-900 hover:text-[#ff1b1b] text-gray-400 p-2 rounded-lg transition-colors duration-200 shrink-0 cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent disabled:text-gray-600"
          title="Enviar Mensagem"
        >
          <Send size={13} />
        </button>
      </form>
    </div>
  );
}
