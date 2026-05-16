import { GoogleGenAI } from '@google/genai';

/**
 * Executes advanced intelligence coaching audits for gaming play clips
 * using the modern @google/genai SDK with gemini-3-flash-preview.
 */
export async function analyzeGameplayWithGemini(
  videoName: string,
  videoSize: string,
  userSelectedDPI: number,
  userWeaponSensis: {
    arma1Tiro: number;
    metralhadora: number;
    fuzil: number;
    submetralhadora: number;
    espingarda: number;
  },
  boosterValue: number,
  regeditsActive: string[],
  activePlayerId?: string
): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in the environment secrets.');
    }

    // Always create a new GoogleGenAI instance right before making an API call to prevent stale keys
    const ai = new GoogleGenAI({ apiKey });

    // Persona customization instructions mapped to each pro player
    const personaMap: Record<string, string> = {
      nobru: 'Nobru (Capitão do Fluxo, humilde, usa bastante "fé em Deus", "ai apelão", "Nobruzeira apelão falando", "tropinha", "amassar na sensi")',
      cerol: 'Cerol (Líder do Fluxo, super enérgico, usa termos como "Vapo", "puxa o rabo do dragão", "sensi pesada", "cerol na área", "capa reto" e brinca com o analógico)',
      thurzin: 'Thurzin (Mestre snipador pro da LOUD, usa termos como "menor dente de metal", "puxada rápida", "sniper calibration", "zerar latência", gírias paulistas da LOUD)',
      level_up: 'Level Up 007 (Estilo cirúrgico, cibernético e estratégico, focado em posicionamento, movimentação 007, física do toque, "rastreador e calibrador")',
      bak: 'Bak (O Rei Imperial, postura royale, usa gírias cariocas descontraídas como "menor, Bak na voz", "tropa do rei", impera no emulador, soberano)'
    };

    const targetPersona = personaMap[activePlayerId || 'nobru'] || personaMap.nobru;

    const promptMessage = `
      Você é o "COACH IPZ SENSI PREMIUM" IA e deve assumir a Persona e o estilo do lendário jogador focado: ${targetPersona}.
      Use as gírias dele, chame o jogador pela gíria respectiva e fale exatamente com o vocabulário, ritmo e paixão característicos deste pro-player!
      
      DADOS DO JOGADOR RECEBIDOS:
      - Arquivo de Vídeo: "${videoName}" (Tamanho: ${videoSize})
      - DPI Configurado: ${userSelectedDPI} DPI
      - Sensibilidades Atuais:
        * Arma de 1 Tiro (Desert/Carapina): ${userWeaponSensis.arma1Tiro}/200
        * Metralhadora (M4A1/Scar): ${userWeaponSensis.metralhadora}/200
        * Fuzil (SVD/Parafal): ${userWeaponSensis.fuzil}/200
        * Submetralhadora (MP5/UMP): ${userWeaponSensis.submetralhadora}/200
        * Espingarda (M1014/M1887/Mag7): ${userWeaponSensis.espingarda}/200
      - Multiplicador Booster: ${boosterValue}x ativo
      - Tweaks Ativos: [${regeditsActive.join(', ')}]

      Gere uma resposta estruturada de forma extraordinária e premium em Markdown, com formato futurista e tático gamer, dividida nas seguintes seções:

      1. **⚡ DIAGNÓSTICO DO ARQUIVO POR ${activePlayerId?.toUpperCase() || 'NOBRU'}**
         - Comente na sua persona sobre o clipe de jogo "${videoName}". Reaja de forma enérgica e autêntica do seu jeito ao arquivo!
         
      2. **🎯 ANÁLISE DE PUXADA DE MIRA (CAPA)**
         - Comente sobre o comportamento tático de "arrasto de tela" com base na sensibilidade de submetralhadoras (${userWeaponSensis.submetralhadora}/200) e fuzil SVD (${userWeaponSensis.fuzil}/200).
         - Use suas gírias marcantes para dizer se a mira está "passando da cabeça" ou "grudando no peito".
         - Apresente um código ADB de calibração ultra-preciso (ex: \`settings put system pointer_speed 6\`) livre de banimentos para este comportamento.

      3. **🛠️ RECOMENDAÇÃO TÁTICA E CÓDIGOS ADB PREMIUM**
         - Sugira novos valores de números ideais para esses sliders específicos e para DPI.
         - Forneça comandos ADB adicionais de alto rendimento para otimizar os toques ocultando atraso (ex: \`settings put secure long_press_timeout 250\`, \`settings put system touch_accuracy_multiplier 3\`) que facilitem puxar capas Full vermelhos sem perigo de ban.

      4. **🔥 REVELAÇÃO EXCLUSIVA DE MESTRE**
         - Dê uma dica secreta sua (sua habilidade passiva especial fictícia no app ou tática secreta) para ele amassar em campeonatos de Free Fire.

      Seja extremamente fiel ao vocabulário do jogador selecionado! Divirta o usuário com frases marcantes e inspiradoras.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: promptMessage,
      config: {
        systemInstruction: 'Você é o Coach VIP Premium SensiPro, mestre hacker de sensibilidade militar gamer para Free Fire.',
        temperature: 0.85,
        topK: 40,
        topP: 0.95
      }
    });

    const parsedText = response.text;
    if (!parsedText) {
      throw new Error('Retorno vazio do modelo Gemini AI.');
    }
    return parsedText;

  } catch (error) {
    console.error('Failed to query Gemini Coach IA', error);
    return `
### ❌ FALHA DE CONEXÃO IA

Ocorreu um erro ao consultar o Coach Cósmico IA.
**Erro detectado:** ${error instanceof Error ? error.message : String(error)}

**Recomendação de Emergência:**
- Verifique se a sua Chave de API está configurada nos segredos do AI Studio em **Settings > Secrets**.
- Certifique-se de que os valores de DPI (${userSelectedDPI}) e Booster (${boosterValue}x) estão configurados corretamente no painel.
    `;
  }
}

/**
 * Interface for the structured response from IPZ GERADOR SENSI VIP
 */
export interface VipSensiChatResponse {
  message: string;
  hasSensi: boolean;
  sensitivities?: {
    arma1Tiro: number;
    metralhadora: number;
    fuzil: number;
    submetralhadora: number;
    espingarda: number;
    dpi: number;
    velocidadeToque: number;
    cursorMovel: number;
  };
}

/**
 * Generates custom sensitivities and a premium gaming response for IPZ GERADOR SENSI VIP chat.
 * Scale is 0 to 200, strictly following the user's instruction.
 * Contains no ADB codes as requested.
 */
export async function generateVipSensiChatResponse(
  userPrompt: string,
  chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[],
  currentDevice: string,
  currentDpi: number
): Promise<VipSensiChatResponse> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in the environment secrets.');
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format history for the API call
    const formattedContents = chatHistory.map(item => ({
      role: item.role,
      parts: item.parts
    }));

    // Add current user prompt
    formattedContents.push({
      role: 'user',
      parts: [{ text: userPrompt }]
    });

    const systemInstruction = `
      Você é o "IPZ GERADOR SENSI VIP", a inteligência artificial definitiva de calibragem e gerador de Sensibilidade VIP para Free Fire (FF).
      Seu objetivo é gerar sensibilidades perfeitas de 0 a 200 que garantem "Full Capa" (taxa altíssima de acertos vermelhos na cabeça).
      
      Diretrizes de Comportamento e Resposta:
      1. Use gírias e vocabulário gamer brasileiro do Free Fire (termos como "amassar", "puxar capa", "full vermelho", "sensibilidade de mestre", "trilhares", "grudar na cabeça", "passar da mira", "peito não é braço", "estilo clipada").
      2. Mantenha um tom enérgico, de suporte VIP, místico militar e amigável.
      3. IMPORTANTE: Não forneça códigos no estilo comando ADB ou Terminal (como "settings put..."). Se o usuário perguntar sobre ADB, explique educadamente que seus algoritmos de 0 a 200 agora são injetados diretamente nas configurações do Sensi App para máxima facilidade e segurança antiban física, sem precisar de cabos ou comandos de prompt.
      4. Quando o usuário pedir ou sugerir uma nova sensibilidade (ou se ele sugerir um dispositivo específico como Samsung, Motorola, iPhone, Xiaomi, ASUS), crie um Preset VIP calibrado precisamente com sensibilidades na escala de 0 a 200!
      5. Na resposta, envie um texto explicativo incrível sobre como esses valores foram calculados para o aparelho dele ou estilo de jogo (por exemplo, mira leve, mira média, foco em armas de 1 tiro ou automática), e marque hasSensi como true enviando os novos valores no objeto de sensibilidades correspondente.
    `;

    // Import Type dynamically/explicitly to keep type safety
    const { Type } = await import('@google/genai');

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.85,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['message', 'hasSensi'],
          properties: {
            message: {
              type: Type.STRING,
              description: 'A resposta do chat no formato Markdown estilizado para eSports e games. Explique a calibração de forma animada.'
            },
            hasSensi: {
              type: Type.BOOLEAN,
              description: 'Defina como true se a mensagem do usuário pede por uma sensibilidade nova, sugestão de sensi, ou se você estiver gerando/sugerindo um ajuste.'
            },
            sensitivities: {
              type: Type.OBJECT,
              description: 'Objeto opcional contendo de 0 a 200 as novas sensibilidades ideais que o App pode aplicar.',
              properties: {
                arma1Tiro: { type: Type.INTEGER, description: 'Sensibilidade para arma de 1 tiro (Desert Eagle, Carapina). Escala de 0 a 200.' },
                metralhadora: { type: Type.INTEGER, description: 'Sensibilidade para fuzis metralhadoras (Scar, M4A1). Escala de 0 a 200.' },
                fuzil: { type: Type.INTEGER, description: 'Sensibilidade de arrasto para miras longas (SVD, Woodpecker). Escala de 0 a 200.' },
                submetralhadora: { type: Type.INTEGER, description: 'Sensibilidade para submetralhadoras (SMG: UMP, MP5). Escala de 0 a 200.' },
                espingarda: { type: Type.INTEGER, description: 'Sensibilidade para espingardas / escopetas de curto alcance (M1014, Mag7). Escala de 0 a 200.' },
                dpi: { type: Type.INTEGER, description: 'DPI ideal sugerida para o celular dele (Geralmente entre 500 e 960).' },
                velocidadeToque: { type: Type.INTEGER, description: 'Velocidade de toque na tela / resposta ideal (em milissegundos, ex: 10 a 100).' },
                cursorMovel: { type: Type.INTEGER, description: 'Velocidade da escala de cursor móvel do sistema (ex: 1 a 10).' }
              }
            }
          }
        }
      }
    });

    const parsedText = response.text;
    if (!parsedText) {
      throw new Error('Retorno nulo do IPZ Gerador Sensi.');
    }

    const data: VipSensiChatResponse = JSON.parse(parsedText);
    return data;

  } catch (error) {
    console.error('Failed to query Gemini IPZ Chat', error);
    return {
      message: `### ⚠️ ERRO DE COMUNICAÇÃO NEURAL\n\nNão foi possível alcançar a rede secreta da IPZ Sensi IA.\n\n**Detalhes do erro:** ${error instanceof Error ? error.message : String(error)}\n\nTente recarregar as credenciais API nas configurações de segredos do AI Studio!`,
      hasSensi: false
    };
  }
}

export default analyzeGameplayWithGemini;
