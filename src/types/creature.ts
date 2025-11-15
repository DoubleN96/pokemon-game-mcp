/**
 * Tipos elementales disponibles para las criaturas
 */
export type CreatureType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

/**
 * Estadísticas base de una criatura
 */
export type BaseStats = {
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
};

/**
 * Datos de evolución de una criatura
 */
export type Evolution = {
  level?: number;
  intoId: number;
  intoName?: string;
  method?: 'level' | 'item' | 'trade' | 'happiness';
  item?: string;
};

/**
 * Movimiento que puede aprender una criatura
 */
export type LearnableMove = {
  level: number;
  moveName: string;
  moveId?: number;
};

/**
 * Datos completos de una criatura
 */
export type CreatureData = {
  id: number;
  name: string;
  types: [CreatureType] | [CreatureType, CreatureType];
  baseStats: BaseStats;
  catchRate: number;
  expYield: number;
  evYield?: Partial<BaseStats>;
  evolution?: Evolution;
  moves: LearnableMove[];
  abilities?: string[];
  hiddenAbility?: string;
  description?: string;
  height?: number; // en metros
  weight?: number; // en kg
  eggGroups?: string[];
  genderRatio?: {
    male: number; // 0-100
    female: number; // 0-100
  };
};

/**
 * Movimiento de batalla
 */
export type Move = {
  id: number;
  name: string;
  type: CreatureType;
  category: 'physical' | 'special' | 'status';
  power?: number;
  accuracy?: number;
  pp: number;
  priority?: number;
  target: 'self' | 'single' | 'all-opponents' | 'all-allies' | 'all-others' | 'field';
  effect?: string;
  description?: string;
};

/**
 * Instancia de una criatura (en el equipo del jugador)
 */
export type CreatureInstance = {
  id: number; // ID único de esta instancia
  speciesId: number; // ID de la especie
  nickname?: string;
  level: number;
  exp: number;
  currentHP: number;
  maxHP: number;
  stats: BaseStats;
  moves: {
    moveId: number;
    currentPP: number;
    maxPP: number;
  }[];
  ability: string;
  nature?: string;
  ivs?: BaseStats;
  evs?: BaseStats;
  status?: 'burn' | 'freeze' | 'paralysis' | 'poison' | 'sleep' | 'toxic';
  isShiny?: boolean;
  originalTrainer?: string;
  friendship: number;
};

/**
 * Opciones para generar un conjunto de criaturas
 */
export type GenerateCreatureSetOptions = {
  projectPath: string;
  theme: string;
  count: number;
  includeEvolutions: boolean;
  starterId?: number;
  aiProvider?: 'gemini' | 'openai' | 'claude';
  balanceMethod?: 'linear' | 'exponential' | 'custom';
};

/**
 * Resultado de la generación de criaturas
 */
export type GenerateCreatureSetResult = {
  success: boolean;
  creaturesGenerated: number;
  theme: string;
  creatures: CreatureData[];
  errors?: string[];
};
