export { createCreatureTool } from './create-creature.js';
export { implementCatchSystemTool } from './catch-system.js';

// Re-export all tools as an array
import { createCreatureTool } from './create-creature.js';
import { implementCatchSystemTool } from './catch-system.js';

export const pokemonTools = [createCreatureTool, implementCatchSystemTool];
