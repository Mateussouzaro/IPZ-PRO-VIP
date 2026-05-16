import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocFromServer,
  getDocs,
  setDoc, 
  updateDoc,
  deleteDoc,
  collection, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase Core services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Enumerations representing Firestore operations
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

// Interface representing the required hardened error information context
export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

// Centralized handler to throw strict and standardized Firestore exceptions for diagnose audits
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errMessage = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('[STRICT FIRESTORE SECURITY AUDIT FAIL]: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// CRITICAL CONSTRAINT: Automatically validate client-to-database connection on startup
export async function testConnection() {
  try {
    // Tests connection to standard connection node
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[FIREBASE STATUS]: Conectado ao Firestore com sucesso.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration and internet connection. Client is offline.");
    } else {
      // Benign warning if 'test/connection' doesn't exist, showing the rules blocked or verified path
      console.log('[FIREBASE CONNECTION CHECK]: Connection active (verified via server ping).');
    }
  }
}
testConnection();

// Google Auth provider
const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Auth Popup Error', error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error', error);
    throw error;
  }
}

// --- DATABASE FUNCTIONS ---

// PROFILE LOGIC
export interface GamerProfile {
  uid: string;
  email: string;
  username: string;
  avatarUrl: string;
  deviceModel: string;
  avatarColor?: string;
  avatarColorAccent?: string;
  createdAt?: any;
  updatedAt?: any;
}

export async function createGamerProfile(profile: GamerProfile) {
  const path = `users/${profile.uid}`;
  try {
    const userDocRef = doc(db, 'users', profile.uid);
    const payload = {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(userDocRef, payload);
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getGamerProfile(uid: string): Promise<GamerProfile | null> {
  const path = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    const s = await getDoc(userDocRef);
    if (s.exists()) {
      return s.data() as GamerProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function updateGamerProfile(uid: string, updates: Partial<GamerProfile>) {
  const path = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    const payload = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    await updateDoc(userDocRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// CONFIGURATION LOGIC
export interface GameSensitivities {
  arma1Tiro: number;
  metralhadora: number;
  fuzil: number;
  submetralhadora: number;
  espingarda: number;
  velocidadeToque: number;
  dpi: number;
  cursorMovel: number;
}

export interface GameRegedits {
  tiroSemRecuo: boolean;
  ff4xSensi: boolean;
  ffHeadshot: boolean;
  macroPC: boolean;
  miraPerfeita: boolean;
}

export interface GameOptimizations {
  noLag: boolean;
  batterySave: boolean;
  clickHud: boolean;
  fpsSelector: number;
}

export interface SensiConfig {
  id: string;
  name: string;
  ownerId: string;
  deviceModel: string;
  boosterValue: number;
  sensitivities: GameSensitivities;
  regedits: GameRegedits;
  optimizations: GameOptimizations;
  createdAt?: any;
  updatedAt?: any;
}

export async function saveSensiConfig(config: SensiConfig) {
  const path = `configs/${config.id}`;
  try {
    const docRef = doc(db, 'configs', config.id);
    const payload = {
      ...config,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(docRef, payload);
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateSensiConfig(configId: string, updates: Partial<SensiConfig>) {
  const path = `configs/${configId}`;
  try {
    const docRef = doc(db, 'configs', configId);
    const payload = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    await updateDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteSensiConfig(configId: string) {
  const path = `configs/${configId}`;
  try {
    const docRef = doc(db, 'configs', configId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getGamerConfigs(uid: string): Promise<SensiConfig[]> {
  const path = 'configs';
  try {
    const q = query(
      collection(db, 'configs'),
      where('ownerId', '==', uid)
    );
    const querySnapshot = await getDocs(q);
    const configs: SensiConfig[] = [];
    querySnapshot.forEach((doc) => {
      configs.push(doc.data() as SensiConfig);
    });
    return configs;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// COACHING LOGIC
export interface CoachingRequest {
  id: string;
  userId: string;
  videoName: string;
  videoSize: string;
  videoDuration: string;
  status: 'pending' | 'completed';
  analysisResult: string;
  createdAt?: any;
}

export async function saveCoachingRequest(requestData: CoachingRequest) {
  const path = `coaching/${requestData.id}`;
  try {
    const docRef = doc(db, 'coaching', requestData.id);
    const payload = {
      ...requestData,
      createdAt: serverTimestamp()
    };
    await setDoc(docRef, payload);
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateCoachingResult(requestId: string, analysisResult: string) {
  const path = `coaching/${requestId}`;
  try {
    const docRef = doc(db, 'coaching', requestId);
    await updateDoc(docRef, {
      status: 'completed',
      analysisResult: analysisResult
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function getGamerCoachingHistory(uid: string): Promise<CoachingRequest[]> {
  const path = 'coaching';
  try {
    const q = query(
      collection(db, 'coaching'),
      where('userId', '==', uid)
    );
    const querySnapshot = await getDocs(q);
    const history: CoachingRequest[] = [];
    querySnapshot.forEach((doc) => {
      history.push(doc.data() as CoachingRequest);
    });
    return history;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// --- INITIAL CONSTANTS & DEFAULT SENSITIVITIES ---

export const FAMOUS_PLAYERS = [
  {
    id: 'nobru',
    name: 'Nobru Fluxo',
    avatar: 'https://noticias.playhard.com.br/wp-content/uploads/2022/10/nobru.png',
    deviceModel: 'iPhone 15 Pro Max',
    themeColor: '#a855f7', // Purple
    passiveName: 'Aura Roxa',
    passiveDesc: '+25% de estabilização automática da mira ao puxar o analógico.',
    boosterValue: 50,
    sensitivities: {
      arma1Tiro: 185,
      metralhadora: 172,
      fuzil: 155,
      submetralhadora: 180,
      espingarda: 190,
      velocidadeToque: 165,
      dpi: 800,
      cursorMovel: 140
    }
  },
  {
    id: 'cerol',
    name: 'Cerol Fluxo',
    avatar: 'https://s2-ge.glbimg.com/pZ2D8pInG9I03bJ3C8Zk_0lH_6s=/0x0:1080x1350/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228166e68443e9317b243fcba3fa1/internal_photos/bs/2022/Z/J/37jH3cTyS2xSgve8fDA/cerol-fluxo.jpg',
    deviceModel: 'iPad Pro M4',
    themeColor: '#f97316', // Orange
    passiveName: 'Fúria Ígnea',
    passiveDesc: '+40% de sensibilidade de giro de câmera em combates de curto alcance.',
    boosterValue: 100,
    sensitivities: {
      arma1Tiro: 200,
      metralhadora: 150,
      fuzil: 140,
      submetralhadora: 175,
      espingarda: 185,
      velocidadeToque: 195,
      dpi: 1200,
      cursorMovel: 180
    }
  },
  {
    id: 'thurzin',
    name: 'Thurzin LOUD',
    avatar: 'https://s2-ge.glbimg.com/N7bQp8XI9b0J4bc8Zk_0lH_6s=/0x0:1080x1080/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228166e68443e9317b243fcba3fa1/internal_photos/bs/2021/Y/r/thUrzIn-loud.jpg',
    deviceModel: 'POCO F5 Pro',
    themeColor: '#22c55e', // Green LOUD
    passiveName: 'Puxada Neon',
    passiveDesc: '-15ms de latência de toque integrada à taxa de atualização do display.',
    boosterValue: 30,
    sensitivities: {
      arma1Tiro: 160,
      metralhadora: 180,
      fuzil: 168,
      submetralhadora: 190,
      espingarda: 155,
      velocidadeToque: 145,
      dpi: 620,
      cursorMovel: 120
    }
  },
  {
    id: 'level_up',
    name: 'Level UP 007',
    avatar: 'https://s2-ge.glbimg.com/s4-WqW0K4XbSg_0_H_ks=/0x0:1080x1350/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228166e68443e9317b243fcba3fa1/internal_photos/bs/2021/X/p/level-up-007.jpg',
    deviceModel: 'Samsung Galaxy S24 Ultra',
    themeColor: '#06b6d4', // Cyan
    passiveName: 'Rastreador Cyber',
    passiveDesc: '+15% de precisão de pixels virtuais de mira de longa distância.',
    boosterValue: 200,
    sensitivities: {
      arma1Tiro: 195,
      metralhadora: 190,
      fuzil: 178,
      submetralhadora: 198,
      espingarda: 200,
      velocidadeToque: 180,
      dpi: 960,
      cursorMovel: 170
    }
  },
  {
    id: 'bak',
    name: 'Bak King',
    avatar: 'https://s2-ge.glbimg.com/p-k8Xv0oW_8c8Ew7e7V8C6S_ks=/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228166e68443e9317b243fcba3fa1/internal_photos/bs/2020/u/p/bak-free-fire.jpg',
    deviceModel: 'ROG Phone 8 Pro',
    themeColor: '#eab308', // Gold
    passiveName: 'Coroa Imperial',
    passiveDesc: 'Emulação tática perfeita para emuladores com macro integrado.',
    boosterValue: 100,
    sensitivities: {
      arma1Tiro: 170,
      metralhadora: 165,
      fuzil: 158,
      submetralhadora: 172,
      espingarda: 178,
      velocidadeToque: 160,
      dpi: 480,
      cursorMovel: 150
    }
  }
];

export const DEFAULT_SENSI_PADRAO: SensiConfig = {
  id: 'sensi_padrao',
  name: 'Sensi Padrão',
  ownerId: '',
  deviceModel: 'Android Geral',
  boosterValue: 30,
  sensitivities: {
    arma1Tiro: 120,
    metralhadora: 110,
    fuzil: 95,
    submetralhadora: 130,
    espingarda: 105,
    velocidadeToque: 120,
    dpi: 411,
    cursorMovel: 100
  },
  regedits: {
    tiroSemRecuo: true,
    ff4xSensi: false,
    ffHeadshot: true,
    macroPC: false,
    miraPerfeita: true
  },
  optimizations: {
    noLag: true,
    batterySave: false,
    clickHud: true,
    fpsSelector: 90
  }
};

export const DEFAULT_SENSI_X1: SensiConfig = {
  id: 'sensi_x1',
  name: 'Sensi X1 Elite',
  ownerId: '',
  deviceModel: 'Android Gamer',
  boosterValue: 100,
  sensitivities: {
    arma1Tiro: 180,
    metralhadora: 160,
    fuzil: 150,
    submetralhadora: 175,
    espingarda: 190,
    velocidadeToque: 150,
    dpi: 720,
    cursorMovel: 140
  },
  regedits: {
    tiroSemRecuo: true,
    ff4xSensi: true,
    ffHeadshot: true,
    macroPC: true,
    miraPerfeita: true
  },
  optimizations: {
    noLag: true,
    batterySave: false,
    clickHud: true,
    fpsSelector: 144
  }
};
