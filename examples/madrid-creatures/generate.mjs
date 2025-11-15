#!/usr/bin/env node

/**
 * Ejemplo: Criaturas de Madrid
 *
 * Este script genera 20 criaturas temáticas inspiradas en Madrid:
 * - Monumentos icónicos (Oso de la Puerta del Sol, Cibeles, etc.)
 * - Gastronomía madrileña (Churro, Cocido, Callos)
 * - Cultura y tradiciones (Chulapo, Mantón, Verbena)
 * - Naturaleza local (Retiro Park creatures)
 *
 * Uso:
 * 1. Asegúrate de tener GEMINI_API_KEY configurada
 * 2. Ten un proyecto de RPG Maker MZ listo
 * 3. Ejecuta: node generate.mjs /path/to/rpgmaker/project
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Importar el servidor MCP (se puede usar directamente el código compilado)
const { generateCreatureSetTool } = require('../../dist/tools/pokemon/generate-creature-set.js');

async function main() {
  const projectPath = process.argv[2];

  if (!projectPath) {
    console.error('❌ Error: Debes proporcionar la ruta al proyecto de RPG Maker MZ');
    console.error('Uso: node generate.mjs /path/to/rpgmaker/project');
    process.exit(1);
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ Error: GEMINI_API_KEY no está configurada');
    console.error('Configura la variable de entorno: export GEMINI_API_KEY=tu_api_key');
    process.exit(1);
  }

  console.log('🏛️  Generador de Criaturas de Madrid');
  console.log('=====================================\n');
  console.log(`📁 Proyecto: ${projectPath}`);
  console.log(`🔑 API Key: ${process.env.GEMINI_API_KEY.substring(0, 10)}...`);
  console.log('');

  const theme = `Madrid city and culture. Create creatures inspired by:
  - Iconic monuments: Bear and Strawberry Tree (Oso y Madroño), Puerta de Alcalá, Cibeles Fountain, Royal Palace
  - Local gastronomy: Churros, Cocido Madrileño, Callos, Bocadillo de Calamares
  - Culture and traditions: Chulapo/Chulapa traditional dress, Mantón de Manila, Verbena festivals
  - Nature: Retiro Park creatures, Casa de Campo wildlife, Madrid Rio
  - Urban elements: Metro trains, Gran Vía buildings, street performers

  Each creature should have a Spanish name that reflects Madrid's character and charm.
  Mix cute/friendly creatures (tier 1) with impressive evolved forms (tier 2-3).`;

  try {
    const result = await generateCreatureSetTool.execute({
      project_path: projectPath,
      theme: theme,
      count: 20,
      tier_distribution: {
        tier1: 0.5,  // 10 criaturas básicas
        tier2: 0.3,  // 6 criaturas evolucionadas
        tier3: 0.2,  // 4 criaturas legendarias
      },
      generate_sprites: false, // Por ahora sin sprites, se pueden añadir manualmente
    });

    console.log('\n✅ Generación completada!\n');
    console.log(`📊 Criaturas creadas: ${result.creatures_created}/${result.count || 20}`);

    if (result.creatures_failed > 0) {
      console.log(`⚠️  Fallos: ${result.creatures_failed}`);
    }

    console.log('\n📋 Criaturas generadas:\n');

    // Agrupar por tier
    const byTier = { 1: [], 2: [], 3: [] };
    for (const creature of result.creatures) {
      byTier[creature.tier].push(creature);
    }

    for (const tier of [1, 2, 3]) {
      const tierName = { 1: 'Básicas', 2: 'Evolucionadas', 3: 'Legendarias' }[tier];
      console.log(`\n🏆 Tier ${tier} - ${tierName}:`);
      for (const creature of byTier[tier]) {
        console.log(`   ${creature.id}. ${creature.name} (${creature.types.join('/')})`);
      }
    }

    console.log('\n📝 Próximos pasos:');
    for (const step of result.next_steps) {
      console.log(`   - ${step}`);
    }

    console.log('\n💡 Sugerencia: Añade sprites personalizados en img/enemies/');
    console.log('   Puedes usar Midjourney, DALL-E o crear pixel art manualmente.\n');

  } catch (error) {
    console.error('\n❌ Error durante la generación:', error.message);
    process.exit(1);
  }
}

main();
