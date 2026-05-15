import { useState } from 'react';
import { HelpCircle, Info, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../services/soundService';

interface RegeditSwitchProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

export default function RegeditSwitch({
  label,
  description,
  checked,
  onChange
}: RegeditSwitchProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleToggle = () => {
    const newVal = !checked;
    onChange(newVal);
    if (newVal) {
      sound.playToggleOn();
    } else {
      sound.playToggleOff();
    }
  };

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-3.5 flex flex-col justify-between hover:border-[#ff1b1b]/30 transition-all duration-300 relative group overflow-hidden">
      <div className="flex items-start justify-between gap-2.5">
        
        {/* Anti-Ban & Header */}
        <div className="flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-sans font-semibold text-xs text-gray-200 uppercase tracking-wide group-hover:text-white transition-colors">
              {label}
            </span>
            <span className="bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30 text-[8px] font-bold px-1 rounded-sm uppercase tracking-wider scale-95 shrink-0">
              Anti Ban
            </span>
            
            {/* Help Button */}
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              className="text-gray-500 hover:text-[#ff1b1b] transition-colors p-0.5"
            >
              <HelpCircle size={12} />
            </button>
          </div>
          <p className="text-[10px] text-gray-500 mt-1 mr-2 leading-relaxed font-sans">
            Instalação de script bypass automático.
          </p>
        </div>

        {/* iOS-Style Neon Checkbox Switch */}
        <button
          type="button"
          onClick={handleToggle}
          className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none relative shrink-0 ${
            checked 
              ? 'bg-[#ff1b1b] shadow-[0_0_12px_rgba(255,27,27,0.4)]' 
              : 'bg-[#222] border border-[#333]'
          }`}
        >
          <motion.div
            layout
            className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-md justify-self-start"
            animate={{
              x: checked ? 20 : 0,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {checked && <Check size={10} className="text-[#ff1b1b] stroke-[4]" />}
          </motion.div>
        </button>
      </div>

      {/* Embedded Tooltip Bubble */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2.5 bg-[#050505] border border-[#ff1b1b]/20 rounded-lg p-2.5 text-[9px] text-gray-400 font-mono leading-relaxed relative"
          >
            <div className="absolute top-2 right-2 flex items-center text-[#ffb300]">
              <Info size={9} className="mr-0.5" /> INFO STATUS
            </div>
            <p className="text-gray-300 font-semibold mb-1 uppercase tracking-wide">
              {label} Core
            </p>
            {description}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
