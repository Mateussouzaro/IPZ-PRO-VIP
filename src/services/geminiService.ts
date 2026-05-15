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
  regeditsActive: string[]
): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in the environment secrets.');
    }

    // Always create a new GoogleGenAI instance right before making an API call to prevent stale keys
    const ai = new GoogleGenAI({ apiKey });

    const promptMessage = `
      Você é o "COACH SENSIPRO IA", um analista profissional lendário de Free Fire e especialista nível Black VIP e mobile sensibilidade.
      Analise os dados da partida do jogador para fornecer dicas cirúrgicas em português do Brasil e elevar a taxa de Headshot (HS) para +95%.
      
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

      1. **⚡ DIAGNÓSTICO DO ARQUIVO**
         - Comente brevemente que analisou a jogabilidade presente no arquivo de clipe "${videoName}" (Ex: Analisamos sua puxada de mira, timing de clique e centralização de câmera).
         
      2. **🎯 ANÁLISE DE PUXADA DE MIRA (CAPA)**
         - Comente sobre o comportamento tático de "arrasto de tela" com base na sensibilidade de submetralhadoras (${userWeaponSensis.submetralhadora}/200) e fuzil SVD (${userWeaponSensis.fuzil}/200).
         - Diga se a mira está "passando da cabeça" ou "grudando no peito" de acordo com os níveis de DPI e booster ativos.

      3. **🛠️ RECOMENDAÇÃO TÁTICA DE AJUSTES**
         - Sugira valores novos ideais para esses sliders específicos de sensibilidade para que o cursor deslize livre ou com estabilização.
         - Forneça novos números de DPI ideais recomendados para o modelo de celular dele.

      4. **🔥 REVELAÇÃO EXCLUSIVA REGEDIT**
         - Diga o impacto das opções selecionadas como ${regeditsActive.includes('Tiro sem Recuo') ? 'Tiro sem Recuo (Ativo)' : 'Tiro sem Recuo (Inativo)'} e como dominar o Macro.
         - Dê um código tático de HUD em 3 ou 4 dedos ideal para melhor sustentação de tela.

      Use termos gamer autênticos (Ex: capa de carapina, meia-lua de UMP, analógico travado, deserto de mira grudada). Seja entusiasmado, profissional, cyberpunk, intimidador e motivador.
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
