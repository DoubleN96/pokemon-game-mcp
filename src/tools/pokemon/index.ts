export { createCreatureTool } from './create-creature.js';
export { implementCatchSystemTool } from './catch-system.js';
export { generateCreatureSetTool } from './generate-creature-set.js';

// Re-export all tools as an array
import { createCreatureTool } from './create-creature.js';
import { implementCatchSystemTool } from './catch-system.js';
import { generateCreatureSetTool } from './generate-creature-set.js';

export const pokemonTools = [
  createCreatureTool,
  implementCatchSystemTool,
  generateCreatureSetTool,
];
