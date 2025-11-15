/**
 * Tipos relacionados con RPG Maker MZ
 */

/**
 * Estructura de un proyecto de RPG Maker MZ
 */
export type RPGMakerProject = {
  path: string;
  name: string;
  version?: string;
};

/**
 * Enemy (criatura/monstruo) en RPG Maker MZ
 */
export type RPGMakerEnemy = {
  id: number;
  name: string;
  battlerName: string;
  battlerHue: number;
  params: [number, number, number, number, number, number, number, number]; // [HP, MP, ATK, DEF, MAT, MDF, AGI, LUK]
  exp: number;
  gold: number;
  dropItems: Array<{
    kind: number; // 1=item, 2=weapon, 3=armor
    dataId: number;
    denominator: number;
  }>;
  actions: Array<{
    skillId: number;
    conditionType: number;
    conditionParam1: number;
    conditionParam2: number;
    rating: number;
  }>;
  traits: Array<{
    code: number;
    dataId: number;
    value: number;
  }>;
  note: string;
};

/**
 * Item en RPG Maker MZ
 */
export type RPGMakerItem = {
  id: number;
  name: string;
  iconIndex: number;
  description: string;
  itypeId: number;
  price: number;
  consumable: boolean;
  effects: Array<{
    code: number;
    dataId: number;
    value1: number;
    value2: number;
  }>;
  note: string;
};

/**
 * Common Event en RPG Maker MZ
 */
export type RPGMakerCommonEvent = {
  id: number;
  name: string;
  trigger: number; // 0=none, 1=autorun, 2=parallel
  switchId: number;
  list: Array<{
    code: number;
    indent: number;
    parameters: unknown[];
  }>;
};

/**
 * Mapa en RPG Maker MZ
 */
export type RPGMakerMap = {
  id: number;
  name: string;
  width: number;
  height: number;
  tilesetId: number;
  data: number[];
  events: Array<RPGMakerEvent | null>;
  note: string;
};

/**
 * Evento en RPG Maker MZ
 */
export type RPGMakerEvent = {
  id: number;
  name: string;
  x: number;
  y: number;
  pages: Array<{
    conditions: {
      switch1Valid: boolean;
      switch1Id: number;
      switch2Valid: boolean;
      switch2Id: number;
      variableValid: boolean;
      variableId: number;
      variableValue: number;
      selfSwitchValid: boolean;
      selfSwitchCh: string;
      itemValid: boolean;
      itemId: number;
      actorValid: boolean;
      actorId: number;
    };
    image: {
      tileId: number;
      characterName: string;
      characterIndex: number;
      direction: number;
      pattern: number;
    };
    moveType: number;
    moveSpeed: number;
    moveFrequency: number;
    moveRoute: {
      repeat: boolean;
      skippable: boolean;
      wait: boolean;
      list: Array<{
        code: number;
        parameters: unknown[];
      }>;
    };
    walkAnime: boolean;
    stepAnime: boolean;
    directionFix: boolean;
    through: boolean;
    priorityType: number;
    trigger: number;
    list: Array<{
      code: number;
      indent: number;
      parameters: unknown[];
    }>;
  }>;
};

/**
 * Skill (habilidad/movimiento) en RPG Maker MZ
 */
export type RPGMakerSkill = {
  id: number;
  name: string;
  iconIndex: number;
  description: string;
  stypeId: number;
  mpCost: number;
  tpCost: number;
  scope: number;
  occasion: number;
  speed: number;
  successRate: number;
  repeats: number;
  tpGain: number;
  hitType: number;
  animationId: number;
  damage: {
    type: number;
    elementId: number;
    formula: string;
    variance: number;
    critical: boolean;
  };
  effects: Array<{
    code: number;
    dataId: number;
    value1: number;
    value2: number;
  }>;
  note: string;
};
