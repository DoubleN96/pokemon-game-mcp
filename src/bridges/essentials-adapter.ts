import type { CreatureType, BaseStats } from '../types/creature.js';

/**
 * Adaptador de mecánicas de Pokémon Essentials
 * Implementa fórmulas y lógica de combate auténtica de Pokémon
 */

/**
 * Tabla de efectividad de tipos (atacante -> defensor)
 * 2.0 = super efectivo, 0.5 = poco efectivo, 0 = inmune
 */
export const TYPE_EFFECTIVENESS: Record<CreatureType, Partial<Record<CreatureType, number>>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2.0,
    ice: 2.0,
    bug: 2.0,
    rock: 0.5,
    dragon: 0.5,
    steel: 2.0,
  },
  water: { fire: 2.0, water: 0.5, grass: 0.5, ground: 2.0, rock: 2.0, dragon: 0.5 },
  grass: {
    fire: 0.5,
    water: 2.0,
    grass: 0.5,
    poison: 0.5,
    ground: 2.0,
    flying: 0.5,
    bug: 0.5,
    rock: 2.0,
    dragon: 0.5,
    steel: 0.5,
  },
  electric: { water: 2.0, electric: 0.5, grass: 0.5, ground: 0, flying: 2.0, dragon: 0.5 },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2.0,
    ice: 0.5,
    ground: 2.0,
    flying: 2.0,
    dragon: 2.0,
    steel: 0.5,
  },
  fighting: {
    normal: 2.0,
    ice: 2.0,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2.0,
    ghost: 0,
    dark: 2.0,
    steel: 2.0,
    fairy: 0.5,
  },
  poison: { grass: 2.0, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2.0 },
  ground: {
    fire: 2.0,
    electric: 2.0,
    grass: 0.5,
    poison: 2.0,
    flying: 0,
    bug: 0.5,
    rock: 2.0,
    steel: 2.0,
  },
  flying: { electric: 0.5, grass: 2.0, fighting: 2.0, bug: 2.0, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2.0, poison: 2.0, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: {
    fire: 0.5,
    grass: 2.0,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2.0,
    ghost: 0.5,
    dark: 2.0,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: { fire: 2.0, ice: 2.0, fighting: 0.5, ground: 0.5, flying: 2.0, bug: 2.0, steel: 0.5 },
  ghost: { normal: 0, psychic: 2.0, ghost: 2.0, dark: 0.5 },
  dragon: { dragon: 2.0, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2.0, ghost: 2.0, dark: 0.5, fairy: 0.5 },
  steel: {
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    ice: 2.0,
    rock: 2.0,
    steel: 0.5,
    fairy: 2.0,
  },
  fairy: { fire: 0.5, fighting: 2.0, poison: 0.5, dragon: 2.0, dark: 2.0, steel: 0.5 },
};

/**
 * Calcula la efectividad de un tipo contra otro
 */
export function getTypeEffectiveness(
  attackType: CreatureType,
  defenderTypes: CreatureType[]
): number {
  let effectiveness = 1.0;

  for (const defenderType of defenderTypes) {
    const multiplier = TYPE_EFFECTIVENESS[attackType]?.[defenderType] ?? 1.0;
    effectiveness *= multiplier;
  }

  return effectiveness;
}

/**
 * Calcula el daño de un ataque usando la fórmula de Pokémon
 * Formula: ((2 * Level / 5 + 2) * Power * A/D) / 50 + 2
 */
export function calculateDamage(params: {
  attackerLevel: number;
  attackerStat: number;
  defenderStat: number;
  movePower: number;
  moveType: CreatureType;
  attackerTypes: CreatureType[];
  defenderTypes: CreatureType[];
  isCritical?: boolean;
  randomFactor?: number;
}): number {
  const {
    attackerLevel,
    attackerStat,
    defenderStat,
    movePower,
    moveType,
    attackerTypes,
    defenderTypes,
    isCritical = false,
    randomFactor = 1.0,
  } = params;

  // Paso 1: Base damage
  const levelFactor = (2 * attackerLevel) / 5 + 2;
  const baseDamage = (levelFactor * movePower * (attackerStat / defenderStat)) / 50 + 2;

  // Paso 2: STAB (Same Type Attack Bonus)
  const stab = attackerTypes.includes(moveType) ? 1.5 : 1.0;

  // Paso 3: Type effectiveness
  const effectiveness = getTypeEffectiveness(moveType, defenderTypes);

  // Paso 4: Critical hit
  const critical = isCritical ? 1.5 : 1.0;

  // Paso 5: Random factor (0.85 - 1.0)
  const random = randomFactor;

  // Daño final
  const finalDamage = Math.floor(baseDamage * stab * effectiveness * critical * random);

  return Math.max(1, finalDamage);
}

/**
 * Calcula la probabilidad de crítico (1/24 por defecto, 1/8 con high crit)
 */
export function getCriticalChance(highCritRatio: boolean = false): number {
  return highCritRatio ? 1 / 8 : 1 / 24;
}

/**
 * Calcula la tasa de captura según la fórmula de Pokémon
 * Formula: ((3 * MaxHP - 2 * CurrentHP) * CatchRate * BallRate * StatusBonus) / (3 * MaxHP)
 */
export function calculateCatchRate(params: {
  maxHP: number;
  currentHP: number;
  catchRate: number; // Catch rate de la especie (ej: 45 para starters)
  ballRate: number; // 1.0 = Pokéball, 1.5 = Great Ball, 2.0 = Ultra Ball
  statusBonus?: number; // 1.0 = ninguno, 1.5 = burn/poison/paralysis, 2.0 = sleep/freeze
}): number {
  const { maxHP, currentHP, catchRate, ballRate, statusBonus = 1.0 } = params;

  const a = Math.floor(
    ((3 * maxHP - 2 * currentHP) * catchRate * ballRate * statusBonus) / (3 * maxHP)
  );

  // Número de sacudidas (0-3)
  // Si a >= 255, captura garantizada
  if (a >= 255) return 100;

  const b = 1048560 / Math.floor(Math.sqrt(Math.sqrt(16711680 / a)));

  // Probabilidad de captura = (b/65536)^4
  const probability = Math.pow(b / 65536, 4) * 100;

  return Math.min(100, probability);
}

/**
 * Calcula stats de una criatura según nivel, IVs y EVs
 * Formula HP: ((2 * Base + IV + EV/4) * Level / 100) + Level + 10
 * Formula otros: ((2 * Base + IV + EV/4) * Level / 100) + 5
 */
export function calculateStat(params: {
  baseStat: number;
  level: number;
  iv?: number; // 0-31
  ev?: number; // 0-252
  isHP?: boolean;
  nature?: number; // 0.9, 1.0, or 1.1
}): number {
  const { baseStat, level, iv = 31, ev = 0, isHP = false, nature = 1.0 } = params;

  const statValue = Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100);

  if (isHP) {
    return statValue + level + 10;
  } else {
    return Math.floor((statValue + 5) * nature);
  }
}

/**
 * Calcula todos los stats de una criatura
 */
export function calculateAllStats(params: {
  baseStats: BaseStats;
  level: number;
  ivs?: BaseStats;
  evs?: BaseStats;
}): BaseStats {
  const { baseStats, level, ivs, evs } = params;

  return {
    hp: calculateStat({
      baseStat: baseStats.hp,
      level,
      iv: ivs?.hp,
      ev: evs?.hp,
      isHP: true,
    }),
    attack: calculateStat({
      baseStat: baseStats.attack,
      level,
      iv: ivs?.attack,
      ev: evs?.attack,
    }),
    defense: calculateStat({
      baseStat: baseStats.defense,
      level,
      iv: ivs?.defense,
      ev: evs?.defense,
    }),
    spAttack: calculateStat({
      baseStat: baseStats.spAttack,
      level,
      iv: ivs?.spAttack,
      ev: evs?.spAttack,
    }),
    spDefense: calculateStat({
      baseStat: baseStats.spDefense,
      level,
      iv: ivs?.spDefense,
      ev: evs?.spDefense,
    }),
    speed: calculateStat({
      baseStat: baseStats.speed,
      level,
      iv: ivs?.speed,
      ev: evs?.speed,
    }),
  };
}

/**
 * Calcula la experiencia requerida para el siguiente nivel (curva Medium Slow)
 */
export function calculateExpForLevel(level: number): number {
  // Medium Slow: (6/5)n³ - 15n² + 100n - 140
  return Math.floor(
    (6 / 5) * Math.pow(level, 3) - 15 * Math.pow(level, 2) + 100 * level - 140
  );
}

/**
 * Genera stats base balanceados según el tier de la criatura
 * Tier 1 (inicial): Total ~310
 * Tier 2 (medio): Total ~405-420
 * Tier 3 (final): Total ~525-550
 */
export function generateBalancedStats(tier: 1 | 2 | 3, archetype?: string): BaseStats {
  const totals = {
    1: 310,
    2: 420,
    3: 535,
  };

  const total = totals[tier];

  // Arquetipos de distribución
  const distributions = {
    physical: [0.25, 0.25, 0.15, 0.05, 0.15, 0.15], // HP, ATK, DEF, SPATK, SPDEF, SPE
    special: [0.25, 0.05, 0.15, 0.25, 0.15, 0.15],
    tank: [0.35, 0.15, 0.2, 0.05, 0.2, 0.05],
    speedy: [0.2, 0.2, 0.1, 0.15, 0.1, 0.25],
    balanced: [0.2, 0.16, 0.16, 0.16, 0.16, 0.16],
  };

  const dist = distributions[archetype as keyof typeof distributions] || distributions.balanced;

  return {
    hp: Math.floor(total * dist[0]),
    attack: Math.floor(total * dist[1]),
    defense: Math.floor(total * dist[2]),
    spAttack: Math.floor(total * dist[3]),
    spDefense: Math.floor(total * dist[4]),
    speed: Math.floor(total * dist[5]),
  };
}
