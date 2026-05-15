import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crown, Smartphone, Shield, Zap, Target, Sliders, ShoppingBag, 
  Settings, Heart, Download, Upload, Plus, Search, HelpCircle, 
  Volume2, VolumeX, LogIn, LogOut, Check, Sparkles, User, AlertCircle, FileCode, CheckCircle, Flame
} from 'lucide-react';

// Import our cohesive, high-performance modular components
import GamerLoader from './components/GamerLoader';
import SensiSlider from './components/SensiSlider';
import RegeditSwitch from './components/RegeditSwitch';
import PingMeter from './components/PingMeter';
import DeviceSelector from './components/DeviceSelector';
import CoachIA from './components/CoachIA';

// Services and configs
import { sound } from './services/soundService';
import { 
  db, auth, loginWithGoogle, logoutUser, 
  saveSensiConfig, getGamerConfigs, deleteSensiConfig, createGamerProfile, getGamerProfile, updateGamerProfile,
  FAMOUS_PLAYERS, SensiConfig, DEFAULT_SENSI_PADRAO, DEFAULT_SENSI_X1, GamerProfile 
} from './services/firebaseService';

export default function App() {
  // Application Stage
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active User Authentications
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<GamerProfile | null>(null);

  // Tab View Controller: 'inicio' | 'sensi' | 'loja' | 'config'
  const [activeTab, setActiveTab] = useState<'inicio' | 'sensi' | 'loja' | 'config'>('inicio');

  // Interactive Configuration States
  const [currentPreset, setCurrentPreset] = useState<string>('sensi_padrao');
  const [configName, setConfigName] = useState<string>('Parâmetro Sensi Padrão');
  const [deviceModel, setDeviceModel] = useState<string>('ASUS ROG Phone 8 Pro');
  
  // Custom Sensitivity Data Base
  const [boosterValue, setBoosterValue] = useState<number>(30);
  const [sensitivities, setSensitivities] = useState(DEFAULT_SENSI_PADRAO.sensitivities);
  const [regedits, setRegedits] = useState(DEFAULT_SENSI_PADRAO.regedits);
  const [optimizations, setOptimizations] = useState(DEFAULT_SENSI_PADRAO.optimizations);

  // Floating Status Alerts
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [customConfigs, setCustomConfigs] = useState<SensiConfig[]>([]);
  const [showConfigCreator, setShowConfigCreator] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  // Floating tooltip detail content
  const [activePresetInfo, setActivePresetInfo] = useState<string | null>(null);

  // Monitoring active changes on Auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userProfile = await getGamerProfile(firebaseUser.uid);
        if (userProfile) {
          setProfile(userProfile);
          setDeviceModel(userProfile.deviceModel);
        } else {
          // Sync default profile if new registration
          const newProf: GamerProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            username: firebaseUser.displayName || 'Gamer VIP',
            avatarUrl: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=150',
            deviceModel: 'ASUS ROG Phone 8 Pro'
          };
          await createGamerProfile(newProf);
          setProfile(newProf);
        }
        // Fetch saved cloud configurations
        const cloudConfigs = await getGamerConfigs(firebaseUser.uid);
        setCustomConfigs(cloudConfigs || []);
      } else {
        setUser(null);
        setProfile(null);
        setCustomConfigs([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Set sound triggers
  const playTabChange = (tab: 'inicio' | 'sensi' | 'loja' | 'config') => {
    setActiveTab(tab);
    sound.playClick();
  };

  const toggleSoundMute = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sound.toggleSound(nextState);
    if (nextState) sound.playClick();
  };

  // Helper to trigger temporary onscreen message alert
  const showToastNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Profile presets switching
  const applyConfigPreset = (presetId: string, customItem?: SensiConfig) => {
    setCurrentPreset(presetId);
    sound.playBoosterClick();

    if (presetId === 'sensi_padrao') {
      setConfigName('Sensi Padrão');
      setBoosterValue(DEFAULT_SENSI_PADRAO.boosterValue);
      setSensitivities(DEFAULT_SENSI_PADRAO.sensitivities);
      setRegedits(DEFAULT_SENSI_PADRAO.regedits);
      setOptimizations(DEFAULT_SENSI_PADRAO.optimizations);
      showToastNotification('PRESET PADRÃO CARREGADO!');
    } else if (presetId === 'sensi_x1') {
      setConfigName('Sensi X1 Elite');
      setBoosterValue(DEFAULT_SENSI_X1.boosterValue);
      setSensitivities(DEFAULT_SENSI_X1.sensitivities);
      setRegedits(DEFAULT_SENSI_X1.regedits);
      setOptimizations(DEFAULT_SENSI_X1.optimizations);
      showToastNotification('PRESET X1 ELITE ATIVADO!');
    } else if (customItem) {
      setConfigName(customItem.name);
      setBoosterValue(customItem.boosterValue);
      setSensitivities(customItem.sensitivities);
      setRegedits(customItem.regedits);
      setOptimizations(customItem.optimizations);
      showToastNotification(`AJUSTES "${customItem.name.toUpperCase()}" IMPORTADOS`);
    }
  };

  // Player cloning mechanism
  const cloneFamousPlayerSensi = (player: typeof FAMOUS_PLAYERS[0]) => {
    sound.playVIPUpgrade();
    
    // Multiplier matching
    setBoosterValue(player.boosterValue);
    setDeviceModel(player.deviceModel);
    
    // Sliders setting
    setSensitivities({
      arma1Tiro: player.sensitivities.arma1Tiro,
      metralhadora: player.sensitivities.metralhadora,
      fuzil: player.sensitivities.fuzil,
      submetralhadora: player.sensitivities.submetralhadora,
      espingarda: player.sensitivities.espingarda,
      velocidadeToque: player.sensitivities.velocidadeToque,
      dpi: player.sensitivities.dpi,
      cursorMovel: player.sensitivities.cursorMovel
    });

    // Preset indicator matching
    setCurrentPreset('famous_' + player.id);
    setConfigName(`Clone: ${player.name}`);

    showToastNotification(`SENSI DE ${player.name.toUpperCase()} CLONADA COM SUCESSO!`);
  };

  // Cloud & local creation profile triggers
  const handleCreateNewConfig = async () => {
    if (!newProfileName.trim()) return;
    sound.playVIPUpgrade();

    const configId = 'ipz_' + Math.random().toString(36).substring(2, 11);
    const newConfig: SensiConfig = {
      id: configId,
      name: newProfileName,
      ownerId: user?.uid || 'anonymous_user',
      deviceModel: deviceModel,
      boosterValue: boosterValue,
      sensitivities: sensitivities,
      regedits: regedits,
      optimizations: optimizations
    };

    if (user) {
      try {
        await saveSensiConfig(newConfig);
        const cloudConfigs = await getGamerConfigs(user.uid);
        setCustomConfigs(cloudConfigs || []);
      } catch (e) {
        console.error('Error backing up config to firestore', e);
      }
    } else {
      // Offline fallback lists
      setCustomConfigs(prev => [...prev, newConfig]);
    }

    applyConfigPreset(configId, newConfig);
    setShowConfigCreator(false);
    setNewProfileName('');
    showToastNotification(`PERFIL "${newConfig.name.toUpperCase()}" CRIADO!`);
  };

  const handleDeleteConfig = async (configId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    sound.playToggleOff();

    if (user) {
      try {
        await deleteSensiConfig(configId);
        const cloudConfigs = await getGamerConfigs(user.uid);
        setCustomConfigs(cloudConfigs || []);
      } catch (e) {
        console.error('Failed to remote wipe config', e);
      }
    } else {
      setCustomConfigs(prev => prev.filter(c => c.id !== configId));
    }

    // Switch back
    applyConfigPreset('sensi_padrao');
    showToastNotification('PERFIL ELIMINADO COM SUCESSO');
  };

  // Sensitivity Export Telemetry JSON download
  const handleExportConfig = () => {
    sound.playVIPUpgrade();
    const manifest = {
      app: 'IPZ SENSIPRO',
      version: '2.8.4',
      date: new Date().toISOString(),
      configName: configName,
      deviceModel: deviceModel,
      boosterValue: boosterValue,
      sensitivities: sensitivities,
      regedits: regedits,
      optimizations: optimizations
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(manifest, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `IPZ_${configName.replace(/\s+/g, '_')}_sensi.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToastNotification('TELEMETRIA TELEPORTADA COM SUCESSO!');
  };

  // Sensitivity Import parsing
  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          if (imported.app === 'IPZ SENSIPRO' && imported.sensitivities) {
            sound.playVIPUpgrade();
            
            setConfigName(imported.configName || 'Importado Premium');
            if (imported.boosterValue) setBoosterValue(imported.boosterValue);
            setSensitivities(imported.sensitivities);
            if (imported.regedits) setRegedits(imported.regedits);
            if (imported.optimizations) setOptimizations(imported.optimizations);
            if (imported.deviceModel) setDeviceModel(imported.deviceModel);

            showToastNotification('TELEMETRIA IMPORTADA E CALIBRADA!');
          } else {
            sound.playToggleOff();
            alert('Erro: Arquivo JSON não compatível com telemetria IPZ SENSIPRO.');
          }
        } catch (err) {
          sound.playToggleOff();
          alert('Falha ao processar arquivo de sensibilidade.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleGoogleSignIn = async () => {
    sound.playVIPUpgrade();
    try {
      const authUser = await loginWithGoogle();
      if (authUser) {
        showToastNotification(`EMPARELHADO DE CONTA: ${authUser.displayName}`);
      }
    } catch (e) {
      sound.playToggleOff();
      showToastNotification('SINC AUDIT INTERROMPIDO');
    }
  };

  const handleSignOut = async () => {
    sound.playToggleOff();
    try {
      await logoutUser();
      showToastNotification('DESCONECTADO COM SUCESSO');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#e0e0e0] font-sans flex items-center justify-center p-0 sm:p-5 relative overflow-hidden selection:bg-[#ff1b1b] selection:text-white">
      {/* Absolute futuristic ambient background beams */}
      <div className="absolute top-[-30%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-[#ff1b1b]/5 filter blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#ffb300]/3 filter blur-[120px] pointer-events-none"></div>

      {/* Boot screen Loading sequence */}
      <AnimatePresence>
        {!loadingComplete && (
          <GamerLoader onComplete={() => setLoadingComplete(true)} />
        )}
      </AnimatePresence>

      {/* Floating Global Micro Toast notification */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-red-950 via-rose-900 to-amber-950 border-2 border-[#ff1b1b] px-5 py-3 rounded-xl shadow-[0_0_25px_rgba(255,27,27,0.5)] flex items-center gap-3 select-none"
          >
            <Sparkles className="text-[#ffb300] animate-spin-slow animate-pulse" size={18} />
            <span className="font-orbitron font-extrabold text-[11px] tracking-widest text-[#ffe1a2]">
              {successToast}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Android Device Bezel Wrapper - Immersive Gaming Console shell */}
      <div className="w-full max-w-[430px] h-full sm:h-[860px] bg-[#050505] sm:border-[6px] sm:border-[#111] rounded-none sm:rounded-[42px] flex flex-col justify-between relative shadow-[0_0_50px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,27,27,0.15)] overflow-hidden cyber-grid">
        
        {/* Animated Sound Controller */}
        <div className="absolute top-2.5 right-6 z-40 hidden sm:flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
          <button 
            onClick={toggleSoundMute} 
            className="text-gray-400 hover:text-[#ff1b1b] transition-colors p-1"
            title="Toggle Gamer sound"
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>
        </div>

        {/* Smartphone Camera Notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-black z-40 flex items-center justify-center pointer-events-none">
          <div className="w-28 h-4.5 bg-[#050505] rounded-b-2xl border-x border-b border-[#222] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#111] border border-zinc-800 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-blue-900"></div>
            </div>
            <div className="w-8 h-1 bg-[#151515] rounded-full ml-2"></div>
          </div>
        </div>

        {/* Mobile Header / Top Dashboard Info bar */}
        <div className="px-5 pt-8 pb-3.5 bg-gradient-to-b from-black to-[#050505] border-b border-[#222]/30 flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-2">
            <Crown size={15} className="text-[#ff1b1b] filter drop-shadow-[5px_5px_8px_rgba(255,27,27,0.8)] fill-[#ff1b1b]/10" />
            <span className="font-orbitron font-extrabold text-[13px] text-white tracking-widest">
              IPZ <span className="text-[#ff1b1b]">SENSIPRO</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#ff1b1b]/10 text-[#ff1b1b] border border-[#ff1b1b]/20 text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider scale-95 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#ff1b1b] animate-ping"></span>
              <span>v2.8</span>
            </div>
            <button onClick={toggleSoundMute} className="text-gray-400 hover:text-white p-1">
              {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            </button>
          </div>
        </div>

        {/* --- SCROLLABLE MAIN BODY STAGE --- */}
        <div className="flex-1 overflow-y-auto mt-0.5 pb-24 relative px-4 pt-2">
          
          <AnimatePresence mode="wait">
            
            {/* TAB 1: HOME (INÍCIO) */}
            {activeTab === 'inicio' && (
              <motion.div
                key="tab-home"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 font-sans"
              >
                {/* Neon Central Crown logo & banner */}
                <div className="text-center py-6 bg-gradient-to-b from-[#111]/30 to-black rounded-2xl border border-zinc-900 flex flex-col items-center justify-center relative relative overflow-hidden group">
                  <div className="absolute inset-0 bg-radial-gradient from-[#ff1b1b]/6 to-transparent pointer-events-none"></div>
                  
                  {/* Rotating orbital decoration */}
                  <div className="relative mb-3.5">
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                      className="absolute -inset-2.5 rounded-full border border-dashed border-[#ff1b1b]/20"
                    ></motion.div>
                    <div className="w-15 h-15 rounded-xl bg-gradient-to-b from-[#151515] to-[#070707] border border-[#ff1b1b]/40 flex items-center justify-center shadow-[0_0_15px_rgba(255,27,27,0.25)] relative">
                      <Crown size={28} className="text-[#ff1b1b]" />
                    </div>
                  </div>
                  
                  <span className="text-[12px] text-white font-sans font-extrabold tracking-widest uppercase">
                    PAINEL GAMER PREMIUM
                  </span>
                  
                  {/* Glow pulsing banner */}
                  <div className="mt-3.5 bg-[#22c55e]/10 border border-[#22c55e]/30 px-3.5 py-1.5 rounded-full pulse-glow">
                    <span className="font-sans font-bold text-[9px] text-[#22c55e] tracking-widest uppercase">
                      SISTEMA ATUALIZADO DIARIAMENTE • 100% ANTI BAN
                    </span>
                  </div>
                </div>

                {/* Abas de Perfis de Sensibilidades */}
                <div className="bg-[#111] border border-[#222]/80 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-3.5 px-0.5">
                    <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                      PERFIS CONFIGS ATIVOS
                    </span>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setShowConfigCreator(!showConfigCreator);
                      }}
                      className="text-[9px] font-mono font-bold tracking-wider text-[#ff1b1b] hover:text-[#ff4c4c] flex items-center gap-1"
                    >
                      <Plus size={11} /> NOVA CONFIG
                    </button>
                  </div>

                  {/* Profile creation micro dialog */}
                  <AnimatePresence>
                    {showConfigCreator && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-3.5 p-3 rounded-lg bg-[#050505] border border-[#ff1b1b]/30 space-y-2.5 overflow-hidden"
                      >
                        <div className="text-[9px] text-gray-400 font-mono font-semibold">
                          NOME DA REGEDIT ADAPTADO:
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Ex: Sensi de Carapina 10x"
                            value={newProfileName}
                            onChange={(e) => setNewProfileName(e.target.value)}
                            className="flex-1 bg-[#111] border border-zinc-800 focus:border-[#ff1b1b] rounded px-2.5 py-1.5 text-xs text-white placeholder:text-gray-600 outline-none"
                          />
                          <button
                            onClick={handleCreateNewConfig}
                            className="bg-[#ff1b1b] hover:bg-red-700 text-white font-sans text-[10px] font-bold px-3 py-1.5 rounded tracking-wider uppercase transition-colors"
                          >
                            CRIAR
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => applyConfigPreset('sensi_padrao')}
                      className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all ${
                        currentPreset === 'sensi_padrao'
                          ? 'bg-[#ff1b1b]/10 border-[#ff1b1b] shadow-[inset_0_0_10px_rgba(255,27,27,0.2)]'
                          : 'bg-[#050505] border-[#222]/80 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[9px] font-mono text-gray-500 uppercase">TÁTICO CLÁSSICO</span>
                        <ChevronRightIndicator isActive={currentPreset === 'sensi_padrao'} />
                      </div>
                      <span className="font-sans font-extrabold text-xs text-white mt-1.5 uppercase">
                        SENSI PADRÃO
                      </span>
                    </button>

                    <button
                      onClick={() => applyConfigPreset('sensi_x1')}
                      className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all ${
                        currentPreset === 'sensi_x1'
                          ? 'bg-[#ff1b1b]/10 border-[#ff1b1b] shadow-[inset_0_0_10px_rgba(255,27,27,0.2)]'
                          : 'bg-[#050505] border-[#222]/80 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[9px] font-mono text-gray-500 uppercase">ULTRA COMPETITIVO</span>
                        <ChevronRightIndicator isActive={currentPreset === 'sensi_x1'} />
                      </div>
                      <span className="font-sans font-extrabold text-xs text-white mt-1.5 uppercase">
                        X1 ELITE
                      </span>
                    </button>

                    {/* Render saved Custom config cards */}
                    {customConfigs.map((cfg) => {
                      const isCurrent = currentPreset === cfg.id;
                      return (
                        <div
                          key={cfg.id}
                          onClick={() => applyConfigPreset(cfg.id, cfg)}
                          className={`p-3 rounded-lg border text-left flex flex-col justify-between cursor-pointer transition-all relative group/card ${
                            isCurrent
                              ? 'bg-[#ff1b1b]/15 border-[#ff1b1b] shadow-[inset_0_0_10px_rgba(255,27,27,0.25)]'
                              : 'bg-[#050505] border-[#222]/80 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex justify-between items-start w-full">
                            <span className="text-[8px] font-mono text-[#ffb300] font-bold uppercase">CUSTOMIZADO</span>
                            <button
                              onClick={(e) => handleDeleteConfig(cfg.id, e)}
                              className="text-gray-600 hover:text-[#ff1b1b] transition-colors p-0.5 relative z-10 opacity-0 group-hover/card:opacity-100"
                              title="Deletar este perfil"
                            >
                              ✕
                            </button>
                          </div>
                          <span className="font-sans font-bold text-[11px] text-white mt-1.5 uppercase truncate w-full">
                            {cfg.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Seção Estilo de Sensi (Famous Players scroll) */}
                <div className="space-y-2">
                  <div className="pl-1">
                    <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                      ESTILO DE SENSI (PLAYERS)
                    </span>
                  </div>
                  
                  {/* Smooth horizontal scrollbar */}
                  <div className="flex gap-3 overflow-x-auto pb-2.5 pt-0.5 no-scrollbar select-none snap-x">
                    {FAMOUS_PLAYERS.map((player) => (
                      <button
                        key={player.id}
                        onClick={() => cloneFamousPlayerSensi(player)}
                        className="flex flex-col items-center justify-center shrink-0 snap-center bg-[#111] hover:bg-[#1a1a1a] p-3 rounded-xl border border-zinc-900 hover:border-[#ff1b1b]/40 transition-all duration-300 w-24 relative overflow-hidden group"
                      >
                        <div className="absolute top-1 right-1">
                          <Flame size={10} className="text-[#ff1b1b] animate-pulse" />
                        </div>
                        {/* Circle Avatar with custom styling glow or background indicators */}
                        <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-zinc-800 group-hover:border-[#ff1b1b] shadow-[0_0_8px_rgba(0,0,0,0.8)] transition-colors relative mb-2">
                          <img 
                            src={player.avatar} 
                            alt={player.name} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105"
                          />
                        </div>
                        <span className="text-[9px] font-sans font-bold text-gray-300 group-hover:text-white truncate w-full text-center tracking-wide">
                          {player.name}
                        </span>
                        <span className="text-[7px] text-gray-500 font-mono mt-0.5 uppercase truncate w-full text-center">
                          {player.deviceModel}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dispositivo Matching and detection */}
                <DeviceSelector 
                  selectedDevice={deviceModel} 
                  onSelect={(d) => {
                    setDeviceModel(d);
                    if (profile) updateGamerProfile(profile.uid, { deviceModel: d });
                  }} 
                />

                {/* Card Especial: Clonar Sensi de Famosos list widget teaser */}
                <div className="bg-gradient-to-r from-[#111] via-[#050505] to-[#111] border border-dashed border-[#ff1b1b]/25 rounded-2xl p-4 flex items-center justify-between select-none relative overflow-hidden group">
                  <div className="absolute top-2 left-2 bg-[#ff1b1b] text-white text-[7px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    NOVIDADE
                  </div>
                  
                  <div className="flex-1 mt-2">
                    <span className="font-sans font-extrabold text-xs text-white uppercase block tracking-wider">
                      MODO CLONE DE FAMOSOS
                    </span>
                    <p className="text-[10.5px] text-gray-400 mt-1 max-w-[210px] leading-snug">
                      Selecione Nobru, Thurzin ou Cerol na lista acima para copiar calibrações táticas.
                    </p>
                  </div>
                  
                  <div className="relative shrink-0 flex items-center justify-center translate-x-1">
                    {/* Futuristic stylized gaming anime artwork emblem mockup */}
                    <div className="w-16 h-16 bg-[#ff1b1b]/10 border border-[#ff1b1b]/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,27,27,0.3)] animate-pulse">
                      <Target size={28} className="text-[#ff1b1b] fill-[#ff1b1b]/10 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* AI Coach Partida audit and analysis */}
                <CoachIA 
                  userId={user?.uid}
                  dpiValue={sensitivities.dpi}
                  sensitivities={sensitivities}
                  boosterValue={boosterValue}
                  regeditsActive={Object.keys(regedits).filter(k => regedits[k as keyof typeof regedits])}
                />
              </motion.div>
            )}

            {/* TAB 2: SENSITIVITIES (SENSI) */}
            {activeTab === 'sensi' && (
              <motion.div
                key="tab-sensi"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                
                {/* --- SYSTEM BOOSTER SECTION --- */}
                <div className="bg-[#111] border border-[#222]/80 rounded-xl p-4 space-y-4">
                  
                  {/* Title Header */}
                  <div className="flex items-center gap-2 mb-3 px-0.5">
                    <Zap size={14} className="text-[#ffb300]" />
                    <span className="font-sans font-bold text-xs tracking-wider uppercase text-gray-200 block">
                      TELEMETRIA SISTEMA BOOSTER
                    </span>
                  </div>

                  <div className="grid grid-cols-6 gap-1.5">
                    {[5, 10, 30, 50, 100, 200].map((multiplier) => {
                      const isActive = boosterValue === multiplier;
                      return (
                        <button
                          key={multiplier}
                          onClick={() => {
                            setBoosterValue(multiplier);
                            sound.playBoosterClick();
                          }}
                          className={`py-2 rounded-lg text-[10.5px] font-orbitron font-extrabold transition-all relative ${
                            isActive
                              ? 'bg-gradient-to-b from-[#ffb300] to-[#b88100] text-black shadow-[0_0_15px_rgba(255,179,0,0.4)] border border-[#ffb300] animate-pulse scale-102'
                              : 'bg-[#050505] text-gray-400 border border-[#222]/80 hover:border-[#ffb300]/40'
                          }`}
                        >
                          {multiplier}x
                        </button>
                      );
                    })}
                  </div>

                  {/* Slider Sensibilidade da Tela */}
                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-sans font-semibold text-[10.5px] uppercase text-gray-400">
                        SENSIBILIDADE DA TELA (MACRO MASTER)
                      </span>
                      <span className="font-orbitron font-bold text-xs text-[#ff1b1b]">{boosterValue * 5}% ACCEL</span>
                    </div>
                    {/* Linear responsive red gauge slide */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={boosterValue}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setBoosterValue([5,10,30,50,100,200].reduce((prev, curr) => 
                          Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
                        ));
                      }}
                      className="w-full h-1 bg-[#1a1a1a] rounded appearance-none outline-none accent-[#ff1b1b]"
                    />
                  </div>
                </div>

                {/* --- SEÇÃO SENSIBILIDADES - Weapon Categories --- */}
                <div className="bg-[#111] border border-[#222]/80 rounded-xl p-4 space-y-3.5">
                  <div className="flex items-center gap-1.5 px-0.5 mb-1">
                    <Target size={14} className="text-[#ff1b1b] filter drop-shadow-[0_0_3px_#ff1b1b]" />
                    <span className="font-sans font-semibold text-xs text-gray-200 uppercase tracking-widest">
                      AJUSTES REVOLVERES & METRALHADORAS
                    </span>
                  </div>

                  {/* Arma de 1 Tiro */}
                  <SensiSlider
                    label="Arma [1 Tiro] (Desert Eagle/Carapina)"
                    value={sensitivities.arma1Tiro}
                    min={0}
                    max={200}
                    unit="pts"
                    onChange={(val) => setSensitivities(prev => ({...prev, arma1Tiro: val}))}
                  />

                  {/* Metralhadora */}
                  <SensiSlider
                    label="Fuzis De Assalto Metralhadora (AR)"
                    value={sensitivities.metralhadora}
                    min={0}
                    max={200}
                    unit="pts"
                    onChange={(val) => setSensitivities(prev => ({...prev, metralhadora: val}))}
                  />

                  {/* Fuzil */}
                  <SensiSlider
                    label="Fuzil De Precisão SVD / Woodpecker"
                    value={sensitivities.fuzil}
                    min={0}
                    max={200}
                    unit="pts"
                    onChange={(val) => setSensitivities(prev => ({...prev, fuzil: val}))}
                  />

                  {/* Submetralhadora */}
                  <SensiSlider
                    label="Submetralhadora Metralhadora de Curto (SMG)"
                    value={sensitivities.submetralhadora}
                    min={0}
                    max={200}
                    unit="pts"
                    onChange={(val) => setSensitivities(prev => ({...prev, submetralhadora: val}))}
                  />

                  {/* Espingarda */}
                  <SensiSlider
                    label="Espingardas & Escopetas (Doze)"
                    value={sensitivities.espingarda}
                    min={0}
                    max={200}
                    unit="pts"
                    onChange={(val) => setSensitivities(prev => ({...prev, espingarda: val}))}
                  />

                  {/* Velocidade Toque */}
                  <SensiSlider
                    label="Tempo de Resposta Toque (LATENCY)"
                    value={sensitivities.velocidadeToque}
                    min={0}
                    max={200}
                    unit="ms"
                    onChange={(val) => setSensitivities(prev => ({...prev, velocidadeToque: val}))}
                  />

                  {/* DPI */}
                  <SensiSlider
                    label="Densidade de Pixels (DPI FORCE)"
                    value={sensitivities.dpi}
                    min={240}
                    max={1200}
                    unit="dpi"
                    onChange={(val) => setSensitivities(prev => ({...prev, dpi: val}))}
                  />

                  {/* Cursor Móvel */}
                  <SensiSlider
                    label="Cursor Móvel (Touch Engine Stabilizer)"
                    value={sensitivities.cursorMovel}
                    min={0}
                    max={200}
                    unit="pts"
                    onChange={(val) => setSensitivities(prev => ({...prev, cursorMovel: val}))}
                  />
                  
                </div>

                {/* --- SEÇÃO REGEDIT ADVANCED SWITCHES --- */}
                <div className="bg-[#111] border border-[#222]/80 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-1.5 px-0.5 mb-1">
                    <Sliders size={14} className="text-[#22c55e]" />
                    <span className="font-sans font-semibold text-xs text-gray-200 uppercase tracking-widest">
                      MODULOS REGEDIT FF ADVANCED
                    </span>
                  </div>

                  {/* Tiro Sem Recuo */}
                  <RegeditSwitch
                    label="Tiro Sem Recuo (Zero Recoil)"
                    description="Otimiza a estabilização vertical da câmera tática, evitando espalhamento de cartucho para qualquer fuzil ou metralhadora automatizada."
                    checked={regedits.tiroSemRecuo}
                    onChange={(val) => setRegedits(prev => ({...prev, tiroSemRecuo: val}))}
                  />

                  {/* FF4X Sensi */}
                  <RegeditSwitch
                    label="FF4X Sensitivity Booster"
                    description="Redefine o pixel scaling do motor gráfico Android, triplicando de forma virtual a precisão na puxada de Capa de longa distância."
                    checked={regedits.ff4xSensi}
                    onChange={(val) => setRegedits(prev => ({...prev, ff4xSensi: val}))}
                  />

                  {/* Free Fire HeadShot */}
                  <RegeditSwitch
                    label="Free Fire HeadShot Lock"
                    description="Fixa o centro da mira automática de proximidade em oposição tática ao tronco, facilitando deslizamento vertical direto à cabeça."
                    checked={regedits.ffHeadshot}
                    onChange={(val) => setRegedits(prev => ({...prev, ffHeadshot: val}))}
                  />

                  {/* Probabilidade de HS 80% */}
                  <RegeditSwitch
                    label="Auxílio Mira HS (Magnetizer)"
                    description="Simula um ímã de atração dinâmica acoplado ao HUD que aumenta de forma segura os acertos críticos nos adversários."
                    checked={regedits.macroPC}
                    onChange={(val) => setRegedits(prev => ({...prev, macroPC: val}))}
                  />

                  {/* Regedit modo macro PC */}
                  <RegeditSwitch
                    label="Regedit Modo Macro PC"
                    description="Emula as coordenadas de deslize rápido encontradas em emuladores de alto padrão diretamente nas telas capacitivas móveis."
                    checked={regedits.macroPC}
                    onChange={(val) => setRegedits(prev => ({...prev, macroPC: val}))}
                  />

                  {/* Mira quase perfeita */}
                  <RegeditSwitch
                    label="Auto Tracking Perfect Lock"
                    description="Evita tremedeiras na área de Red Dot quando o botão de disparo principal é pressionado durante combates dinâmicos aéreos."
                    checked={regedits.miraPerfeita}
                    onChange={(val) => setRegedits(prev => ({...prev, miraPerfeita: val}))}
                  />

                </div>

              </motion.div>
            )}

            {/* TAB 3: OPTIMIZATION & STORE (LOJA) */}
            {activeTab === 'loja' && (
              <motion.div
                key="tab-store"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                
                {/* Ping server meter */}
                <PingMeter />

                {/* --- SEÇÃO OTIMIZAÇÃO GERAL --- */}
                <div className="bg-[#111] border border-[#222]/80 rounded-xl p-4 space-y-3.5">
                  <div className="flex items-center gap-1.5 px-0.5">
                    <Shield size={14} className="text-[#ff1b1b]" />
                    <span className="font-sans font-semibold text-xs text-gray-200 uppercase tracking-widest">
                      OTIMIZAÇÃO TÁTICA DISPOSITIVO
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {/* Switch: O Lag */}
                    <div className="bg-[#050505] border border-[#222] rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-sans font-bold text-gray-200 uppercase block">ELIMINADOR DE LAGS</span>
                        <span className="text-[9.5px] text-gray-500 font-mono mt-0.5 block">Fecha processos em background para livrar a RAM.</span>
                      </div>
                      <button
                        onClick={() => {
                          setOptimizations(o => ({...o, noLag: !o.noLag}));
                          sound.playToggleOn();
                        }}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors ${optimizations.noLag ? 'bg-[#ff1b1b]' : 'bg-zinc-800'}`}
                      >
                        <div className={`w-4.5 h-4.5 bg-white rounded-full transition-transform ${optimizations.noLag ? 'translate-x-4.5' : ''}`}></div>
                      </button>
                    </div>

                    {/* Switch: Economia Bateria */}
                    <div className="bg-[#050505] border border-[#222] rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-sans font-bold text-gray-200 uppercase block">ECONOMIA DE BATERIA</span>
                        <span className="text-[9.5px] text-gray-500 font-mono mt-0.5 block">Equilibra picos de calor da CPU gamer nos treinos.</span>
                      </div>
                      <button
                        onClick={() => {
                          setOptimizations(o => ({...o, batterySave: !o.batterySave}));
                          sound.playToggleOn();
                        }}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors ${optimizations.batterySave ? 'bg-[#ff1b1b]' : 'bg-zinc-800'}`}
                      >
                        <div className={`w-4.5 h-4.5 bg-white rounded-full transition-transform ${optimizations.batterySave ? 'translate-x-4.5' : ''}`}></div>
                      </button>
                    </div>

                    {/* Switch: Click Rápido */}
                    <div className="bg-[#050505] border border-[#222] rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-sans font-bold text-gray-200 uppercase block">CLICK RÁPIDO (HUD 3/4 DEDOS)</span>
                        <span className="text-[9.5px] text-gray-500 font-mono mt-0.5 block">Substitui as zonas mortas do display para cliques rápidos.</span>
                      </div>
                      <button
                        onClick={() => {
                          setOptimizations(o => ({...o, clickHud: !o.clickHud}));
                          sound.playToggleOn();
                        }}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors ${optimizations.clickHud ? 'bg-[#ff1b1b]' : 'bg-zinc-800'}`}
                      >
                        <div className={`w-4.5 h-4.5 bg-white rounded-full transition-transform ${optimizations.clickHud ? 'translate-x-4.5' : ''}`}></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* --- SEÇÃO FPS SELECTOR WITH ACTIVE THEME LINES --- */}
                <div className="bg-[#111] border border-[#222]/80 rounded-xl p-4 space-y-3.5">
                  <div className="flex items-center gap-1.5 px-0.5">
                    <Zap size={14} className="text-[#ffb300]" />
                    <span className="font-sans font-semibold text-xs text-gray-200 uppercase tracking-widest">
                      SELETOR DESBLOQUEIO DE FPS
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[30, 60, 90, 120, 144, 165, 240].map((fps) => {
                      const isSelected = optimizations.fpsSelector === fps;
                      return (
                        <button
                          key={fps}
                          onClick={() => {
                            setOptimizations(prev => ({...prev, fpsSelector: fps}));
                            sound.playBoosterClick();
                          }}
                          className={`py-2 px-1 rounded-lg border text-center transition-all ${
                            isSelected
                              ? 'bg-[#ff1b1b]/10 border-[#ffb300] text-[#ffb300] box-glow-gold font-bold scale-102 flex flex-col items-center justify-center relative overflow-hidden'
                              : 'bg-[#050505] border-[#222]/80 text-gray-400 hover:border-zinc-700'
                          }`}
                        >
                          <span className="font-orbitron text-xs">{fps}</span>
                          <span className="text-[7.5px] font-mono uppercase tracking-widest opacity-80 mt-0.5">FPS</span>
                          {/* Inner glowing yellow line indicator */}
                          {isSelected && (
                            <div className="absolute bottom-0 inset-x-0 h-[3px] bg-[#ffb300]"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* VIP Showcase market cards */}
                <div className="space-y-2.5">
                  <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase pl-1 block">
                    ITENS DE ELITE SENSIPRO PREMIUM
                  </span>

                  <div className="border border-zinc-900 bg-gradient-to-b from-[#111]/60 to-black rounded-2xl p-4 flex justify-between items-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-1 bg-[#ffb300] text-black font-extrabold text-[8px] font-mono tracking-wider rounded-bl uppercase">
                      VIP PREMIUM
                    </div>
                    <div>
                      <span className="font-sans font-bold text-xs text-white uppercase tracking-wide block">
                        RECURSO BYPASS PRO (ANTI-BAN GOLD)
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        Script avançado de isolamento de memória de log tático Free Fire.
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        sound.playVIPUpgrade();
                        showToastNotification('BYPASS INTEGRADO CONFIGURADO!');
                      }}
                      className="bg-[#ffb300] hover:bg-amber-500 font-orbitron font-extrabold text-[10px] text-black px-3.5 py-1.5 rounded-lg active:scale-95 transition-transform"
                    >
                      ATIVAR
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB 4: PROFILE & SETTINGS (CONFIG) */}
            {activeTab === 'config' && (
              <motion.div
                key="tab-config"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                
                {/* --- CLOUD PROFILE / LOGIN CARD --- */}
                <div className="bg-[#111] border border-[#222]/80 rounded-xl p-4">
                  {user ? (
                    <div className="flex flex-col items-center text-center p-3">
                      <div className="relative mb-3.5">
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-[#ff1b1b] p-0.5">
                          <img 
                            src={profile?.avatarUrl || user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'} 
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <div className="absolute bottom-0 right-0 p-1 bg-[#22c55e] rounded-full border-2 border-[#111]"></div>
                      </div>

                      <span className="font-sans font-bold text-sm text-white">
                        {profile?.username || user.displayName || 'Gamer VIP'}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {user.email}
                      </span>

                      <div className="w-full h-[1px] bg-zinc-800/85 my-4"></div>

                      <div className="w-full grid grid-cols-2 gap-2 text-left bg-[#050505] p-3 rounded-lg border border-[#222]/80">
                        <div>
                          <span className="text-[8px] text-gray-500 font-mono block">DEVICE LOGS</span>
                          <span className="text-[10.5px] font-sans font-bold text-[#ff1b1b] truncate block">
                            {deviceModel}
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] text-gray-500 font-mono block">CLOUD STATUS</span>
                          <span className="text-[10.5px] font-sans font-bold text-[#22c55e] block">
                            BACKUP ATIVO
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleSignOut}
                        className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-mono tracking-widest text-[#ff1b1b] hover:text-white uppercase font-bold border border-[#ff1b1b]/15 hover:border-[#ff1b1b] px-4 py-2 rounded-xl bg-red-950/10 hover:bg-[#ff1b1b]/10 transition-all w-full"
                      >
                        <LogOut size={12} />
                        <span>LOGOUT GARENA PROFILE</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <div className="w-13 h-13 rounded-xl bg-gradient-to-b from-[#ff1b1b]/10 to-[#ff1b1b]/5 border border-[#ff1b1b]/20 flex items-center justify-center mx-auto mb-3">
                        <User size={22} className="text-[#ff1b1b]" />
                      </div>
                      <span className="font-sans font-bold text-xs text-white uppercase block">
                        SINCRO CLOUD DE PRESETS SENSIPRO
                      </span>
                      <p className="text-[10px] text-gray-500 mt-1.5 max-w-[245px] mx-auto leading-relaxed">
                        Faça login utilizando Google para guardar suas sensibilidades salvas diretamente na nuvem 100% Anti Ban.
                      </p>

                      <button
                        onClick={handleGoogleSignIn}
                        className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-red-700 to-red-650 hover:from-red-600 hover:to-red-550 text-white font-sans text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider transition-colors w-full box-glow-red"
                      >
                        <LogIn size={13} />
                        <span>ENTRAR COM GOOGLE CLOUD</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* --- IMPORT / EXPORT LOCAL CONFIG --- */}
                <div className="bg-[#111] border border-[#222]/80 rounded-xl p-4 space-y-4">
                  <div className="flex items-center gap-1.5 px-0.5">
                    <FileCode size={14} className="text-[#ffb300]" />
                    <span className="font-sans font-semibold text-xs text-gray-200 uppercase tracking-widest">
                      IMPORTAR & EXPORTAR DISPARADORES
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {/* Export */}
                    <button
                      onClick={handleExportConfig}
                      className="flex-1 flex gap-1.5 items-center justify-center border border-zinc-800 hover:border-[#ffb300] bg-[#050505] hover:bg-[#ffb300]/5 text-gray-300 hover:text-[#ffb300] font-sans py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
                    >
                      <Download size={13} /> EXPORTAR .JSON
                    </button>

                    {/* Import */}
                    <button
                      onClick={() => {
                        sound.playClick();
                        document.getElementById('file-upload-input')?.click();
                      }}
                      className="flex-1 flex gap-1.5 items-center justify-center border border-zinc-800 hover:border-[#ff1b1b] bg-[#050505] hover:bg-[#ff1b1b]/5 text-gray-300 hover:text-[#ff1b1b] font-sans py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
                    >
                      <Upload size={13} /> IMPORTAR .JSON
                    </button>
                    <input
                      id="file-upload-input"
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleImportConfig}
                    />
                  </div>

                  <div className="rounded-lg bg-[#050505] border border-zinc-900 p-3 flex gap-2">
                    <AlertCircle size={14} className="text-[#ff1b1b] shrink-0 mt-0.5" />
                    <p className="text-[9.5px] text-gray-500 font-mono leading-relaxed">
                      Lembre-se de fazer novos backups regularmente. Arquivos .json exportados contém a calibração de todos os analógicos configurados na página.
                    </p>
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* --- BOTTOM BLUR GLASS NAVIGATION --- */}
        <div className="absolute bottom-0 inset-x-0 h-[64px] bg-black/60 backdrop-blur-md border-t border-[#222]/40 px-6 py-2 z-40 flex items-center justify-between select-none">
          {/* TAB 1: Inicio */}
          <button
            onClick={() => playTabChange('inicio')}
            className={`flex flex-col items-center justify-center p-2 relative shrink-0 ${activeTab === 'inicio' ? 'text-[#ff1b1b]' : 'text-gray-500 hover:text-white'}`}
          >
            <Crown size={18} className={activeTab === 'inicio' ? 'filter drop-shadow-[0_0_4px_#ff1b1b]' : ''} />
            <span className="text-[10px] font-orbitron font-extrabold tracking-wider uppercase mt-1">Início</span>
            {activeTab === 'inicio' && (
              <motion.div layoutId="active-line" className="absolute -bottom-0.5 w-6 h-0.5 bg-[#ff1b1b]" />
            )}
          </button>

          {/* TAB 2: Sensi */}
          <button
            onClick={() => playTabChange('sensi')}
            className={`flex flex-col items-center justify-center p-2 relative shrink-0 ${activeTab === 'sensi' ? 'text-[#ff1b1b]' : 'text-gray-500 hover:text-white'}`}
          >
            <Sliders size={18} className={activeTab === 'sensi' ? 'filter drop-shadow-[0_0_4px_#ff1b1b]' : ''} />
            <span className="text-[10px] font-orbitron font-extrabold tracking-wider uppercase mt-1">Sensi</span>
            {activeTab === 'sensi' && (
              <motion.div layoutId="active-line" className="absolute -bottom-0.5 w-6 h-0.5 bg-[#ff1b1b]" />
            )}
          </button>

          {/* TAB 3: Loja (VIP/Otimização) */}
          <button
            onClick={() => playTabChange('loja')}
            className={`flex flex-col items-center justify-center p-2 relative shrink-0 ${activeTab === 'loja' ? 'text-[#ff1b1b]' : 'text-gray-500 hover:text-white'}`}
          >
            <ShoppingBag size={18} className={activeTab === 'loja' ? 'filter drop-shadow-[0_0_4px_#ff1b1b]' : ''} />
            <span className="text-[10px] font-orbitron font-extrabold tracking-wider uppercase mt-1">Loja</span>
            {activeTab === 'loja' && (
              <motion.div layoutId="active-line" className="absolute -bottom-0.5 w-6 h-0.5 bg-[#ff1b1b]" />
            )}
          </button>

          {/* TAB 4: Config */}
          <button
            onClick={() => playTabChange('config')}
            className={`flex flex-col items-center justify-center p-2 relative shrink-0 ${activeTab === 'config' ? 'text-[#ff1b1b]' : 'text-gray-500 hover:text-white'}`}
          >
            <Settings size={18} className={activeTab === 'config' ? 'filter drop-shadow-[0_0_4px_#ff1b1b]' : ''} />
            <span className="text-[10px] font-orbitron font-extrabold tracking-wider uppercase mt-1">Config</span>
            {activeTab === 'config' && (
              <motion.div layoutId="active-line" className="absolute -bottom-0.5 w-6 h-0.5 bg-[#ff1b1b]" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

// Minimal icons layout indicators helper
function ChevronRightIndicator({ isActive }: { isActive: boolean }) {
  return (
    <div className={`w-3.5 h-3.5 rounded-full border border-zinc-800 flex items-center justify-center transition-all ${
      isActive ? 'bg-[#ff1b1b]' : 'bg-transparent'
    }`}>
      {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
    </div>
  );
}
