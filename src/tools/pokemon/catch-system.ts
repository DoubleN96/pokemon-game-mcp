import { join } from 'path';
import { addItem, createDefaultItem, getNextAvailableId, getItems } from '../../utils/rpgmaker.js';
import { writeJSON, ensureDir } from '../../utils/file-system.js';
import { logger } from '../../utils/logger.js';

/**
 * Tool: implement_catch_system
 * Implementa el sistema de captura de criaturas estilo Pokémon
 */

export const implementCatchSystemTool = {
  name: 'implement_catch_system',
  description:
    'Implement Pokémon-style catch mechanics with capture items and catch rate formulas',
  inputSchema: {
    type: 'object',
    properties: {
      project_path: {
        type: 'string',
        description: 'Path to the RPG Maker MZ project',
      },
      catch_items: {
        type: 'array',
        description: 'List of capture items to create',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Item name (e.g., "Criaball", "Super Criaball")',
            },
            catch_rate: {
              type: 'number',
              description: 'Catch rate multiplier (1.0 = basic, 1.5 = improved, 2.0 = ultra)',
            },
            price: {
              type: 'number',
              description: 'Shop price',
            },
            icon_index: {
              type: 'number',
              description: 'Icon index in IconSet.png (default: 176 for Pokéball-like)',
              default: 176,
            },
            description: {
              type: 'string',
              description: 'Item description',
            },
          },
          required: ['name', 'catch_rate', 'price'],
        },
        default: [
          { name: 'Criaball', catch_rate: 1.0, price: 200, description: 'A basic capture device' },
          {
            name: 'Super Criaball',
            catch_rate: 1.5,
            price: 600,
            description: 'An improved capture device',
          },
          {
            name: 'Ultra Criaball',
            catch_rate: 2.0,
            price: 1200,
            description: 'A high-performance capture device',
          },
        ],
      },
    },
    required: ['project_path'],
  },

  async execute(args: Record<string, unknown>) {
    const projectPath = args.project_path as string;
    const catchItemsRaw =
      (args.catch_items as Array<{
        name: string;
        catch_rate: number;
        price: number;
        icon_index?: number;
        description?: string;
      }>) || [];

    logger.info('Implementing catch system...');

    const items = await getItems(projectPath);
    let nextId = getNextAvailableId(items);

    const createdItems: Array<{ id: number; name: string; rate: number }> = [];

    // 1. Crear items de captura
    for (const catchItem of catchItemsRaw) {
      const item = createDefaultItem(nextId, catchItem.name);

      item.iconIndex = catchItem.icon_index ?? 176;
      item.description = catchItem.description ?? `Catch rate: ${catchItem.catch_rate}x`;
      item.price = catchItem.price;
      item.consumable = true;
      item.itypeId = 1; // Regular item

      // Configurar el efecto de captura en las notas
      item.note = JSON.stringify({
        catchItem: true,
        catchRate: catchItem.catch_rate,
      });

      await addItem(projectPath, item);
      logger.info(`Created catch item: ${catchItem.name} (ID: ${nextId})`);

      createdItems.push({
        id: nextId,
        name: catchItem.name,
        rate: catchItem.catch_rate,
      });

      nextId++;
    }

    // 2. Crear el plugin de captura (JavaScript)
    const jsDir = join(projectPath, 'js', 'plugins');
    await ensureDir(jsDir);

    const pluginCode = generateCatchPlugin();
    const pluginPath = join(jsDir, 'Pokemon_CatchSystem.js');
    const fs = await import('fs/promises');
    await fs.writeFile(pluginPath, pluginCode, 'utf-8');

    logger.info(`Created catch system plugin: ${pluginPath}`);

    // 3. Guardar configuración del sistema de captura
    const dataDir = join(projectPath, 'data', 'pokemon');
    await ensureDir(dataDir);

    const configPath = join(dataDir, 'catch_config.json');
    await writeJSON(configPath, {
      items: createdItems,
      formula: 'pokemon_gen3', // Fórmula de Pokémon Generación 3+
      shakeChecks: 4,
      criticalCaptureEnabled: true,
    });

    logger.info(`Saved catch system configuration to: ${configPath}`);

    return {
      success: true,
      items_created: createdItems.length,
      items: createdItems,
      files_created: [
        'js/plugins/Pokemon_CatchSystem.js',
        'data/pokemon/catch_config.json',
        'data/Items.json',
      ],
      next_steps: [
        'Add "Pokemon_CatchSystem" to the plugin list in the RPG Maker MZ editor',
        'Configure plugin parameters if needed',
        'Test catch mechanics in battle',
      ],
    };
  },
};

/**
 * Genera el código del plugin de captura para RPG Maker MZ
 */
function generateCatchPlugin(): string {
  return `/*:
 * @target MZ
 * @plugindesc Pokémon-style creature capture system
 * @author Pokemon Game MCP
 *
 * @help Pokemon_CatchSystem.js
 *
 * This plugin implements a Pokémon-style catch mechanic.
 *
 * Use catch items (marked with {catchItem: true} in notes) during battle
 * to attempt to capture wild creatures.
 *
 * Catch formula:
 * rate = ((3*MaxHP - 2*CurrentHP) * CatchRate * BallRate * StatusBonus) / (3*MaxHP)
 *
 * If rate >= 255: Guaranteed capture
 * Otherwise: Shake check with decreasing probability
 *
 * ============================================================================
 */

(() => {
  'use strict';

  // Alias item usage
  const _Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
  Game_Action.prototype.applyItemUserEffect = function(target) {
    _Game_Action_applyItemUserEffect.call(this, target);

    if (this.isItem() && this.item()) {
      this.applyCatchEffect(target);
    }
  };

  Game_Action.prototype.applyCatchEffect = function(target) {
    const item = this.item();

    // Verificar si es un item de captura
    let catchData;
    try {
      const note = item.note || '';
      catchData = JSON.parse(note);
    } catch (e) {
      return;
    }

    if (!catchData || !catchData.catchItem) {
      return;
    }

    // Solo funciona contra enemigos
    if (!target.isEnemy()) {
      return;
    }

    const catchRate = this.calculateCatchRate(target, catchData.catchRate);
    const success = this.attemptCapture(catchRate);

    if (success) {
      this.onCaptureSuccess(target);
    } else {
      this.onCaptureFailure(target);
    }
  };

  Game_Action.prototype.calculateCatchRate = function(target, ballRate) {
    const maxHP = target.mhp;
    const currentHP = target.hp;

    // Catch rate de la especie (desde las notas del enemigo)
    let speciesCatchRate = 45; // Default
    try {
      const enemyData = JSON.parse(target.enemy().note || '{}');
      if (enemyData.catchRate) {
        speciesCatchRate = enemyData.catchRate;
      }
    } catch (e) {
      // Use default
    }

    // Status bonus
    let statusBonus = 1.0;
    if (target.isDead()) {
      return 0; // No se puede capturar un enemigo derrotado
    }
    if (target.isStateAffected(2)) statusBonus = 2.0; // Sleep
    else if (target.isStateAffected(3)) statusBonus = 2.0; // Freeze
    else if (target.isStateAffected(4)) statusBonus = 1.5; // Paralysis
    else if (target.isStateAffected(5)) statusBonus = 1.5; // Poison
    else if (target.isStateAffected(6)) statusBonus = 1.5; // Burn

    // Fórmula de Pokémon
    const a = Math.floor(
      ((3 * maxHP - 2 * currentHP) * speciesCatchRate * ballRate * statusBonus) / (3 * maxHP)
    );

    return a;
  };

  Game_Action.prototype.attemptCapture = function(a) {
    // Si a >= 255, captura garantizada
    if (a >= 255) {
      return true;
    }

    // Shake formula
    const b = 1048560 / Math.floor(Math.sqrt(Math.sqrt(16711680 / a)));

    // 4 shake checks
    for (let i = 0; i < 4; i++) {
      const random = Math.floor(Math.random() * 65535);
      if (random >= b) {
        return false; // Break out
      }
    }

    return true; // Caught!
  };

  Game_Action.prototype.onCaptureSuccess = function(target) {
    // Mensaje de éxito
    $gameMessage.add(\`\\\\C[3]Gotcha! \${target.name()} was caught!\\\\C[0]\`);

    // Eliminar enemigo de la batalla
    target.die();

    // TODO: Añadir criatura al party/storage
    // Por ahora solo mostramos mensaje

    console.log(\`Captured: \${target.name()}\`);
  };

  Game_Action.prototype.onCaptureFailure = function(target) {
    const shakes = Math.floor(Math.random() * 3); // 0-3 sacudidas

    const messages = [
      \`Oh no! The creature broke free!\`,
      \`Aww! It appeared to be caught!\`,
      \`Aargh! Almost had it!\`,
      \`Gah! It was so close too!\`
    ];

    $gameMessage.add(messages[shakes]);
  };

})();
`;
}
