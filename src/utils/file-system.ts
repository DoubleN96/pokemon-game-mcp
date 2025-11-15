import { promises as fs } from 'fs';
import { join, dirname } from 'path';

/**
 * Utilidades para manejo de archivos JSON de RPG Maker MZ
 */

export async function readJSON<T>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

export async function writeJSON<T>(filePath: string, data: T): Promise<void> {
  await ensureDir(dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function copyFile(src: string, dest: string): Promise<void> {
  await ensureDir(dirname(dest));
  await fs.copyFile(src, dest);
}

/**
 * Lee un archivo de datos de RPG Maker MZ (ej: Enemies.json, Items.json)
 */
export async function readRPGMakerData<T>(
  projectPath: string,
  dataFile: string
): Promise<T[]> {
  const filePath = join(projectPath, 'data', dataFile);
  return await readJSON<T[]>(filePath);
}

/**
 * Escribe un archivo de datos de RPG Maker MZ
 */
export async function writeRPGMakerData<T>(
  projectPath: string,
  dataFile: string,
  data: T[]
): Promise<void> {
  const filePath = join(projectPath, 'data', dataFile);
  await writeJSON(filePath, data);
}

/**
 * Lee el archivo System.json de RPG Maker MZ
 */
export async function readSystemData(projectPath: string): Promise<unknown> {
  return await readRPGMakerData(projectPath, 'System.json');
}

/**
 * Verifica que un path sea un proyecto válido de RPG Maker MZ
 */
export async function isValidRPGMakerProject(projectPath: string): Promise<boolean> {
  const requiredPaths = [
    join(projectPath, 'data'),
    join(projectPath, 'js'),
    join(projectPath, 'img'),
    join(projectPath, 'audio'),
    join(projectPath, 'data', 'System.json'),
  ];

  for (const path of requiredPaths) {
    if (!(await fileExists(path))) {
      return false;
    }
  }

  return true;
}
