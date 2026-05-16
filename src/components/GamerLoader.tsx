import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Shield, Cpu, Activity, AlertTriangle } from 'lucide-react';
import { sound } from '../services/soundService';

interface GamerLoaderProps {
  onComplete: () => void;
}

export default function GamerLoader({ onComplete }: GamerLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = [
    'BOOTING IPZ_SENSI_PREMIUM KERNEL...',
    'CONNECTING SECURE DATABASE...',
    'LOADING HIGH-FREQ ENGINES...',
    'LOAD REGEDIT KERNEL STAGE-1...',
    'OPTIMIZING DUAL-CHANNEL RESISTORS...',
    'ENGAGING ANTI-BAN STEROID SHIELD...',
    'CALIBRATING SCREEN FREQUENCY...',
    'INJECTING SENSITIVITY CALIBRATION...',
    '100% REGEDIT LOADED SUCCESSFULLY!'
  ];

  useEffect(() => {
    sound.playClick();
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            sound.playVIPUpgrade();
            onComplete();
          }, 600);
          return 100;
        }
        
        // Progress speed simulation
        const increment = Math.floor(Math.random() * 8) + 4;
        const next = Math.min(prev + increment, 100);

        // Update status text progressively
        const nextStatusIndex = Math.floor((next / 100) * (statuses.length - 1));
        if (nextStatusIndex !== statusIndex) {
          setStatusIndex(nextStatusIndex);
          if (next % 2 === 0) {
            sound.playClick();
          }
        }
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete, statusIndex]);

  return (
    <div className="fixed inset-0 bg-[#050505] text-[#ff1b1b] flex flex-col items-center justify-center font-orbitron select-none z-50 overflow-hidden cyber-grid">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#ff1b1b] to-transparent shadow-[0_0_15px_#ff1b1b] opacity-70"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="text-center px-4 max-w-sm flex flex-col items-center"
      >
        {/* Crown Glowing Logo */}
        <div className="relative mb-6">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute -inset-4 rounded-full border border-dashed border-[#ff1b1b]/30"
          ></motion.div>
          <motion.div 
             animate={{ scale: [1, 1.08, 1] }}
             transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
             className="w-24 h-24 rounded-2xl bg-gradient-to-b from-[#111] to-[#000] border-2 border-[#ff1b1b]/80 flex items-center justify-center shadow-[0_0_25px_rgba(255,27,27,0.35)]"
          >
            <Crown size={48} className="text-[#ff1b1b] fill-[#ff1b1b]/20 filter drop-shadow-[0_0_8px_#ff1b1b]" />
          </motion.div>
          <div className="absolute -top-1 -right-1 bg-[#ffb300] text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-black uppercase tracking-widest pulse-glow">
            VIP
          </div>
        </div>

        <h1 className="text-2xl font-black tracking-widest text-white mb-1">
          IPZ <span className="text-[#ff1b1b]">SENSI PREMIUM</span>
        </h1>
        <p className="text-[10px] text-[#ffb300] font-bold tracking-[0.25em] h-4 uppercase translate-y-1 mb-8">
          MOBILES MODS • PREMIUM HUD
        </p>

        {/* Console loading details */}
        <div className="w-72 bg-[#111]/80 border border-[#ff1b1b]/20 rounded-xl p-4 text-left font-mono text-[10px] text-gray-400 mb-6 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-1 font-bold text-gray-600 text-[8px]">
            v2.8.4-RELEASE
          </div>
          <div className="flex items-center gap-1.5 text-[#ffb300]/80 font-bold uppercase mb-2">
            <Activity size={10} className="animate-pulse" />
            <span>CONSOLE DE CONEXÃO</span>
          </div>
          <div className="space-y-1 h-12 overflow-hidden select-none">
            <div className="text-green-500 flex items-center gap-1">
              <Shield size={10} /> COLD SHIELD ACTIVE (100% SECURE)
            </div>
            <div className="text-gray-300 truncate font-mono text-[9px]">
              {statuses[statusIndex]}
            </div>
            <div className="text-gray-500 font-mono text-[8px]">
              MEM_ADDR: 0x7FFA8F4 {progress * 1324} / STACK_LOCK: TRUE
            </div>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="w-64">
          <div className="flex justify-between items-center text-xs ml-1 mr-1 mb-1.5">
            <span className="text-gray-400 text-[10px]">AQUECENDO REGEDIT</span>
            <span className="text-[#ff1b1b] font-bold text-[11px] font-mono">{progress}%</span>
          </div>
          <div className="w-full bg-[#111] border border-[#ff1b1b]/30 rounded-full h-3 overflow-hidden p-0.5 shadow-[inset_0_1px_5px_rgba(0,0,0,0.8)]">
            <motion.div
              style={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-[#ff1b1b] via-[#ff4747] to-[#ffb300] h-full rounded-full shadow-[0_0_10px_#ff1b1b]"
            ></motion.div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-1 text-[9px] text-gray-500">
          <Cpu size={11} className="text-[#ff1b1b]" />
          <span>SISTEMA 100% ANTI BAN DETECTOR</span>
        </div>
      </motion.div>
    </div>
  );
}
