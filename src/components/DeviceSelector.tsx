import { useState, useEffect } from 'react';
import { Search, Smartphone, RefreshCw, Check, Sparkles, Activity } from 'lucide-react';
import { sound } from '../services/soundService';

interface DeviceSelectorProps {
  selectedDevice: string;
  onSelect: (device: string) => void;
  showToastNotification?: (msg: string) => void;
}

// Global smartphone database categorized by brands for the entire world
const ALL_DEVICES = [
  // Samsung
  { brand: 'Samsung', model: 'Samsung Galaxy S24 Ultra' },
  { brand: 'Samsung', model: 'Samsung Galaxy S24+' },
  { brand: 'Samsung', model: 'Samsung Galaxy S24' },
  { brand: 'Samsung', model: 'Samsung Galaxy S23 Ultra' },
  { brand: 'Samsung', model: 'Samsung Galaxy S23 FE' },
  { brand: 'Samsung', model: 'Samsung Galaxy S22 Ultra' },
  { brand: 'Samsung', model: 'Samsung Galaxy S21 FE' },
  { brand: 'Samsung', model: 'Samsung Galaxy S20 FE' },
  { brand: 'Samsung', model: 'Samsung Galaxy A55 5G' },
  { brand: 'Samsung', model: 'Samsung Galaxy A54 5G' },
  { brand: 'Samsung', model: 'Samsung Galaxy A35 5G' },
  { brand: 'Samsung', model: 'Samsung Galaxy A34 5G' },
  { brand: 'Samsung', model: 'Samsung Galaxy A15 5G' },
  { brand: 'Samsung', model: 'Samsung Galaxy A14 5G' },
  { brand: 'Samsung', model: 'Samsung Galaxy M54 5G' },
  { brand: 'Samsung', model: 'Samsung Galaxy M34 5G' },
  { brand: 'Samsung', model: 'Samsung Galaxy Note 20 Ultra' },

  // Xiaomi & POCO
  { brand: 'Xiaomi/Poco', model: 'POCO F5 Pro' },
  { brand: 'Xiaomi/Poco', model: 'POCO F5' },
  { brand: 'Xiaomi/Poco', model: 'POCO X6 Pro' },
  { brand: 'Xiaomi/Poco', model: 'POCO X6' },
  { brand: 'Xiaomi/Poco', model: 'POCO X3 Pro' },
  { brand: 'Xiaomi/Poco', model: 'POCO X3 NFC' },
  { brand: 'Xiaomi/Poco', model: 'POCO M6 Pro' },
  { brand: 'Xiaomi/Poco', model: 'Redmi Note 13 Pro 5G' },
  { brand: 'Xiaomi/Poco', model: 'Redmi Note 13 4G' },
  { brand: 'Xiaomi/Poco', model: 'Redmi Note 12 Pro' },
  { brand: 'Xiaomi/Poco', model: 'Redmi Note 11S' },
  { brand: 'Xiaomi/Poco', model: 'Redmi 12 5G' },
  { brand: 'Xiaomi/Poco', model: 'Xiaomi 14 Ultra' },
  { brand: 'Xiaomi/Poco', model: 'Xiaomi 13T Pro' },
  { brand: 'Xiaomi/Poco', model: 'Xiaomi 12 Lite' },

  // Apple
  { brand: 'Apple', model: 'iPhone 15 Pro Max' },
  { brand: 'Apple', model: 'iPhone 15 Pro' },
  { brand: 'Apple', model: 'iPhone 15 Plus' },
  { brand: 'Apple', model: 'iPhone 15' },
  { brand: 'Apple', model: 'iPhone 14 Pro Max' },
  { brand: 'Apple', model: 'iPhone 14 Pro' },
  { brand: 'Apple', model: 'iPhone 13 Pro Max' },
  { brand: 'Apple', model: 'iPhone 13' },
  { brand: 'Apple', model: 'iPhone 12 Pro' },
  { brand: 'Apple', model: 'iPhone 12' },
  { brand: 'Apple', model: 'iPhone 11 Pro Max' },
  { brand: 'Apple', model: 'iPhone 11' },
  { brand: 'Apple', model: 'iPhone XR' },
  { brand: 'Apple', model: 'iPhone 8 Plus' },

  // Motorola
  { brand: 'Motorola', model: 'Motorola Edge 50 Ultra' },
  { brand: 'Motorola', model: 'Motorola Edge 50 Pro' },
  { brand: 'Motorola', model: 'Motorola Edge 50 Neo' },
  { brand: 'Motorola', model: 'Motorola Edge 40 Neo' },
  { brand: 'Motorola', model: 'Motorola G84 5G' },
  { brand: 'Motorola', model: 'Motorola G54 5G' },
  { brand: 'Motorola', model: 'Motorola G34' },
  { brand: 'Motorola', model: 'Motorola G24 Power' },
  { brand: 'Motorola', model: 'Motorola G200 5G' },
  { brand: 'Motorola', model: 'Motorola Edge 30 Ultra' },

  // Realme
  { brand: 'Realme', model: 'Realme 12 Pro+ 5G' },
  { brand: 'Realme', model: 'Realme 11 Pro+' },
  { brand: 'Realme', model: 'Realme GT5 Pro' },
  { brand: 'Realme', model: 'Realme GT Neo 6' },
  { brand: 'Realme', model: 'Realme C67' },
  { brand: 'Realme', model: 'Realme C55' },
  { brand: 'Realme', model: 'Realme 10 Pro' },

  // Infinix
  { brand: 'Infinix', model: 'Infinix Note 40 Pro' },
  { brand: 'Infinix', model: 'Infinix Note 35 Pro' },
  { brand: 'Infinix', model: 'Infinix GT 20 Pro' },
  { brand: 'Infinix', model: 'Infinix Hot 40 Pro' },
  { brand: 'Infinix', model: 'Infinix Hot 30i' },
  { brand: 'Infinix', model: 'Infinix Zero 30 5G' },

  // ASUS
  { brand: 'ASUS', model: 'ASUS ROG Phone 8 Pro' },
  { brand: 'ASUS', model: 'ASUS ROG Phone 7 Ultimate' },
  { brand: 'ASUS', model: 'ASUS ROG Phone 6D' },
  { brand: 'ASUS', model: 'ASUS Zenfone 10' },

  // OnePlus & OPPO
  { brand: 'OnePlus/Oppo', model: 'OnePlus 12' },
  { brand: 'OnePlus/Oppo', model: 'OnePlus Nord 3' },
  { brand: 'OnePlus/Oppo', model: 'OnePlus Ace 3' },
  { brand: 'OnePlus/Oppo', model: 'Oppo Find X7 Ultra' },
  { brand: 'OnePlus/Oppo', model: 'Oppo Reno 11 Pro' },
  { brand: 'OnePlus/Oppo', model: 'Oppo A78 5G' },

  // Vivo, Tecno & Others
  { brand: 'Outros', model: 'Tecno Pova 6 Pro' },
  { brand: 'Outros', model: 'Tecno Camon 30 Premier' },
  { brand: 'Outros', model: 'Vivo X100 Pro' },
  { brand: 'Outros', model: 'Vivo V30 Pro' },
  { brand: 'Outros', model: 'Google Pixel 8 Pro' },
  { brand: 'Outros', model: 'Google Pixel 7a' },
  { brand: 'Outros', model: 'Sony Xperia 1 V' },
  { brand: 'Outros', model: 'Huawei Mate 60 Pro' },
  { brand: 'Outros', model: 'Nubia RedMagic 9 Pro' },
  { brand: 'Outros', model: 'ZTE Blade V50' }
];

export function detectDeviceBrandAndModel(): { brand: string; model: string; detected: boolean } {
  const ua = navigator.userAgent;
  
  // Checking for Android first
  if (/Android/i.test(ua)) {
    // Check Samsung patterns
    if (/SAMSUNG|SM-/i.test(ua)) {
      const smMatch = ua.match(/SM-[A-Z0-9]+/i);
      const modelCode = smMatch ? smMatch[0] : '';
      
      if (modelCode) {
        if (/S928/i.test(modelCode)) return { brand: 'Samsung', model: 'Samsung Galaxy S24 Ultra', detected: true };
        if (/S926/i.test(modelCode)) return { brand: 'Samsung', model: 'Samsung Galaxy S24+', detected: true };
        if (/S921/i.test(modelCode)) return { brand: 'Samsung', model: 'Samsung Galaxy S24', detected: true };
        if (/S918/i.test(modelCode)) return { brand: 'Samsung', model: 'Samsung Galaxy S23 Ultra', detected: true };
        if (/S916/i.test(modelCode)) return { brand: 'Samsung', model: 'Samsung Galaxy S23+', detected: true };
        if (/S911/i.test(modelCode)) return { brand: 'Samsung', model: 'Samsung Galaxy S23', detected: true };
        if (/S908/i.test(modelCode)) return { brand: 'Samsung', model: 'Samsung Galaxy S22 Ultra', detected: true };
        if (/G998/i.test(modelCode)) return { brand: 'Samsung', model: 'Samsung Galaxy S21 Ultra', detected: true };
        if (/G990/i.test(modelCode)) return { brand: 'Samsung', model: 'Samsung Galaxy S21 FE', detected: true };
        if (/G780|G781/i.test(modelCode)) return { brand: 'Samsung', model: 'Samsung Galaxy S20 FE', detected: true };
        if (/A556/i.test(modelCode)) return { brand: 'Samsung', model: 'Samsung Galaxy A55 5G', detected: true };
        if (/A546/i.test(modelCode)) return { brand: 'Samsung', model: 'Samsung Galaxy A54 5G', detected: true };
        if (/A356/i.test(modelCode)) return { brand: 'Samsung', model: 'Samsung Galaxy A35 5G', detected: true };
        if (/A346/i.test(modelCode)) return { brand: 'Samsung', model: 'Samsung Galaxy A34 5G', detected: true };
        if (/A156|A155/i.test(modelCode)) return { brand: 'Samsung', model: 'Samsung Galaxy A15 5G', detected: true };
        if (/A146|A145/i.test(modelCode)) return { brand: 'Samsung', model: 'Samsung Galaxy A14 5G', detected: true };
        if (/M546/i.test(modelCode)) return { brand: 'Samsung', model: 'Samsung Galaxy M54 5G', detected: true };
        if (/M346/i.test(modelCode)) return { brand: 'Samsung', model: 'Samsung Galaxy M34 5G', detected: true };
        return { brand: 'Samsung', model: `Samsung (SM-${modelCode.replace('SM-', '')})`, detected: true };
      }
      return { brand: 'Samsung', model: 'Samsung Galaxy Series', detected: true };
    }

    // Check Xiaomi, POCO and Redmi
    if (/Xiaomi|Redmi|Poco|M20|M21|MI\s/i.test(ua)) {
      if (/POCO/i.test(ua)) {
        if (/F5 Pro/i.test(ua)) return { brand: 'Xiaomi/Poco', model: 'POCO F5 Pro', detected: true };
        if (/F5/i.test(ua)) return { brand: 'Xiaomi/Poco', model: 'POCO F5', detected: true };
        if (/X6 Pro/i.test(ua)) return { brand: 'Xiaomi/Poco', model: 'POCO X6 Pro', detected: true };
        if (/X6/i.test(ua)) return { brand: 'Xiaomi/Poco', model: 'POCO X6', detected: true };
        if (/X3 Pro/i.test(ua)) return { brand: 'Xiaomi/Poco', model: 'POCO X3 Pro', detected: true };
        if (/X3 NFC/i.test(ua)) return { brand: 'Xiaomi/Poco', model: 'POCO X3 NFC', detected: true };
        if (/M6 Pro/i.test(ua)) return { brand: 'Xiaomi/Poco', model: 'POCO M6 Pro', detected: true };
        return { brand: 'Xiaomi/Poco', model: 'POCO Gaming Series', detected: true };
      }
      if (/Redmi/i.test(ua)) {
        if (/Note 13 Pro/i.test(ua)) return { brand: 'Xiaomi/Poco', model: 'Redmi Note 13 Pro 5G', detected: true };
        if (/Note 13/i.test(ua)) return { brand: 'Xiaomi/Poco', model: 'Redmi Note 13 4G', detected: true };
        if (/Note 12 Pro/i.test(ua)) return { brand: 'Xiaomi/Poco', model: 'Redmi Note 12 Pro', detected: true };
        if (/Note 11/i.test(ua)) return { brand: 'Xiaomi/Poco', model: 'Redmi Note 11S', detected: true };
        if (/12/i.test(ua)) return { brand: 'Xiaomi/Poco', model: 'Redmi 12 5G', detected: true };
        return { brand: 'Xiaomi/Poco', model: 'Redmi Series', detected: true };
      }
      if (/Xiaomi/i.test(ua)) {
        if (/14/i.test(ua)) return { brand: 'Xiaomi/Poco', model: 'Xiaomi 14 Ultra', detected: true };
        if (/13/i.test(ua)) return { brand: 'Xiaomi/Poco', model: 'Xiaomi 13T Pro', detected: true };
        if (/12/i.test(ua)) return { brand: 'Xiaomi/Poco', model: 'Xiaomi 12 Lite', detected: true };
      }
      return { brand: 'Xiaomi/Poco', model: 'Xiaomi Premium Series', detected: true };
    }

    // Check Motorola
    if (/Motorola|Moto|XT[0-9]+/i.test(ua)) {
      if (/Edge\s?50\s?Ultra/i.test(ua)) return { brand: 'Motorola', model: 'Motorola Edge 50 Ultra', detected: true };
      if (/Edge\s?50\s?Pro/i.test(ua)) return { brand: 'Motorola', model: 'Motorola Edge 50 Pro', detected: true };
      if (/Edge\s?50\s?Neo/i.test(ua)) return { brand: 'Motorola', model: 'Motorola Edge 50 Neo', detected: true };
      if (/Edge\s?40/i.test(ua)) return { brand: 'Motorola', model: 'Motorola Edge 40 Neo', detected: true };
      if (/G84/i.test(ua)) return { brand: 'Motorola', model: 'Motorola G84 5G', detected: true };
      if (/G54/i.test(ua)) return { brand: 'Motorola', model: 'Motorola G54 5G', detected: true };
      if (/G34/i.test(ua)) return { brand: 'Motorola', model: 'Motorola G34', detected: true };
      
      const xtMatch = ua.match(/XT[0-9]+/i);
      if (xtMatch) {
        return { brand: 'Motorola', model: `Motorola Moto (${xtMatch[0]})`, detected: true };
      }
      return { brand: 'Motorola', model: 'Motorola Moto Series', detected: true };
    }

    // Check Realme
    if (/Realme|RMX/i.test(ua)) {
      const rmxMatch = ua.match(/RMX[0-9]+/i);
      if (/12\s?Pro/i.test(ua)) return { brand: 'Realme', model: 'Realme 12 Pro+ 5G', detected: true };
      if (/11\s?Pro/i.test(ua)) return { brand: 'Realme', model: 'Realme 11 Pro+', detected: true };
      if (/C67/i.test(ua)) return { brand: 'Realme', model: 'Realme C67', detected: true };
      if (/C55/i.test(ua)) return { brand: 'Realme', model: 'Realme C55', detected: true };
      if (rmxMatch) return { brand: 'Realme', model: `Realme (${rmxMatch[0]})`, detected: true };
      return { brand: 'Realme', model: 'Realme Gaming Series', detected: true };
    }

    // Check Infinix
    if (/Infinix|X6[0-9]+/i.test(ua)) {
      if (/Note\s?40/i.test(ua)) return { brand: 'Infinix', model: 'Infinix Note 40 Pro', detected: true };
      if (/Note\s?35/i.test(ua)) return { brand: 'Infinix', model: 'Infinix Note 35 Pro', detected: true };
      if (/GT\s?20/i.test(ua)) return { brand: 'Infinix', model: 'Infinix GT 20 Pro', detected: true };
      return { brand: 'Infinix', model: 'Infinix Note & GT Series', detected: true };
    }

    // Check ASUS
    if (/ASUS|ROG|Zenfone/i.test(ua)) {
      if (/ROG\s?Phone\s?8/i.test(ua)) return { brand: 'ASUS', model: 'ASUS ROG Phone 8 Pro', detected: true };
      if (/ROG\s?Phone\s?7/i.test(ua)) return { brand: 'ASUS', model: 'ASUS ROG Phone 7 Ultimate', detected: true };
      return { brand: 'ASUS', model: 'ASUS ROG Series', detected: true };
    }

    // Check OnePlus or Oppo
    if (/OnePlus|OPPO|CPH[0-9]+/i.test(ua)) {
      if (/OnePlus\s?12/i.test(ua)) return { brand: 'OnePlus/Oppo', model: 'OnePlus 12', detected: true };
      if (/Nord/i.test(ua)) return { brand: 'OnePlus/Oppo', model: 'OnePlus Nord 3', detected: true };
      return { brand: 'OnePlus/Oppo', model: 'OPPO / OnePlus Mobile', detected: true };
    }

    // Generic Android fallback with specific manufacturer keywords
    const brandMatch = ua.match(/(Huawei|Vivo|Oppo|Lenovo|Tecno|Nokia|Sony|ZTE|Google|LG)/i);
    if (brandMatch) {
      return { brand: brandMatch[0], model: `${brandMatch[0]} Mobile`, detected: true };
    }

    return { brand: 'Android', model: 'Android Personalizado', detected: true };
  }

  // Checking for iOS/Apple
  if (/iPhone|iPad|Macintosh/i.test(ua)) {
    const iosVerMatch = ua.match(/OS\s([0-9_]+)/i);
    const iosVersion = iosVerMatch ? iosVerMatch[1].replace(/_/g, '.') : '';
    
    // Check screen bounds
    const width = window.screen.width;
    const height = window.screen.height;
    
    if (height === 932 || width === 932) return { brand: 'Apple', model: 'iPhone 15 Pro Max', detected: true };
    if (height === 852 || width === 852) return { brand: 'Apple', model: 'iPhone 15 Pro', detected: true };
    if (height === 926 || width === 926) return { brand: 'Apple', model: 'iPhone 14 Pro Max', detected: true };
    if (height === 844 || width === 844) return { brand: 'Apple', model: 'iPhone 13 / 14', detected: true };
    
    return { 
      brand: 'Apple', 
      model: iosVersion ? `iPhone (iOS ${iosVersion})` : 'iPhone Detectado', 
      detected: true 
    };
  }

  return { brand: 'Desconhecido', model: 'ASUS ROG Phone 8 Pro', detected: false };
}

export default function DeviceSelector({
  selectedDevice,
  onSelect,
  showToastNotification
}: DeviceSelectorProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeBrandTab, setActiveBrandTab] = useState<string>('Samsung');
  const [isDetecting, setIsDetecting] = useState(false);

  const brandTabs = [
    'Samsung',
    'Xiaomi/Poco',
    'Apple',
    'Motorola',
    'Realme',
    'Infinix',
    'ASUS',
    'OnePlus/Oppo',
    'Outros'
  ];

  // Perform auto-detection routine on initial load
  useEffect(() => {
    if (!selectedDevice) {
      const result = detectDeviceBrandAndModel();
      onSelect(result.model);
    }
  }, [selectedDevice, onSelect]);

  const triggerAutoDetection = () => {
    sound.playClick();
    setIsDetecting(true);
    
    setTimeout(() => {
      const result = detectDeviceBrandAndModel();
      onSelect(result.model);
      setIsDetecting(false);
      sound.playVIPUpgrade();
      
      const brandOfDetected = result.brand;
      if (brandTabs.includes(brandOfDetected)) {
        setActiveBrandTab(brandOfDetected);
      } else if (brandOfDetected !== 'Desconhecido') {
        setActiveBrandTab('Outros');
      }
      
      if (showToastNotification) {
        showToastNotification(`MODELO DETECTADO: ${result.model.toUpperCase()}`);
      }
    }, 1200);
  };

  const handleManualSwitch = (device: string) => {
    onSelect(device);
    setIsOpen(false);
    sound.playVIPUpgrade();
  };

  // Filter devices based on both global search and active brand tab
  const filteredDevices = ALL_DEVICES.filter((item) => {
    const matchesSearch = item.model.toLowerCase().includes(search.toLowerCase());
    const matchesBrand = item.brand === activeBrandTab;
    
    if (search.trim()) {
      return matchesSearch; // Search spans all brands
    }
    return matchesBrand;
  });

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-4 hover:border-[#ff1b1b]/30 transition-all duration-300 relative overflow-hidden" id="global_device_selector">
      {/* Decorative cyber backdrop block */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-[#ff1b1b]/5 rounded-full blur-xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-3.5 relative z-10">
        <div className="flex items-center gap-2">
          <Smartphone size={16} className="text-[#ff1b1b] animate-pulse" />
          <span className="font-sans font-semibold text-xs tracking-wide uppercase text-gray-300">
            DISPOSITIVO ALVO
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={triggerAutoDetection}
            className="flex items-center gap-1 text-[8px] font-mono tracking-wider text-green-400 hover:text-white border border-green-500/20 hover:border-green-400 px-2 py-1 rounded bg-[#000]/40 transition-all"
            disabled={isDetecting}
            id="btn_auto_detect_signature"
          >
            <Activity size={9} className={isDetecting ? 'animate-pulse text-green-400' : 'text-green-500'} />
            {isDetecting ? 'RUST_SCANNING...' : 'AUTO DETECTAR'}
          </button>
          
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsOpen(!isOpen);
            }}
            className="flex items-center gap-0.5 text-[8.5px] font-mono tracking-widest text-[#ffb300] hover:text-white border border-[#ffb300]/30 hover:border-white px-2.5 py-1 rounded bg-[#000]/40 transition-all"
            id="btn_toggle_brand_db"
          >
            <RefreshCw size={10} className="mr-0.5 animate-spin-slow" />
            {isOpen ? 'FECHAR' : 'TROCAR MANUAL'}
          </button>
        </div>
      </div>

      <div className="bg-[#050505] p-3 rounded-lg border border-[#222] flex items-center justify-between relative z-10">
        <div className="flex flex-col">
          <span className="text-[8px] text-[#ff1b1b] font-mono font-bold tracking-widest uppercase flex items-center gap-1">
            <Sparkles size={10} className="text-[#ff1b1b] animate-pulse" /> BIO-LOG RADAR DE CALIBRAÇÃO ATIVO
          </span>
          <span className="text-xs font-sans font-bold text-gray-200 mt-1 flex items-center gap-1.5">
            {selectedDevice || 'Buscando dispositivo...'}
          </span>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] border-2 border-zinc-950 animate-pulse"></span>
      </div>

      {isOpen && (
        <div className="mt-3.5 pt-3.5 border-t border-[#222] space-y-3.5 relative z-10">
          
          {/* Brand Tabs Carousel */}
          <div className="flex gap-1 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {brandTabs.map((brandName) => {
              const isActive = activeBrandTab === brandName && !search.trim();
              return (
                <button
                  type="button"
                  key={brandName}
                  onClick={() => {
                    sound.playClick();
                    setActiveBrandTab(brandName);
                    setSearch(''); // Clear search on tab switch for optimal speed
                  }}
                  className={`py-1 px-2.5 rounded-md text-[8.5px] font-orbitron font-black tracking-wider uppercase shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#ff1b1b] text-white border border-[#ff1b1b]/20 shadow-[0_2px_8px_rgba(255,27,27,0.3)]'
                      : 'bg-zinc-950 border border-zinc-900 text-gray-500 hover:text-gray-300 hover:border-zinc-800'
                  }`}
                >
                  {brandName}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Pesquisar seu celular ou marca em todo o mundo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#050505] border border-zinc-900 focus:border-[#ff1b1b]/40 rounded-lg pl-8 p-2 text-xs font-sans text-gray-200 outline-none placeholder:text-gray-650"
            />
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {filteredDevices.map((device) => {
              const isActive = selectedDevice.startsWith(device.model);
              return (
                <button
                  type="button"
                  key={device.model}
                  onClick={() => handleManualSwitch(device.model)}
                  className={`w-full text-left p-2.5 rounded-md text-xs font-sans transition-all flex items-center justify-between border ${
                    isActive 
                      ? 'bg-[#ff1b1b]/10 text-white font-bold border-[#ff1b1b]/30' 
                      : 'bg-zinc-950/40 border-transparent hover:bg-zinc-900/80 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[7.5px] font-mono font-bold text-[#ffb300] bg-[#ffb300]/10 px-1 py-0.2 rounded uppercase border border-[#ffb300]/10">
                      {device.brand}
                    </span>
                    <span>{device.model}</span>
                  </div>
                  {isActive && <Check size={12} className="text-[#ff1b1b]" />}
                </button>
              );
            })}
            
            {filteredDevices.length === 0 && (
              <button
                type="button"
                onClick={() => handleManualSwitch(search)}
                className="w-full text-center py-4 text-xs text-[#ffb300] bg-[#111]/80 hover:bg-[#ffb300]/10 flex flex-col items-center justify-center rounded-lg border border-dashed border-[#ffb300]/30 transition-all font-sans"
              >
                <span>Celular "{search}" não localizado na nuvem.</span>
                <span className="text-[9px] text-gray-500 font-mono mt-1">CLIQUE PARA FORÇAR SELEÇÃO DIRETA</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
