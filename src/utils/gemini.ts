import { logger } from './logger.js';

/**
 * Cliente para Google Gemini API
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface GeminiGenerateOptions {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

/**
 * Genera contenido usando Gemini API
 */
export async function generateWithGemini(options: GeminiGenerateOptions): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const { prompt, temperature = 0.7, maxTokens = 2048 } = options;

  logger.info('Calling Gemini API...');

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    logger.error('Gemini API error:', error);
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = (await response.json()) as GeminiResponse;

  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('No response from Gemini API');
  }

  const text = data.candidates[0].content.parts[0].text;
  logger.info('Gemini API response received');

  return text;
}

/**
 * Genera un concepto de criatura usando Gemini
 */
export async function generateCreatureConcept(params: {
  theme: string;
  index: number;
  total: number;
  tier: 1 | 2 | 3;
}): Promise<{
  name: string;
  types: [string] | [string, string];
  description: string;
  archetype: string;
}> {
  const { theme, index, total, tier } = params;

  const tierNames = {
    1: 'starter/basic',
    2: 'evolved/intermediate',
    3: 'final/legendary',
  };

  const prompt = `You are creating a creature for a Pokémon-style game with the theme: "${theme}".

This is creature ${index + 1} of ${total}.
Tier: ${tierNames[tier]} (1=weakest, 3=strongest)

Create a unique creature concept with:
1. Name (creative, fits the theme)
2. Type(s) (1 or 2 from: normal, fire, water, grass, electric, ice, fighting, poison, ground, flying, psychic, bug, rock, ghost, dragon, dark, steel, fairy)
3. Short description (1-2 sentences, Pokédex-style)
4. Battle archetype (physical/special/tank/speedy/balanced)

Respond ONLY with valid JSON in this exact format:
{
  "name": "CreatureName",
  "types": ["type1", "type2"],
  "description": "A brief description of the creature.",
  "archetype": "physical"
}

Make it creative and thematic!`;

  const response = await generateWithGemini({ prompt, temperature: 0.9 });

  // Parsear respuesta JSON
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Invalid JSON response from Gemini');
  }

  const concept = JSON.parse(jsonMatch[0]);

  // Validar que tiene 1 o 2 tipos
  if (concept.types.length > 2) {
    concept.types = concept.types.slice(0, 2);
  }

  return concept;
}
