import { readRPGMakerData, writeRPGMakerData } from './file-system.js';
import type { RPGMakerEnemy, RPGMakerItem, RPGMakerSkill } from '../types/rpgmaker.js';

/**
 * Utilidades específicas para trabajar con proyectos de RPG Maker MZ
 */

/**
 * Lee la lista de enemigos del proyecto
 */
export async function getEnemies(projectPath: string): Promise<RPGMakerEnemy[]> {
  return await readRPGMakerData<RPGMakerEnemy>(projectPath, 'Enemies.json');
}

/**
 * Guarda la lista de enemigos del proyecto
 */
export async function saveEnemies(
  projectPath: string,
  enemies: RPGMakerEnemy[]
): Promise<void> {
  await writeRPGMakerData(projectPath, 'Enemies.json', enemies);
}

/**
 * Añade un nuevo enemigo a la base de datos
 */
export async function addEnemy(
  projectPath: string,
  enemy: RPGMakerEnemy
): Promise<void> {
  const enemies = await getEnemies(projectPath);

  // Asegurar que el array tenga el tamaño correcto
  while (enemies.length <= enemy.id) {
    enemies.push(null as unknown as RPGMakerEnemy);
  }

  enemies[enemy.id] = enemy;
  await saveEnemies(projectPath, enemies);
}

/**
 * Lee la lista de items del proyecto
 */
export async function getItems(projectPath: string): Promise<RPGMakerItem[]> {
  return await readRPGMakerData<RPGMakerItem>(projectPath, 'Items.json');
}

/**
 * Guarda la lista de items del proyecto
 */
export async function saveItems(projectPath: string, items: RPGMakerItem[]): Promise<void> {
  await writeRPGMakerData(projectPath, 'Items.json', items);
}

/**
 * Añade un nuevo item a la base de datos
 */
export async function addItem(projectPath: string, item: RPGMakerItem): Promise<void> {
  const items = await getItems(projectPath);

  while (items.length <= item.id) {
    items.push(null as unknown as RPGMakerItem);
  }

  items[item.id] = item;
  await saveItems(projectPath, items);
}

/**
 * Lee la lista de habilidades del proyecto
 */
export async function getSkills(projectPath: string): Promise<RPGMakerSkill[]> {
  return await readRPGMakerData<RPGMakerSkill>(projectPath, 'Skills.json');
}

/**
 * Guarda la lista de habilidades del proyecto
 */
export async function saveSkills(projectPath: string, skills: RPGMakerSkill[]): Promise<void> {
  await writeRPGMakerData(projectPath, 'Skills.json', skills);
}

/**
 * Añade una nueva habilidad a la base de datos
 */
export async function addSkill(projectPath: string, skill: RPGMakerSkill): Promise<void> {
  const skills = await getSkills(projectPath);

  while (skills.length <= skill.id) {
    skills.push(null as unknown as RPGMakerSkill);
  }

  skills[skill.id] = skill;
  await saveSkills(projectPath, skills);
}

/**
 * Crea un enemigo vacío con valores por defecto
 */
export function createDefaultEnemy(id: number, name: string): RPGMakerEnemy {
  return {
    id,
    name,
    battlerName: '',
    battlerHue: 0,
    params: [100, 0, 10, 10, 10, 10, 10, 10], // HP, MP, ATK, DEF, MAT, MDF, AGI, LUK
    exp: 10,
    gold: 10,
    dropItems: [],
    actions: [
      {
        skillId: 1, // Attack
        conditionType: 0,
        conditionParam1: 0,
        conditionParam2: 0,
        rating: 5,
      },
    ],
    traits: [],
    note: '',
  };
}

/**
 * Crea un item vacío con valores por defecto
 */
export function createDefaultItem(id: number, name: string): RPGMakerItem {
  return {
    id,
    name,
    iconIndex: 0,
    description: '',
    itypeId: 1, // Regular item
    price: 0,
    consumable: true,
    effects: [],
    note: '',
  };
}

/**
 * Crea una habilidad vacía con valores por defecto
 */
export function createDefaultSkill(id: number, name: string): RPGMakerSkill {
  return {
    id,
    name,
    iconIndex: 0,
    description: '',
    stypeId: 1, // Magic
    mpCost: 0,
    tpCost: 0,
    scope: 1, // 1 enemy
    occasion: 1, // Battle only
    speed: 0,
    successRate: 100,
    repeats: 1,
    tpGain: 0,
    hitType: 0, // Certain hit
    animationId: 0,
    damage: {
      type: 1, // HP damage
      elementId: 0,
      formula: '10',
      variance: 20,
      critical: false,
    },
    effects: [],
    note: '',
  };
}

/**
 * Encuentra el próximo ID disponible en un array de datos
 */
export function getNextAvailableId<T extends { id: number }>(data: T[]): number {
  return data.filter((item) => item !== null).length;
}
