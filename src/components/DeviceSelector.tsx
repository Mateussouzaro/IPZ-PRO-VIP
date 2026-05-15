import { useState, useEffect } from 'react';
import { Search, Smartphone, RefreshCw, Check } from 'lucide-react';
import { sound } from '../services/soundService';

interface DeviceSelectorProps {
  selectedDevice: string;
  onSelect: (device: string) => void;
}

export default function DeviceSelector({
  selectedDevice,
  onSelect
}: DeviceSelectorProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const popularModels = [
    'ASUS ROG Phone 8 Pro',
    'POCO F5 Pro',
    'Samsung Galaxy S24 Ultra',
    'iPhone 15 Pro Max',
    'Nubia RedMagic 9 Pro',
    'Xiaomi 14 Ultra',
    'OnePlus 12',
    'POCO X6 Pro',
    'Samsung Galaxy A55 5G',
    'iPhone 13 Pro',
    'Google Pixel 8 Pro',
    'Motorola Edge 50 Ultra'
  ];

  // Auto-detection simulated routine
  useEffect(() => {
    if (!selectedDevice) {
      const userAgent = navigator.userAgent;
      if (/Android/i.test(userAgent)) {
        onSelect('POCO F5 Pro (Autodetect)');
      } else if (/iPhone/i.test(userAgent)) {
        onSelect('iPhone 15 Pro Max (Autodetect)');
      } else {
        onSelect('ASUS ROG Phone 8 Pro (Autodetect)');
      }
    }
  }, [selectedDevice, onSelect]);

  const handleManualSwitch = (device: string) => {
    onSelect(device);
    setIsOpen(false);
    sound.playVIPUpgrade();
  };

  const filteredDevices = popularModels.filter((model) =>
    model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-4 hover:border-[#ff1b1b]/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <Smartphone size={16} className="text-[#ff1b1b]" />
          <span className="font-sans font-semibold text-xs tracking-wide uppercase text-gray-300">
            DISPOSITIVO ALVO
          </span>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            setIsOpen(!isOpen);
          }}
          className="flex items-center gap-0.5 text-[9px] font-mono tracking-widest text-[#ffb300] hover:text-white border border-[#ffb300]/30 hover:border-white px-2 py-1 rounded bg-[#000]/40 transition-all"
        >
          <RefreshCw size={10} className="mr-0.5 animate-spin-slow" />
          {isOpen ? 'FECHAR' : 'TROCAR'}
        </button>
      </div>

      <div className="bg-[#050505] p-3 rounded-lg border border-[#222] flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[8px] text-[#ff1b1b] font-mono font-bold tracking-widest uppercase">
            CALIBRADO AUTOMÁTICO
          </span>
          <span className="text-xs font-sans font-bold text-gray-200 mt-0.5">
            {selectedDevice || 'Buscando dispositivo...'}
          </span>
        </div>
        <span className="w-2 h-2 rounded-full bg-[#22c55e] pulse-glow box-glow-green"></span>
      </div>

      {isOpen && (
        <div className="mt-3.5 pt-3.5 border-t border-[#222]">
          <div className="relative mb-3">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Pesquisar seu celular..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#050505] border border-[#222] focus:border-[#ff1b1b]/60 rounded-lg pl-8 p-2 text-xs font-sans text-gray-200 outline-none placeholder:text-gray-600"
            />
          </div>

          <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
            {filteredDevices.map((device) => {
              const isActive = selectedDevice.startsWith(device);
              return (
                <button
                  key={device}
                  onClick={() => handleManualSwitch(device)}
                  className={`w-full text-left p-2 rounded-md text-xs font-sans transition-all flex items-center justify-between ${
                    isActive 
                      ? 'bg-[#ff1b1b]/10 text-white font-bold border border-[#ff1b1b]/30' 
                      : 'hover:bg-[#1a1a1a] text-gray-400'
                  }`}
                >
                  <span>{device}</span>
                  {isActive && <Check size={12} className="text-[#ff1b1b]" />}
                </button>
              );
            })}
            {filteredDevices.length === 0 && (
              <button
                onClick={() => handleManualSwitch(search)}
                className="w-full text-center py-3 text-xs text-[#ffb300] bg-[#111]/80 hover:bg-[#ffb300]/10 flex flex-col items-center justify-center rounded-lg border border-dashed border-[#ffb300]/30 transition-all font-sans"
              >
                <span>Celular "{search}" não localizado na nuvem.</span>
                <span className="text-[9px] text-gray-500 font-mono mt-0.5">CLIQUE PARA FORÇAR SELEÇÃO DIRETA</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
