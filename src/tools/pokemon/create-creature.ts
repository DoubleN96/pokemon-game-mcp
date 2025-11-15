import { join } from 'path';
import type { CreatureData } from '../../types/creature.js';
import { addEnemy, createDefaultEnemy, getNextAvailableId, getEnemies } from '../../utils/rpgmaker.js';
import { writeJSON, readJSON, ensureDir } from '../../utils/file-system.js';
import { logger } from '../../utils/logger.js';

/**
 * Tool: create_creature
 * Crea una nueva criatura en el proyecto de RPG Maker MZ
 */

export const createCreatureTool = {
  name: 'create_creature',
  description: 'Create a new monster/creature with stats, moves, types, and evolution data',
  inputSchema: {
    type: 'object',
    properties: {
      project_path: {
        type: 'string',
        description: 'Path to the RPG Maker MZ project',
      },
      creature_data: {
        type: 'object',
        description: 'Complete creature data',
        properties: {
          id: {
            type: 'number',
            description: 'Creature ID (if not provided, auto-generates)',
          },
          name: {
            type: 'string',
            description: 'Creature name',
          },
          types: {
            type: 'array',
            description: 'Type(s) of the creature (1 or 2)',
            items: { type: 'string' },
            minItems: 1,
            maxItems: 2,
          },
          base_stats: {
            type: 'object',
            description: 'Base statistics',
            properties: {
              hp: { type: 'number' },
              attack: { type: 'number' },
              defense: { type: 'number' },
              sp_attack: { type: 'number' },
              sp_defense: { type: 'number' },
              speed: { type: 'number' },
            },
            required: ['hp', 'attack', 'defense', 'sp_attack', 'sp_defense', 'speed'],
          },
          catch_rate: {
            type: 'number',
            description: 'Catch rate (1-255, lower = harder to catch)',
            default: 45,
          },
          exp_yield: {
            type: 'number',
            description: 'Experience points yielded when defeated',
            default: 100,
          },
          evolution: {
            type: 'object',
            description: 'Evolution data',
            properties: {
              level: { type: 'number' },
              into_id: { type: 'number' },
              into_name: { type: 'string' },
              method: {
                type: 'string',
                enum: ['level', 'item', 'trade', 'happiness'],
                default: 'level',
              },
            },
          },
          moves: {
            type: 'array',
            description: 'Moves the creature can learn',
            items: {
              type: 'object',
              properties: {
                level: { type: 'number' },
                move_name: { type: 'string' },
              },
              required: ['level', 'move_name'],
            },
          },
          description: {
            type: 'string',
            description: 'Creature description/Pokedex entry',
          },
        },
        required: ['name', 'types', 'base_stats'],
      },
      sprite_path: {
        type: 'string',
        description: 'Optional: Path to existing sprite image file',
      },
      generate_sprite: {
        type: 'boolean',
        description: 'Whether to generate sprite using AI (requires GEMINI_API_KEY)',
        default: false,
      },
    },
    required: ['project_path', 'creature_data'],
  },

  async execute(args: Record<string, unknown>) {
    const projectPath = args.project_path as string;
    const creatureRaw = args.creature_data as Record<string, unknown>;
    const spritePath = args.sprite_path as string | undefined;
    const generateSprite = (args.generate_sprite as boolean) ?? false;

    logger.info(`Creating creature: ${creatureRaw.name}`);

    // Parsear datos de criatura
    const baseStatsRaw = creatureRaw.base_stats as Record<string, unknown>;
    const typesRaw = creatureRaw.types as string[];
    const movesRaw = (creatureRaw.moves as Array<{ level: number; move_name: string }>) ?? [];

    const creatureData: CreatureData = {
      id: (creatureRaw.id as number) || 0,
      name: creatureRaw.name as string,
      types: typesRaw as CreatureData['types'],
      baseStats: {
        hp: baseStatsRaw.hp as number,
        attack: baseStatsRaw.attack as number,
        defense: baseStatsRaw.defense as number,
        spAttack: baseStatsRaw.sp_attack as number,
        spDefense: baseStatsRaw.sp_defense as number,
        speed: baseStatsRaw.speed as number,
      },
      catchRate: (creatureRaw.catch_rate as number) ?? 45,
      expYield: (creatureRaw.exp_yield as number) ?? 100,
      moves: movesRaw.map(m => ({ level: m.level, moveName: m.move_name })),
      description: creatureRaw.description as string,
      evolution: creatureRaw.evolution as CreatureData['evolution'],
    };

    // Auto-generar ID si no se proporcionó
    if (!creatureData.id) {
      const enemies = await getEnemies(projectPath);
      creatureData.id = getNextAvailableId(enemies);
    }

    // 1. Crear el enemigo en RPG Maker
    const enemy = createDefaultEnemy(creatureData.id, creatureData.name);

    // Configurar stats basados en stats base (nivel 50 como referencia)
    const level = 50;
    enemy.params[0] = Math.floor(
      ((2 * creatureData.baseStats.hp + 31) * level) / 100 + level + 10
    ); // HP
    enemy.params[2] = Math.floor(((2 * creatureData.baseStats.attack + 31) * level) / 100 + 5); // ATK
    enemy.params[3] = Math.floor(((2 * creatureData.baseStats.defense + 31) * level) / 100 + 5); // DEF
    enemy.params[4] = Math.floor(((2 * creatureData.baseStats.spAttack + 31) * level) / 100 + 5); // MAT
    enemy.params[5] = Math.floor(((2 * creatureData.baseStats.spDefense + 31) * level) / 100 + 5); // MDF
    enemy.params[6] = Math.floor(((2 * creatureData.baseStats.speed + 31) * level) / 100 + 5); // AGI

    // Configurar EXP
    enemy.exp = creatureData.expYield;

    // Configurar sprite si se proporcionó
    if (spritePath) {
      const spriteName = spritePath.split('/').pop()?.replace(/\.[^/.]+$/, '') || '';
      enemy.battlerName = spriteName;
    }

    // Guardar en la base de datos de RPG Maker
    await addEnemy(projectPath, enemy);
    logger.info(`Added creature to Enemies.json: ${creatureData.name} (ID: ${creatureData.id})`);

    // 2. Guardar datos extendidos de Pokémon en archivo custom
    const dataDir = join(projectPath, 'data', 'pokemon');
    await ensureDir(dataDir);

    const creaturesFilePath = join(dataDir, 'creatures.json');

    // Leer archivo existente o crear uno nuevo
    let creaturesDB: Record<number, CreatureData> = {};
    try {
      creaturesDB = await readJSON<Record<number, CreatureData>>(creaturesFilePath);
    } catch {
      logger.info('Creating new creatures.json file');
    }

    // Añadir la nueva criatura
    creaturesDB[creatureData.id] = creatureData;

    // Guardar
    await writeJSON(creaturesFilePath, creaturesDB);
    logger.info(`Saved extended creature data to: ${creaturesFilePath}`);

    // 3. TODO: Generar sprite con IA si se solicita
    if (generateSprite) {
      logger.warn('Sprite generation with AI not yet implemented');
      // TODO: Implementar con Gemini API
    }

    return {
      success: true,
      creature: {
        id: creatureData.id,
        name: creatureData.name,
        types: creatureData.types,
        total_stats:
          creatureData.baseStats.hp +
          creatureData.baseStats.attack +
          creatureData.baseStats.defense +
          creatureData.baseStats.spAttack +
          creatureData.baseStats.spDefense +
          creatureData.baseStats.speed,
      },
      files_modified: ['data/Enemies.json', 'data/pokemon/creatures.json'],
      sprite_generated: false,
    };
  },
};
