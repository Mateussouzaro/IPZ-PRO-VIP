import { useState, useEffect } from 'react';
import { Activity, Signal, Wifi } from 'lucide-react';

export default function PingMeter() {
  const [ping, setPing] = useState(18);

  useEffect(() => {
    // Latency jitter simulation to make it look active, immersive & responsive
    const interval = setInterval(() => {
      setPing((prev) => {
        const isSpike = Math.random() > 0.88;
        const offset = isSpike 
          ? Math.floor(Math.random() * 45) + 20 
          : Math.floor(Math.random() * 6) - 3;
        
        // Ensure values stay realistic for high-speed fiber standard [10 - 90ms]
        const nextVal = Math.max(12, Math.min(prev + offset, 95));
        return nextVal;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  // Determine indicator color based on milliseconds delay
  const getPingColor = () => {
    if (ping < 35) return 'text-[#22c55e]'; // Great fiber connection (green)
    if (ping < 70) return 'text-[#ffb300]'; // Medium gaming delay (gold / amber)
    return 'text-[#ff1b1b]'; // Poor packet lag (red)
  };

  const getSgColor = (barIndex: number) => {
    if (ping > 75 && barIndex > 1) return 'bg-[#333]';
    if (ping > 45 && barIndex > 3) return 'bg-[#333]';
    if (ping < 35) return 'bg-[#22c55e]';
    if (ping < 70) return 'bg-[#ffb300]';
    return 'bg-[#ff1b1b]';
  };

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-3.5 flex items-center justify-between hover:border-[#ffb300]/20 transition-all duration-300 relative group overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient from-[#ffb300]/3 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>
      
      <div className="flex items-center gap-3">
        {/* Animated Glowing Signal Icon */}
        <div className={`p-2 rounded-lg bg-[#050505] border border-[#222] flex items-center justify-center ${getPingColor()}`}>
          <Wifi size={18} className="animate-pulse" />
        </div>
        <div>
          <div className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">
            PING DO SERVIDOR
          </div>
          <div className="font-orbitron font-extrabold text-sm text-gray-200 tracking-wide flex items-center gap-1.5 mt-0.5">
            SEU PING:{' '}
            <span className={`${getPingColor()} filter drop-shadow-[0_0_4px_currentColor] transition-colors`}>
              {ping} ms
            </span>
          </div>
        </div>
      </div>

      {/* Retro bar signal indicator strength */}
      <div className="flex items-end gap-1 h-6">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className={`w-1 rounded-full transition-colors duration-500`}
            style={{
              height: `${(index / 5) * 100}%`,
              backgroundColor: ping > 75 && index > 2 ? '#333' : ping > 45 && index > 4 ? '#333' : ping < 35 ? '#22c55e' : '#ffb300'
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
