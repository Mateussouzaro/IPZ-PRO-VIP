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
      Você é o "COACH SENSIPRO IA" e deve assumir a Persona e o estilo do lendário jogador focado: ${targetPersona}.
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

      3. **🛠️ RECOMENDAÇÃO TÁTICA DE AJUSTES**
         - Sugira novos valores de números ideais para esses sliders específicos e para DPI.

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
export default analyzeGameplayWithGemini;
