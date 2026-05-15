import { Volume2 } from 'lucide-react';
import { sound } from '../services/soundService';

interface SensiSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  icon?: React.ReactNode;
  onChange: (val: number) => void;
}

export default function SensiSlider({
  label,
  value,
  min,
  max,
  unit = '',
  icon,
  onChange
}: SensiSliderProps) {
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    onChange(val);
    
    // Play subtle high-frequency synthetic tone for real-time tick on changes
    if (val % 8 === 0) {
      sound.playClick();
    }
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-3.5 hover:border-[#ff1b1b]/40 transition-all duration-300 relative overflow-hidden group">
      {/* Background glow when hovered */}
      <div className="absolute inset-0 bg-radial-gradient from-[#ff1b1b]/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-gray-300">
          {icon && <span className="text-[#ff1b1b] filter drop-shadow-[0_0_4px_rgba(255,27,27,0.5)]">{icon}</span>}
          <span className="font-sans font-medium text-xs tracking-wide uppercase text-gray-400 group-hover:text-white transition-colors">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#050505] px-2.5 py-0.5 rounded-md border border-[#222]">
          <span className="font-orbitron font-bold text-xs text-[#ffb300] tracking-wider">
            {value}
          </span>
          {unit && <span className="font-mono text-[9px] text-[#ff1b1b] uppercase font-semibold">{unit}</span>}
        </div>
      </div>

      <div className="relative flex items-center mt-1">
        {/* Custom Glowing Slider with styled handle */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleSliderChange}
          className="w-full h-1.5 bg-[#1a1a1a] rounded-full appearance-none cursor-pointer focus:outline-none accent-[#ff1b1b]"
          style={{
            background: `linear-gradient(to right, #ff1b1b 0%, #ff1b1b ${percentage}%, #1a1a1a ${percentage}%, #1a1a1a 100%)`
          }}
        />
        
        {/* Absolute Slider Glow */}
        <div 
          className="absolute h-1.5 bg-[#ff1b1b]/30 rounded-full blur-[3px] pointer-events-none"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Decorative slider endpoints */}
      <div className="flex justify-between text-[8px] text-gray-600 mt-1.5 font-mono font-medium">
        <span>MIN ({min})</span>
        <span>MID ({(min+max)/2})</span>
        <span>MAX ({max})</span>
      </div>
    </div>
  );
}
