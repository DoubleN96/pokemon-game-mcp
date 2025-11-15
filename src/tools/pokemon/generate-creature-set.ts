import { generateCreatureConcept } from '../../utils/gemini.js';
import { generateBalancedStats } from '../../bridges/essentials-adapter.js';
import type { CreatureData } from '../../types/creature.js';
import { logger } from '../../utils/logger.js';
import { createCreatureTool } from './create-creature.js';

/**
 * Tool: generate_creature_set
 * Genera un conjunto completo de criaturas usando IA (Gemini)
 */

export const generateCreatureSetTool = {
  name: 'generate_creature_set',
  description:
    'Generate a complete set of themed creatures using AI (requires GEMINI_API_KEY)',
  inputSchema: {
    type: 'object',
    properties: {
      project_path: {
        type: 'string',
        description: 'Path to the RPG Maker MZ project',
      },
      theme: {
        type: 'string',
        description:
          'Theme for the creature set (e.g., "Madrid landmarks", "Ocean creatures", "Desert animals")',
      },
      count: {
        type: 'number',
        description: 'Number of creatures to generate',
        default: 20,
      },
      tier_distribution: {
        type: 'object',
        description: 'Distribution of creatures by tier (default: 50% tier1, 30% tier2, 20% tier3)',
        properties: {
          tier1: { type: 'number', description: 'Percentage of tier 1 creatures (0-1)' },
          tier2: { type: 'number', description: 'Percentage of tier 2 creatures (0-1)' },
          tier3: { type: 'number', description: 'Percentage of tier 3 creatures (0-1)' },
        },
      },
      starting_id: {
        type: 'number',
        description: 'Starting creature ID (default: auto-detect next available)',
      },
      generate_sprites: {
        type: 'boolean',
        description: 'Whether to generate sprites using AI (experimental)',
        default: false,
      },
    },
    required: ['project_path', 'theme'],
  },

  async execute(args: Record<string, unknown>) {
    const projectPath = args.project_path as string;
    const theme = args.theme as string;
    const count = (args.count as number) ?? 20;
    const generateSprites = (args.generate_sprites as boolean) ?? false;

    const tierDistribution = (args.tier_distribution as Record<string, number>) ?? {
      tier1: 0.5,
      tier2: 0.3,
      tier3: 0.2,
    };

    logger.info(`Generating ${count} creatures with theme: "${theme}"`);

    // Validar distribución
    const totalPercentage = tierDistribution.tier1 + tierDistribution.tier2 + tierDistribution.tier3;
    if (Math.abs(totalPercentage - 1.0) > 0.01) {
      throw new Error(
        `Tier distribution must sum to 1.0 (got ${totalPercentage}). Please adjust tier1, tier2, tier3 percentages.`
      );
    }

    // Calcular cantidad de criaturas por tier
    const tierCounts = {
      1: Math.round(count * tierDistribution.tier1),
      2: Math.round(count * tierDistribution.tier2),
      3: Math.round(count * tierDistribution.tier3),
    };

    // Ajustar si el redondeo causó diferencia
    const totalCreatures = tierCounts[1] + tierCounts[2] + tierCounts[3];
    if (totalCreatures !== count) {
      tierCounts[1] += count - totalCreatures;
    }

    logger.info(
      `Distribution: Tier 1: ${tierCounts[1]}, Tier 2: ${tierCounts[2]}, Tier 3: ${tierCounts[3]}`
    );

    const createdCreatures: Array<{
      id: number;
      name: string;
      types: string[];
      tier: number;
    }> = [];
    const errors: Array<{ index: number; error: string }> = [];

    let currentId = (args.starting_id as number) ?? 0;
    let creatureIndex = 0;

    // Generar criaturas por tier
    for (const [tierStr, tierCount] of Object.entries(tierCounts)) {
      const tier = parseInt(tierStr) as 1 | 2 | 3;

      for (let i = 0; i < tierCount; i++) {
        try {
          logger.info(`Generating creature ${creatureIndex + 1}/${count} (Tier ${tier})...`);

          // Generar concepto con Gemini
          const concept = await generateCreatureConcept({
            theme,
            index: creatureIndex,
            total: count,
            tier,
          });

          // Generar stats balanceados según tier y arquetipo
          const baseStats = generateBalancedStats(tier, concept.archetype);

          // Determinar catch rate y exp yield según tier
          const catchRateByTier = {
            1: 190, // Más fácil de capturar
            2: 90, // Dificultad media
            3: 45, // Difícil (legendarios)
          };

          const expYieldByTier = {
            1: 64,
            2: 142,
            3: 220,
          };

          // Crear datos de criatura
          const creatureData: Omit<CreatureData, 'id'> & { id?: number } = {
            id: currentId || undefined,
            name: concept.name,
            types: concept.types as CreatureData['types'],
            baseStats,
            catchRate: catchRateByTier[tier],
            expYield: expYieldByTier[tier],
            description: concept.description,
            moves: generateDefaultMoves(tier),
            evolution: undefined, // TODO: Implementar cadenas evolutivas
          };

          // Usar el tool create_creature para crear la criatura
          const result = await createCreatureTool.execute({
            project_path: projectPath,
            creature_data: {
              id: creatureData.id,
              name: creatureData.name,
              types: creatureData.types,
              base_stats: {
                hp: baseStats.hp,
                attack: baseStats.attack,
                defense: baseStats.defense,
                sp_attack: baseStats.spAttack,
                sp_defense: baseStats.spDefense,
                speed: baseStats.speed,
              },
              catch_rate: creatureData.catchRate,
              exp_yield: creatureData.expYield,
              description: creatureData.description,
              moves: creatureData.moves.map((m) => ({
                level: m.level,
                move_name: m.moveName,
              })),
            },
            generate_sprite: generateSprites,
          });

          const creatureResult = result as {
            creature: { id: number; name: string; types: string[] };
          };

          createdCreatures.push({
            id: creatureResult.creature.id,
            name: creatureResult.creature.name,
            types: creatureResult.creature.types,
            tier,
          });

          currentId = creatureResult.creature.id + 1;
          creatureIndex++;

          logger.info(`✓ Created: ${concept.name} (ID: ${creatureResult.creature.id})`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          logger.error(`Failed to generate creature ${creatureIndex + 1}:`, errorMessage);
          errors.push({
            index: creatureIndex,
            error: errorMessage,
          });
          creatureIndex++;
        }
      }
    }

    logger.info(`Generation complete: ${createdCreatures.length}/${count} creatures created`);

    return {
      success: createdCreatures.length > 0,
      theme,
      creatures_created: createdCreatures.length,
      creatures_failed: errors.length,
      creatures: createdCreatures,
      errors: errors.length > 0 ? errors : undefined,
      next_steps: [
        'Review generated creatures in data/pokemon/creatures.json',
        'Test creatures in RPG Maker MZ',
        'Add sprite images to img/enemies/',
        'Implement evolution chains if needed',
      ],
    };
  },
};

/**
 * Genera movimientos por defecto según el tier
 */
function generateDefaultMoves(tier: 1 | 2 | 3): Array<{ level: number; moveName: string }> {
  const movesByTier = {
    1: [
      { level: 1, moveName: 'Tackle' },
      { level: 5, moveName: 'Growl' },
      { level: 10, moveName: 'Quick Attack' },
      { level: 15, moveName: 'Bite' },
    ],
    2: [
      { level: 1, moveName: 'Tackle' },
      { level: 1, moveName: 'Growl' },
      { level: 10, moveName: 'Quick Attack' },
      { level: 15, moveName: 'Bite' },
      { level: 20, moveName: 'Take Down' },
      { level: 25, moveName: 'Agility' },
    ],
    3: [
      { level: 1, moveName: 'Tackle' },
      { level: 1, moveName: 'Growl' },
      { level: 1, moveName: 'Quick Attack' },
      { level: 15, moveName: 'Bite' },
      { level: 20, moveName: 'Take Down' },
      { level: 25, moveName: 'Agility' },
      { level: 30, moveName: 'Hyper Beam' },
      { level: 35, moveName: 'Outrage' },
    ],
  };

  return movesByTier[tier];
}
