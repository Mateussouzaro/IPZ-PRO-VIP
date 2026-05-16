import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Video, Sparkles, Brain, Clock, ShieldAlert, CheckCircle2, AlertTriangle, Play } from 'lucide-react';
import Markdown from 'react-markdown';
import { sound } from '../services/soundService';
import { analyzeGameplayWithGemini } from '../services/geminiService';
import { saveCoachingRequest, updateCoachingResult, CoachingRequest } from '../services/firebaseService';
import GamerAvatar from './GamerAvatar';

interface CoachIAProps {
  userId: string;
  dpiValue: number;
  sensitivities: {
    arma1Tiro: number;
    metralhadora: number;
    fuzil: number;
    submetralhadora: number;
    espingarda: number;
  };
  boosterValue: number;
  regeditsActive: string[];
  activePlayerId?: string;
}

export default function CoachIA({
  userId,
  dpiValue,
  sensitivities,
  boosterValue,
  regeditsActive,
  activePlayerId = 'nobru'
}: CoachIAProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<CoachingRequest | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startAnalysis = async (fileName: string, fileSizeStr: string) => {
    sound.playVIPUpgrade();
    setIsUploading(true);
    setUploadProgress(10);

    // Simulated high-speed upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleAnalysisStart(fileName, fileSizeStr);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 200);
  };

  const handleAnalysisStart = async (fileName: string, fileSizeStr: string) => {
    setIsUploading(false);
    setIsAnalyzing(true);
    sound.playBoosterClick();

    // Create a local coaching record in our database if user is logged on
    const requestId = 'coach_' + Math.random().toString(36).substring(2, 11);
    
    // Call our actual Gemini model analyzer with current active player ID persona
    const advice = await analyzeGameplayWithGemini(
      fileName,
      fileSizeStr,
      dpiValue,
      sensitivities,
      boosterValue,
      regeditsActive,
      activePlayerId
    );

    const coachingTicket: CoachingRequest = {
      id: requestId,
      userId: userId || 'anonymous_user',
      videoName: fileName,
      videoSize: fileSizeStr,
      videoDuration: '12 min',
      status: 'completed',
      analysisResult: advice,
    };

    if (userId) {
      try {
        await saveCoachingRequest(coachingTicket);
      } catch (e) {
        console.warn('Silent save fail due to local mode', e);
      }
    }

    setCurrentTicket(coachingTicket);
    setIsAnalyzing(false);
    sound.playVIPUpgrade();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const sizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      startAnalysis(file.name, sizeFormatted);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      startAnalysis(file.name, sizeFormatted);
    }
  };

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-4 hover:border-[#ff1b1b]/20 transition-all duration-300">
      
      {/* Title Header */}
      <div className="flex items-center gap-2 mb-3.5">
        <div className="bg-[#ff1b1b]/10 p-1.5 rounded-lg border border-[#ff1b1b]/20">
          <Brain size={16} className="text-[#ff1b1b] filter drop-shadow-[0_0_3px_#ff1b1b]" />
        </div>
        <div>
          <span className="font-sans font-bold text-xs tracking-wider uppercase text-gray-200 block">
            COACH IA + SENSI VIP
          </span>
          <span className="text-[10px] text-[#ffb300] font-mono tracking-wide">
            AUDITORIA DE CLIPS COM MODELO INTELIGENTE
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isUploading && !isAnalyzing && !currentTicket && (
          <motion.div
            key="upload-box"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => {
              sound.playClick();
              fileInputRef.current?.click();
            }}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center relative ${
              dragActive 
                ? 'border-[#ff1b1b] bg-[#ff1b1b]/5 shadow-[0_0_15px_rgba(255,27,27,0.15)]' 
                : 'border-zinc-800 bg-[#050505] hover:border-[#ff1b1b]/45 hover:bg-[#111]/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp4,.mov,.avi,.mkv,.webm"
              className="hidden"
              onChange={handleFileChange}
            />
            
            <div className="w-12 h-12 rounded-full bg-[#111] border border-zinc-800 flex items-center justify-center mb-3">
              <Upload size={22} className="text-gray-400 group-hover:text-white transition-colors" />
            </div>

            <span className="text-xs font-sans font-bold text-gray-200">
              Envie sua partida / clipe de jogo
            </span>
            <p className="text-[10px] text-gray-500 mt-1 leading-normal max-w-[240px]">
              Arraste o arquivo ou clique para selecionar de sua galeria móvel.
            </p>

            <div className="mt-4 flex items-center gap-3 bg-[#111]/90 py-1.5 px-3 rounded-md border border-[#222]">
              <div className="flex items-center gap-1 text-[8px] text-[#ffb300] font-mono">
                <Clock size={10} /> ATÉ 20 MIN
              </div>
              <div className="w-[1px] h-2 bg-gray-800"></div>
              <div className="flex items-center gap-1 text-[8px] text-[#ff1b1b] font-mono uppercase font-semibold">
                <ShieldAlert size={10} /> 1GB MÁX
              </div>
            </div>

            <span className="text-[8px] text-gray-600 mt-4 tracking-wider uppercase">
              SUPORTA: MP4, MOV, AVI, MKV, WEBM
            </span>
          </motion.div>
        )}

        {isUploading && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#050505] border border-[#222] rounded-xl p-8 text-center flex flex-col items-center"
          >
            <div className="relative mb-5 w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#ff1b1b]/30 animate-spin-slow"></div>
              <Video className="text-[#ff1b1b] animate-bounce" size={26} />
            </div>
            <span className="font-orbitron text-xs text-white uppercase tracking-widest font-bold">
              UPLOADING GAME PLAY CLIP...
            </span>
            <span className="text-[10px] font-mono text-gray-500 mt-1">
              Transferindo canais de vídeo para a rede SENSIPRO IA
            </span>

            {/* Progress line */}
            <div className="w-56 mt-6">
              <div className="flex justify-between text-[9px] font-mono text-gray-400 mb-1 px-1">
                <span>PROGRESS</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-[#111] h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-[#ff1b1b] h-full transition-all duration-300 shadow-[0_0_8px_#ff1b1b]" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        )}

        {isAnalyzing && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#050505] border border-[#222] rounded-xl p-8 text-center flex flex-col items-center cyber-grid relative overflow-hidden"
          >
            <div className="absolute top-2 right-2 flex items-center gap-1 text-[#ffb300] text-[8px] font-mono border border-[#ffb300]/20 bg-[#ffb300]/5 px-2 py-0.5 rounded-sm">
              <Sparkles size={8} className="animate-pulse" /> CLOUD DEEP ANALYZER
            </div>

            <div className="mb-5 flex justify-center">
              <GamerAvatar id={activePlayerId} size="lg" animateBreathe={true} showScanner={true} />
            </div>
            
            <span className="font-orbitron text-xs text-[#ffb300] font-bold uppercase tracking-widest">
              SISTEMA ANALISANDO PUXADAS CAPA
            </span>
            <span className="text-[9px] font-mono text-gray-400 mt-1.5 leading-relaxed max-w-[210px] text-center">
              Avaliando DPI ({dpiValue}), multiplicador ({boosterValue}x) e calibrando com IA de {activePlayerId.toUpperCase()}...
            </span>

            {/* Glowing neon spinner dots */}
            <div className="flex gap-2 mt-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-[#ff1b1b]"
                  animate={{ scale: [0.6, 1.2, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.2, ease: "easeInOut" }}
                ></motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {currentTicket && (
          <motion.div
            key="coaching-result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#050505] border border-[#222] rounded-xl p-4 text-left relative overflow-hidden group"
          >
            <div className="absolute top-2 right-2">
              <span className="bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                AUDITORIA CONCLUÍDA
              </span>
            </div>

            {/* Speaking character box */}
            <div className="flex items-center gap-3 mb-4 p-2.5 rounded-lg bg-[#111]/80 border border-zinc-900">
              <GamerAvatar id={activePlayerId} size="md" isSpeaking={true} showScanner={false} />
              <div>
                <span className="text-[11px] font-orbitron font-extrabold text-white tracking-widest block">
                  ANÁLISE DE {activePlayerId.toUpperCase()} IA
                </span>
                <span className="text-[9px] text-[#22c55e] font-mono tracking-wide block uppercase animate-pulse">
                  MICROFONE ATIVO • ANALISADO
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#ffb300] font-bold text-xs font-mono uppercase tracking-wide mb-3">
              <CheckCircle2 size={14} className="text-[#22c55e]" />
              <span>PAUTA DE AVALIAÇÃO DE JOGO</span>
            </div>

            {/* Render suggestion output */}
            <div className="max-h-[350px] overflow-y-auto bg-[#111] rounded-lg p-3.5 border border-[#222] prose prose-invert prose-xs text-xs font-sans text-gray-300 leading-relaxed scrollbar-thin">
              <div className="markdown-body">
                <Markdown>{currentTicket.analysisResult}</Markdown>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentTicket(null);
                }}
                className="flex-1 bg-gradient-to-r from-[#111] to-[#222] hover:from-[#ff1b1b] hover:to-[#ff4c4c] text-slate-300 hover:text-white border border-zinc-800 hover:border-transparent font-sans py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300"
              >
                Submeter nova partida
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
