import { motion } from 'motion/react';
import { Sparkles, Shield, Target, Zap, Crown } from 'lucide-react';

interface GamerAvatarProps {
  id: string; // 'nobru' | 'cerol' | 'thurzin' | 'level_up' | 'bak' | 'custom'
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isSpeaking?: boolean;
  animateBreathe?: boolean;
  showScanner?: boolean;
  usePhoto?: boolean;
  customPrimaryColor?: string;
  customAccentColor?: string;
}

export default function GamerAvatar({
  id,
  size = 'md',
  isSpeaking = false,
  animateBreathe = true,
  showScanner = true,
  usePhoto = true,
  customPrimaryColor,
  customAccentColor,
}: GamerAvatarProps) {
  // Define dynamic pixel sizing
  const sizeMap = {
    sm: { box: 'w-12 h-12', svg: 48 },
    md: { box: 'w-16 h-16', svg: 64 },
    lg: { box: 'w-24 h-24', svg: 96 },
    xl: { box: 'w-36 h-36', svg: 144 },
  };

  const activeSize = sizeMap[size] || sizeMap.md;

  // Configuration for each gamer character including their newly added portrait images matching user uploads
  const configMap: Record<string, {
    primaryColor: string;
    accentColor: string;
    name: string;
    role: string;
    photoUrl: string;
  }> = {
    nobru: {
      primaryColor: '#a855f7', // Purple
      accentColor: '#e0a7ff',
      name: 'Nobru',
      role: 'FLUXO CAPTAIN',
      photoUrl: 'https://noticias.playhard.com.br/wp-content/uploads/2022/10/nobru.png',
    },
    cerol: {
      primaryColor: '#f97316', // Orange-red
      accentColor: '#ffedd5',
      name: 'Cerol',
      role: 'FLUXO CHIEF',
      photoUrl: 'https://s2-ge.glbimg.com/pZ2D8pInG9I03bJ3C8Zk_0lH_6s=/0x0:1080x1350/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228166e68443e9317b243fcba3fa1/internal_photos/bs/2022/Z/J/37jH3cTyS2xSgve8fDA/cerol-fluxo.jpg',
    },
    thurzin: {
      primaryColor: '#22c55e', // Green LOUD
      accentColor: '#bbf7d0',
      name: 'Thurzin',
      role: 'LOUD SNIPER',
      photoUrl: 'https://s2-ge.glbimg.com/N7bQp8XI9b0J4bc8Zk_0lH_6s=/0x0:1080x1080/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228166e68443e9317b243fcba3fa1/internal_photos/bs/2021/Y/r/thUrzIn-loud.jpg',
    },
    level_up: {
      primaryColor: '#06b6d4', // Cyan
      accentColor: '#cffafe',
      name: 'Level Up',
      role: '007 RAIDER',
      photoUrl: 'https://s2-ge.glbimg.com/s4-WqW0K4XbSg_0_H_ks=/0x0:1080x1350/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228166e68443e9317b243fcba3fa1/internal_photos/bs/2021/X/p/level-up-007.jpg',
    },
    bak: {
      primaryColor: '#eab308', // Gold
      accentColor: '#fef9c3',
      name: 'Bak',
      role: 'EMPEROR KING',
      photoUrl: 'https://s2-ge.glbimg.com/p-k8Xv0oW_8c8Ew7e7V8C6S_ks=/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228166e68443e9317b243fcba3fa1/internal_photos/bs/2020/u/p/bak-free-fire.jpg',
    },
    custom: {
      primaryColor: customPrimaryColor || '#ec4899', // Custom Color or Default Pink
      accentColor: customAccentColor || '#fbcfe8',
      name: 'Sua Lenda',
      role: 'HACKER PRO',
      photoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=150',
    }
  };

  const char = configMap[id] || configMap.custom;

  // Breathing animation states
  const breatheTransition = animateBreathe ? {
    y: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      ease: 'easeInOut' as const,
    },
    scale: {
      duration: 4,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      ease: 'easeInOut' as const,
    }
  } : {};

  const breatheAnimate = animateBreathe ? {
    y: [0, -4, 0],
    scale: [1, 1.015, 1],
  } : {};

  return (
    <div className={`relative ${activeSize.box} select-none flex items-center justify-center`} id={`avatar-container-${id}`}>
      {/* Background Holographic Glow rings */}
      <div 
        className="absolute inset-0 rounded-full blur-[10px] opacity-20 pointer-events-none transition-all duration-500 scale-110"
        style={{
          background: `radial-gradient(circle, ${char.primaryColor} 0%, transparent 70%)`
        }}
      />

      {/* Speaking voice ripple rings */}
      {isSpeaking && (
        <>
          <motion.div
            className="absolute -inset-2.5 rounded-full border-2 border-dashed opacity-40 pointer-events-none"
            style={{ borderColor: char.primaryColor }}
            animate={{ scale: [1, 1.3, 1], rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute -inset-4 rounded-full border border-double opacity-25 pointer-events-none"
            style={{ borderColor: char.primaryColor }}
            animate={{ scale: [1, 1.4, 1], rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </>
      )}

      {/* Interactive Cyber HUD Rings */}
      <motion.div 
        className="absolute inset-[-4px] rounded-full border border-zinc-800 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: size === 'xl' ? 25 : 15, repeat: Infinity, ease: 'linear' }}
      >
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: char.primaryColor, boxShadow: `0 0 8px ${char.primaryColor}` }}
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-zinc-800" />
      </motion.div>

      {/* Main Avatar Character Render Block */}
      <motion.div
        animate={breatheAnimate}
        transition={breatheTransition}
        className="w-full h-full rounded-full border-2 border-zinc-800/80 overflow-hidden bg-gradient-to-b from-[#111] via-[#08080c] to-[#040406] shadow-[0_4px_16px_rgba(0,0,0,0.85)] relative flex items-center justify-center p-0.5"
        style={{ borderColor: `${char.primaryColor}40` }}
        whileHover={{ borderColor: char.primaryColor, boxShadow: `0 0 15px ${char.primaryColor}30` }}
      >
        {false ? (
          <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-black">
            <img 
              src={char.photoUrl} 
              alt={char.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
            />
            {/* Cyber holographic scanning filter overlay */}
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-25"
              style={{
                background: `linear-gradient(to bottom, ${char.primaryColor}50 0%, transparent 100%)`
              }}
            />
            {/* High-end vignette shade */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40 pointer-events-none" />
            
            {/* Micro HUD technical reticle on photo */}
            <div className="absolute inset-2 border border-dashed border-white/5 rounded-full pointer-events-none" />
          </div>
        ) : (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full fill-none"
            xmlns="http://www.w3.org/2000/svg"
          >
          {/* Gradients definitions for high fidelity rendering */}
          <defs>
            <linearGradient id={`hairGrad-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={char.accentColor} />
              <stop offset="50%" stopColor={char.primaryColor} />
              <stop offset="100%" stopColor="#0a0515" />
            </linearGradient>
            <linearGradient id={`suitGrad-${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#15151f" />
              <stop offset="50%" stopColor={char.primaryColor} stopOpacity={0.4} />
              <stop offset="100%" stopColor="#06060c" />
            </linearGradient>
            <radialGradient id={`glowGrad-${id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={char.primaryColor} stopOpacity={0.5} />
              <stop offset="100%" stopColor="transparent" stopOpacity={0} />
            </radialGradient>
            <linearGradient id={`skinGrad-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffdbb5" />
              <stop offset="100%" stopColor="#f3be8c" />
            </linearGradient>
            <linearGradient id={`bronzeSkinGrad-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8b182" />
              <stop offset="100%" stopColor="#be8556" />
            </linearGradient>
          </defs>

          {/* BACKGROUND glow flare */}
          <circle cx="50" cy="50" r="45" fill={`url(#glowGrad-${id})`} />

          {/* DYNAMIC SHADOWS & TECH GEAR BASE */}
          {/* Suit Base and Jacket collar */}
          <path d="M 25,92 C 25,75 35,68 50,68 C 65,68 75,75 75,92 Z" fill={`url(#suitGrad-${id})`} stroke={`${char.primaryColor}60`} strokeWidth="1.5" />
          
          {/* Neon zipper detail on suit */}
          <path d="M 50,72 L 50,92" stroke={char.primaryColor} strokeWidth="2" strokeDasharray="1 3" />
          <path d="M 45,72 C 45,72 50,75 55,72" stroke={char.primaryColor} strokeWidth="1.5" />

          {/* HP AVATAR SCHEME: Futuristic AI Cyber Visors for all */}
          {id === 'nobru' && (
            <>
              {/* Helmet main shell */}
              <path d="M 26,38 C 22,20 34,10 50,11 C 66,10 78,20 74,38 C 76,46 72,58 68,60 Q 50,56 32,60 C 28,58 24,46 26,38 Z" fill="#0f0c1b" stroke={`${char.primaryColor}60`} strokeWidth="1.5" />
              {/* Visor shield */}
              <path d="M 31,34 C 31,34 50,23 69,34 C 72,39 68,54 50,55 C 32,54 28,39 31,34 Z" fill="#06040e" stroke={char.primaryColor} strokeWidth="2.2" />
              {/* Floating laser crown line above indicating Lilac Garena Crown */}
              <path d="M 40,18 L 44,23 L 50,16 L 56,23 L 60,18" fill="none" stroke={char.accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Visor glare */}
              <path d="M 34,36 C 42,30 58,30 66,36" fill="none" stroke={`${char.accentColor}bb`} strokeWidth="2.5" strokeLinecap="round" />
              {/* Horizontal LED tracking bar */}
              <line x1="36" y1="44" x2="64" y2="44" stroke={char.primaryColor} strokeWidth="1.5" strokeDasharray="2 2" />
              <circle cx="50" cy="44" r="3" fill={char.accentColor} />
              {/* Side ear pieces */}
              <rect x="21" y="34" width="5" height="15" rx="2" fill="#1b1233" stroke={char.primaryColor} strokeWidth="1" />
              <rect x="74" y="34" width="5" height="15" rx="2" fill="#1b1233" stroke={char.primaryColor} strokeWidth="1" />
              <circle cx="23.5" cy="41.5" r="1.5" fill={char.accentColor} />
              <circle cx="76.5" cy="41.5" r="1.5" fill={char.accentColor} />
              {/* Cyber collar */}
              <path d="M 38,69 C 38,76 62,76 62,69" stroke={char.primaryColor} strokeWidth="4.2" fill="none" />
              <path d="M 25,92 C 25,75 35,68 50,68 C 65,68 75,75 75,92 Z" fill="#18142c" stroke={`${char.primaryColor}40`} strokeWidth="1" />
              <path d="M 28,78 L 36,86 M 72,78 L 64,86" stroke={char.primaryColor} strokeWidth="2" />
            </>
          )}

          {id === 'cerol' && (
            <>
              {/* Aggressive angled Helmet shell */}
              <path d="M 25,35 L 35,12 L 65,12 L 75,35 L 70,58 L 50,64 L 30,58 Z" fill="#1c0e05" stroke={`${char.primaryColor}60`} strokeWidth="1.8" />
              {/* Thermonuclear core visor */}
              <path d="M 29,32 L 71,32 L 67,48 L 33,48 Z" fill="#090502" stroke={char.primaryColor} strokeWidth="2" />
              {/* Flame graphics */}
              <path d="M 35,16 Q 38,8 41,18 M 65,16 Q 62,8 59,18" stroke={char.accentColor} strokeWidth="1.5" strokeLinecap="round" />
              {/* Dual target lasers */}
              <circle cx="40" cy="40" r="2.5" fill={char.primaryColor} />
              <circle cx="40" cy="40" r="1" fill="#ffffff" />
              <circle cx="60" cy="40" r="2.5" fill={char.primaryColor} />
              <circle cx="60" cy="40" r="1" fill="#ffffff" />
              {/* HUD alignment markings */}
              <path d="M 32,36 L 45,36 M 68,36 L 55,36" stroke={char.accentColor} strokeWidth="1" />
              {/* Cheek intakes */}
              <path d="M 28,50 Q 40,58 45,53 M 72,50 Q 60,58 55,53" stroke={char.primaryColor} strokeWidth="1.5" fill="none" />
              {/* Orange Fluxo Chief collar and armor */}
              <path d="M 38,69 C 38,76 62,76 62,69" stroke={char.primaryColor} strokeWidth="4.2" fill="none" />
              <path d="M 25,92 C 25,75 35,68 50,68 C 65,68 75,75 75,92 Z" fill="#2d1305" stroke={`${char.primaryColor}40`} strokeWidth="1" />
              <path d="M 30,76 L 38,84 M 70,76 L 62,84" stroke={char.primaryColor} strokeWidth="1.8" />
            </>
          )}

          {id === 'thurzin' && (
            <>
              {/* Precision mechanical Sniper shell */}
              <path d="M 26,38 C 23,21 34,11 50,12 C 66,11 77,21 74,38 L 71,59 L 50,65 L 29,59 Z" fill="#09140c" stroke={`${char.primaryColor}60`} strokeWidth="1.5" />
              {/* Dual-pane high-tech sniper visor */}
              <path d="M 30,32 L 69,32 L 65,51 L 35,51 Z" fill="#020904" stroke={char.primaryColor} strokeWidth="2.2" strokeLinejoin="round" />
              {/* Tactical scope on left eye pane (viewer's right) */}
              <circle cx="58" cy="41" r="5" stroke={char.accentColor} strokeWidth="1.5" fill="none" />
              <line x1="53" y1="41" x2="63" y2="41" stroke={char.accentColor} strokeWidth="0.8" />
              <line x1="58" y1="36" x2="58" y2="46" stroke={char.accentColor} strokeWidth="0.8" />
              <circle cx="58" cy="41" r="1.5" fill={char.accentColor} />
              {/* Right eye (viewer's left) tracker */}
              <path d="M 34,41 Q 44,41 46,39" stroke={char.accentColor} strokeWidth="2" strokeLinecap="round" fill="none" />
              <circle cx="44" cy="41" r="1" fill="#ffffff" />
              {/* Cyber parts */}
              <rect x="20" y="36" width="6" height="12" rx="2" fill="#0d2414" stroke={char.primaryColor} strokeWidth="1" />
              <rect x="74" y="36" width="6" height="12" rx="2" fill="#0d2414" stroke={char.primaryColor} strokeWidth="1" />
              <line x1="23" y1="30" x2="23" y2="38" stroke={char.accentColor} strokeWidth="1.5" />
              {/* Neck armor and Green matrix collar */}
              <path d="M 38,69 C 38,76 62,76 62,69" stroke={char.primaryColor} strokeWidth="4.2" fill="none" />
              <path d="M 25,92 C 25,75 35,68 50,68 Z" fill="#091c0e" stroke={`${char.primaryColor}40`} strokeWidth="1" />
              <path d="M 27,81 L 36,89 M 73,81 L 64,89" stroke={char.primaryColor} strokeWidth="2" />
            </>
          )}

          {id === 'level_up' && (
            <>
              {/* Fast cybernetic raider shell */}
              <path d="M 27,37 C 24,19 35,9 50,9 C 65,9 76,19 73,37 L 69,57 L 50,62 L 31,57 Z" fill="#07151a" stroke={`${char.primaryColor}60`} strokeWidth="1.5" />
              {/* Goggles visor style */}
              <path d="M 28,31 Q 50,22 72,31 L 67,46 Q 50,53 33,46 Z" fill="#01070a" stroke={char.primaryColor} strokeWidth="2.2" />
              {/* Cyan reflection lines */}
              <path d="M 33,34 Q 50,27 67,34" fill="none" stroke={char.accentColor} strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 36,40 Q 50,33 64,40" fill="none" stroke={`${char.primaryColor}90`} strokeWidth="1.2" strokeLinecap="round" />
              {/* Cheek stats lines */}
              <line x1="31" y1="48" x2="31" y2="54" stroke={char.accentColor} strokeWidth="2" strokeLinecap="round" />
              <line x1="69" y1="48" x2="69" y2="54" stroke={char.accentColor} strokeWidth="2" strokeLinecap="round" />
              {/* Neck support & Speed collar */}
              <path d="M 38,69 C 38,76 62,76 62,69" stroke={char.primaryColor} strokeWidth="4.2" fill="none" />
              <path d="M 25,92 C 25,75 35,68 50,68 C 65,68 75,75 75,92 Z" fill="#051c24" stroke={`${char.primaryColor}40`} strokeWidth="1" />
              <path d="M 29,78 L 37,86 M 71,78 L 63,86" stroke={char.primaryColor} strokeWidth="1.8" />
            </>
          )}

          {id === 'bak' && (
            <>
              {/* Luxury Obsidian Emperor shell */}
              <path d="M 26,38 C 22,20 34,10 50,11 C 66,10 78,20 74,38 L 70,58 L 50,64 L 30,58 Z" fill="#141107" stroke={`${char.primaryColor}60`} strokeWidth="1.5" />
              {/* Visor plate shield */}
              <path d="M 31,34 C 31,34 50,22 69,34 C 72,39 68,54 50,55 C 32,54 28,39 31,34 Z" fill="#050402" stroke={char.primaryColor} strokeWidth="2.5" />
              {/* Floating tech crown */}
              <path d="M 36,11 L 40,24 L 50,15 L 60,24 L 64,11 L 57,17 L 50,10 L 43,17 Z" fill={char.primaryColor} stroke={char.accentColor} strokeWidth="1" />
              {/* Golden visor glow glare */}
              <path d="M 34,36 C 42,30 58,30 66,36" fill="none" stroke={char.accentColor} strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="50" cy="45" r="4.5" stroke={char.accentColor} strokeWidth="1" fill="none" strokeDasharray="1.5 1.5" />
              <circle cx="50" cy="45" r="1.5" fill={char.accentColor} />
              {/* Gold luxury ear caps */}
              <rect x="20.5" y="34" width="6" height="15" rx="3" fill="#2d250f" stroke={char.primaryColor} strokeWidth="1.5" />
              <rect x="73.5" y="34" width="6" height="15" rx="3" fill="#2d250f" stroke={char.primaryColor} strokeWidth="1.5" />
              <circle cx="23.5" cy="41.5" r="2" fill={char.accentColor} />
              <circle cx="76.5" cy="41.5" r="2" fill={char.accentColor} />
              {/* Gold tuxedo trim armor */}
              <path d="M 38,69 C 38,76 62,76 62,69" stroke={char.primaryColor} strokeWidth="4.2" fill="none" />
              <path d="M 25,92 C 25,75 35,68 50,68 C 65,68 75,75 75,92 Z" fill="#241e0a" stroke={`${char.primaryColor}40`} strokeWidth="1" />
              <path d="M 28,78 L 36,86 M 72,78 L 64,86" stroke={char.primaryColor} strokeWidth="2" />
            </>
          )}

          {id === 'custom' && (
            <>
              {/* Customizable Cyber Helmet cyber visor */}
              <path d="M 26,38 C 22,20 34,10 50,11 C 66,10 78,20 74,38 C 76,46 72,58 68,60 Q 50,56 32,60 C 28,58 24,46 26,38 Z" fill="#13131d" stroke={`${char.primaryColor}50`} strokeWidth="1.5" />
              <path d="M 31,34 C 31,34 50,23 69,34 C 72,39 68,54 50,55 C 32,54 28,39 31,34 Z" fill="#080810" stroke={char.primaryColor} strokeWidth="2" />
              <path d="M 34,36 C 42,30 58,30 66,36" fill="none" stroke={`${char.accentColor}dd`} strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 37,42 C 45,38 55,38 63,42" fill="none" stroke={`${char.primaryColor}aa`} strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="50" cy="45" r="4.5" stroke={char.accentColor} strokeWidth="1" fill="none" strokeDasharray="1.5 1.5" />
              <circle cx="50" cy="45" r="1.5" fill={char.accentColor} />
              <rect x="20.5" y="34" width="6" height="15" rx="3" fill="#1e1e2d" stroke={char.primaryColor} strokeWidth="1.5" />
              <rect x="73.5" y="34" width="6" height="15" rx="3" fill="#1e1e2d" stroke={char.primaryColor} strokeWidth="1.5" />
              <circle cx="23.5" cy="41.5" r="2.2" fill={char.accentColor} />
              <circle cx="76.5" cy="41.5" r="2.2" fill={char.accentColor} />
              <path d="M 38,69 C 38,76 62,76 62,69" stroke={char.primaryColor} strokeWidth="4.2" fill="none" />
              <path d="M 25,92 C 25,75 35,68 50,68 C 65,68 75,75 75,92 Z" fill="#181825" stroke={`${char.primaryColor}40`} strokeWidth="1" />
              <path d="M 28,78 L 36,86 M 72,78 L 64,86" stroke={char.primaryColor} strokeWidth="2" />
            </>
          )}

          {/* GENERAL HUD: Static overlay calibration grids */}
          <circle cx="50" cy="50" r="46.5" stroke={`${char.primaryColor}20`} strokeWidth="1" strokeDasharray="2 3" />
        </svg>
        )}

        {/* Animated Vertical Scan Vector line overlay */}
        {showScanner && (
          <motion.div
            className="absolute inset-x-0 h-[1.5px] opacity-75 pointer-events-none"
            style={{
              background: `linear-gradient(to right, transparent, ${char.primaryColor}, transparent)`
            }}
            animate={{
              top: ['0%', '100%', '0%']
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        )}
      </motion.div>

      {/* Embedded tech indicator icons */}
      <span className="absolute bottom-[-1.5px] bg-[#050505] border border-zinc-800 text-[6.5px] px-1 py-0.2 rounded font-orbitron font-extrabold tracking-widest text-[#94a3b8] uppercase">
        {id}
      </span>
    </div>
  );
}
