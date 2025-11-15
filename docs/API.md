# 📚 Pokemon Game MCP - API Documentation

Documentación completa de todas las herramientas, tipos y utilidades disponibles.

## 🛠️ MCP Tools

### create_creature

Crea una nueva criatura en el proyecto de RPG Maker MZ.

#### Input Schema

```typescript
{
  project_path: string;           // Ruta al proyecto de RPG Maker MZ
  creature_data: {
    id?: number;                  // ID de la criatura (auto-generado si se omite)
    name: string;                 // Nombre de la criatura
    types: string[];              // 1 o 2 tipos
    base_stats: {
      hp: number;                 // HP base (30-255)
      attack: number;             // Ataque físico (5-180)
      defense: number;            // Defensa física (5-230)
      sp_attack: number;          // Ataque especial (10-180)
      sp_defense: number;         // Defensa especial (20-230)
      speed: number;              // Velocidad (5-180)
    };
    catch_rate?: number;          // Tasa de captura (3-255, default: 45)
    exp_yield?: number;           // EXP otorgada (50-300, default: 100)
    evolution?: {
      level?: number;             // Nivel de evolución
      into_id?: number;           // ID de evolución
      into_name?: string;         // Nombre de evolución
      method?: 'level' | 'item' | 'trade' | 'happiness';
    };
    moves?: Array<{
      level: number;              // Nivel en que aprende el movimiento
      move_name: string;          // Nombre del movimiento
    }>;
    description?: string;         // Descripción estilo Pokédex
  };
  sprite_path?: string;           // Ruta a sprite existente
  generate_sprite?: boolean;      // Generar sprite con IA (default: false)
}
```

#### Output

```typescript
{
  success: boolean;
  creature: {
    id: number;
    name: string;
    types: string[];
    total_stats: number;          // Suma de todas las base stats
  };
  files_modified: string[];       // Archivos modificados
  sprite_generated: boolean;      // Si se generó sprite
}
```

#### Ejemplo de uso

```typescript
const result = await createCreatureTool.execute({
  project_path: "/Users/dev/MyGame",
  creature_data: {
    name: "Flamingo",
    types: ["fire", "flying"],
    base_stats: {
      hp: 78,
      attack: 84,
      defense: 78,
      sp_attack: 109,
      sp_defense: 85,
      speed: 100
    },
    catch_rate: 45,
    exp_yield: 175,
    description: "A majestic fire bird that soars through volcanic skies.",
    moves: [
      { level: 1, move_name: "Peck" },
      { level: 5, move_name: "Ember" },
      { level: 10, move_name: "Wing Attack" },
      { level: 20, move_name: "Flamethrower" }
    ],
    evolution: {
      method: "level",
      level: 36,
      into_name: "Phoenixar"
    }
  }
});
```

---

### implement_catch_system

Implementa el sistema de captura de criaturas con fórmulas auténticas de Pokémon.

#### Input Schema

```typescript
{
  project_path: string;           // Ruta al proyecto de RPG Maker MZ
  catch_items?: Array<{
    name: string;                 // Nombre del ítem (ej: "Criaball")
    catch_rate: number;           // Multiplicador de captura (1.0-3.0)
    price: number;                // Precio en la tienda
    icon_index?: number;          // Índice del ícono (default: 176)
    description?: string;         // Descripción del ítem
  }>;
}
```

#### Output

```typescript
{
  success: boolean;
  items_created: number;
  items: Array<{
    id: number;
    name: string;
    rate: number;
  }>;
  files_created: string[];        // Archivos creados
  next_steps: string[];           // Pasos para completar la implementación
}
```

#### Ejemplo de uso

```typescript
const result = await implementCatchSystemTool.execute({
  project_path: "/Users/dev/MyGame",
  catch_items: [
    {
      name: "Criaball",
      catch_rate: 1.0,
      price: 200,
      description: "A basic capture device for wild creatures"
    },
    {
      name: "Super Criaball",
      catch_rate: 1.5,
      price: 600,
      description: "An improved ball with better capture rates"
    },
    {
      name: "Ultra Criaball",
      catch_rate: 2.0,
      price: 1200,
      description: "A high-performance capture device"
    },
    {
      name: "Master Criaball",
      catch_rate: 255.0,  // Captura garantizada
      price: 0,           // No se puede comprar
      description: "Captures any creature with 100% success"
    }
  ]
});

// Resultado:
{
  success: true,
  items_created: 4,
  items: [
    { id: 1, name: "Criaball", rate: 1.0 },
    { id: 2, name: "Super Criaball", rate: 1.5 },
    { id: 3, name: "Ultra Criaball", rate: 2.0 },
    { id: 4, name: "Master Criaball", rate: 255.0 }
  ],
  files_created: [
    "js/plugins/Pokemon_CatchSystem.js",
    "data/pokemon/catch_config.json",
    "data/Items.json"
  ],
  next_steps: [
    "Add 'Pokemon_CatchSystem' to the plugin list in the RPG Maker MZ editor",
    "Configure plugin parameters if needed",
    "Test catch mechanics in battle"
  ]
}
```

#### Fórmula de captura

El sistema implementa la fórmula auténtica de Pokémon (Gen 3+):

```javascript
a = ((3 * maxHP - 2 * currentHP) * catchRate * ballRate * statusBonus) / (3 * maxHP)

if (a >= 255) {
  // Captura garantizada
  return true;
}

b = 1048560 / Math.floor(Math.sqrt(Math.sqrt(16711680 / a)))

// 4 shake checks
for (let i = 0; i < 4; i++) {
  const random = Math.floor(Math.random() * 65535);
  if (random >= b) {
    return false; // Se escapa
  }
}

return true; // ¡Capturado!
```

**Bonus de estado:**
- Sleep/Freeze: 2.0x
- Paralysis/Poison/Burn: 1.5x
- Normal: 1.0x

---

### generate_creature_set

Genera un conjunto completo de criaturas temáticas usando Google Gemini AI.

#### Input Schema

```typescript
{
  project_path: string;           // Ruta al proyecto de RPG Maker MZ
  theme: string;                  // Tema o concepto para las criaturas
  count?: number;                 // Número de criaturas (default: 20)
  tier_distribution?: {
    tier1: number;                // % de tier 1 (0.0-1.0, default: 0.5)
    tier2: number;                // % de tier 2 (0.0-1.0, default: 0.3)
    tier3: number;                // % de tier 3 (0.0-1.0, default: 0.2)
  };
  starting_id?: number;           // ID inicial (default: auto-detect)
  generate_sprites?: boolean;     // Generar sprites con IA (default: false)
}
```

#### Output

```typescript
{
  success: boolean;
  theme: string;
  creatures_created: number;
  creatures_failed: number;
  creatures: Array<{
    id: number;
    name: string;
    types: string[];
    tier: 1 | 2 | 3;
  }>;
  errors?: Array<{
    index: number;
    error: string;
  }>;
  next_steps: string[];
}
```

#### Ejemplo de uso

```typescript
const result = await generateCreatureSetTool.execute({
  project_path: "/Users/dev/MyGame",
  theme: `Japanese mythology and yokai folklore. Create creatures inspired by:
    - Traditional yokai: Kitsune, Tanuki, Tengu, Kappa
    - Legendary creatures: Dragons, Phoenix, Qilin
    - Nature spirits: Cherry blossom spirits, bamboo guardians
    - Urban yokai: Modern interpretations

    Each creature should have a Japanese name and reflect the rich cultural heritage.`,
  count: 30,
  tier_distribution: {
    tier1: 0.6,  // 18 criaturas básicas
    tier2: 0.25, // 7-8 criaturas evolucionadas
    tier3: 0.15  // 4-5 criaturas legendarias
  },
  generate_sprites: false
});

// Resultado esperado:
{
  success: true,
  theme: "Japanese mythology and yokai folklore...",
  creatures_created: 30,
  creatures_failed: 0,
  creatures: [
    { id: 1, name: "Kitsunebi", types: ["fire", "psychic"], tier: 1 },
    { id: 2, name: "Tanukiko", types: ["normal", "dark"], tier: 1 },
    { id: 3, name: "Kappalon", types: ["water", "fighting"], tier: 1 },
    ...
    { id: 25, name: "Ryujinlord", types: ["dragon", "water"], tier: 3 },
    { id: 30, name: "Houou", types: ["fire", "flying"], tier: 3 }
  ],
  next_steps: [
    "Review generated creatures in data/pokemon/creatures.json",
    "Test creatures in RPG Maker MZ",
    "Add sprite images to img/enemies/",
    "Implement evolution chains if needed"
  ]
}
```

---

## 📊 TypeScript Types

### CreatureType

18 tipos disponibles:

```typescript
type CreatureType =
  | 'normal'    | 'fire'     | 'water'    | 'grass'
  | 'electric'  | 'ice'      | 'fighting' | 'poison'
  | 'ground'    | 'flying'   | 'psychic'  | 'bug'
  | 'rock'      | 'ghost'    | 'dragon'   | 'dark'
  | 'steel'     | 'fairy';
```

### BaseStats

```typescript
type BaseStats = {
  hp: number;         // 1-255
  attack: number;     // 1-255
  defense: number;    // 1-255
  spAttack: number;   // 1-255
  spDefense: number;  // 1-255
  speed: number;      // 1-255
};
```

### CreatureData

```typescript
type CreatureData = {
  id: number;
  name: string;
  types: [CreatureType] | [CreatureType, CreatureType];
  baseStats: BaseStats;
  catchRate: number;        // 3-255 (lower = harder)
  expYield: number;         // 50-400
  evolution?: Evolution;
  moves: LearnableMove[];
  description?: string;
};
```

### Evolution

```typescript
type Evolution = {
  method: 'level' | 'item' | 'trade' | 'happiness';
  level?: number;           // Para method: 'level'
  itemId?: number;          // Para method: 'item'
  intoId?: number;
  intoName?: string;
};
```

---

## 🧮 Pokemon Essentials Adapter

Fórmulas auténticas implementadas del motor Pokémon Essentials.

### calculateDamage()

Calcula daño de un ataque siguiendo la fórmula oficial de Pokémon.

```typescript
function calculateDamage(params: {
  attackerLevel: number;
  attackerStat: number;      // Atk o Sp.Atk
  defenderStat: number;      // Def o Sp.Def
  movePower: number;
  moveType: CreatureType;
  attackerTypes: CreatureType[];
  defenderTypes: CreatureType[];
  isCritical?: boolean;      // default: false
  randomFactor?: number;     // 0.85-1.0 (default: random)
}): number;
```

**Fórmula:**
```
levelFactor = (2 * Level / 5 + 2)
baseDamage = (levelFactor * Power * Atk/Def) / 50 + 2
STAB = attackerTypes.includes(moveType) ? 1.5 : 1.0
effectiveness = TYPE_EFFECTIVENESS[moveType][defenderType]
critical = isCritical ? 1.5 : 1.0

finalDamage = baseDamage * STAB * effectiveness * critical * randomFactor
```

### calculateCatchRate()

Calcula probabilidad de captura.

```typescript
function calculateCatchRate(params: {
  maxHP: number;
  currentHP: number;
  catchRate: number;         // Catch rate de la especie (3-255)
  ballRate: number;          // Multiplicador de la ball (1.0-255.0)
  statusBonus?: number;      // default: 1.0
}): number; // Retorna probabilidad 0-100
```

### generateBalancedStats()

Genera stats balanceadas según tier y arquetipo.

```typescript
function generateBalancedStats(
  tier: 1 | 2 | 3,
  archetype?: 'physical' | 'special' | 'tank' | 'speedy' | 'balanced'
): BaseStats;
```

**Base Stat Totals:**
- Tier 1: 300-350
- Tier 2: 400-450
- Tier 3: 500-600

**Arquetipos:**
- `physical`: Alto Attack, bajo Sp.Attack
- `special`: Alto Sp.Attack, bajo Attack
- `tank`: Alto HP/Defense/Sp.Defense, bajo Speed
- `speedy`: Alto Speed, stats ofensivas decentes
- `balanced`: Stats distribuidas uniformemente

---

## 🎨 Utilidades

### File System

```typescript
// Leer JSON
async function readJSON<T>(filePath: string): Promise<T>

// Escribir JSON
async function writeJSON<T>(filePath: string, data: T): Promise<void>

// Leer datos de RPG Maker
async function readRPGMakerData<T>(
  projectPath: string,
  dataFile: string
): Promise<T[]>

// Validar proyecto de RPG Maker
async function isValidRPGMakerProject(projectPath: string): Promise<boolean>

// Crear directorio
async function ensureDir(dirPath: string): Promise<void>
```

### RPG Maker Utilities

```typescript
// Obtener enemigos
async function getEnemies(projectPath: string): Promise<RPGMakerEnemy[]>

// Añadir enemigo
async function addEnemy(
  projectPath: string,
  enemy: RPGMakerEnemy
): Promise<void>

// Obtener ítems
async function getItems(projectPath: string): Promise<RPGMakerItem[]>

// Añadir ítem
async function addItem(
  projectPath: string,
  item: RPGMakerItem
): Promise<void>

// Crear enemigo por defecto
function createDefaultEnemy(id: number, name: string): RPGMakerEnemy

// Crear ítem por defecto
function createDefaultItem(id: number, name: string): RPGMakerItem

// Obtener siguiente ID disponible
function getNextAvailableId<T extends { id: number }>(items: T[]): number
```

### Gemini AI

```typescript
// Generar contenido con Gemini
async function generateWithGemini(options: {
  prompt: string;
  temperature?: number;      // 0.0-1.0 (default: 0.7)
  maxTokens?: number;        // default: 2048
}): Promise<string>

// Generar concepto de criatura
async function generateCreatureConcept(params: {
  theme: string;
  index: number;
  total: number;
  tier: 1 | 2 | 3;
}): Promise<{
  name: string;
  types: [string] | [string, string];
  description: string;
  archetype: string;
}>
```

---

## 🔗 Integración con Claude Desktop

### Configuración

```json
{
  "mcpServers": {
    "pokemon-game-mcp": {
      "command": "npx",
      "args": ["-y", "pokemon-game-mcp"],
      "env": {
        "GEMINI_API_KEY": "tu-api-key-aqui"
      }
    }
  }
}
```

### Ejemplo de conversación

```
Usuario: "Crea 15 criaturas de océano profundo para mi juego"

Claude ejecuta internamente:
- generate_creature_set
  - project_path: [detectado del contexto]
  - theme: "Deep ocean creatures: bioluminescent fish, giant squids,
            ancient sea monsters, coral guardians, abyssal beings"
  - count: 15
  - tier_distribution: { tier1: 0.5, tier2: 0.3, tier3: 0.2 }

Usuario: "Ahora implementa el sistema de captura con 4 tipos de bolas"

Claude ejecuta:
- implement_catch_system
  - project_path: [mismo proyecto]
  - catch_items: [
      { name: "Aquaball", catch_rate: 1.5 },  // Mejor con criaturas de agua
      { name: "Deepball", catch_rate: 2.0 },  // Para criaturas de agua profunda
      ...
    ]
```

---

## 📝 Notas de Implementación

### Archivos generados

```
tu-proyecto-rpgmaker/
├── data/
│   ├── Enemies.json          # Criaturas añadidas aquí
│   ├── Items.json            # Bolas de captura aquí
│   └── pokemon/
│       ├── creatures.json    # Datos extendidos de criaturas
│       └── catch_config.json # Configuración del sistema
└── js/
    └── plugins/
        └── Pokemon_CatchSystem.js  # Plugin generado
```

### Performance

- **generate_creature_set**: ~2-3 segundos por criatura (API call a Gemini)
- **create_creature**: ~100-200ms por criatura
- **implement_catch_system**: ~500ms (una sola vez)

### Límites

- Máximo 9999 criaturas por proyecto (límite de RPG Maker MZ)
- Máximo 2 tipos por criatura
- Base stats: 1-255 por stat
- Catch rate: 3-255 (3 = legendario, 255 = común)

---

**Proyecto**: pokemon-game-mcp v1.0.0
**Autor**: Stratomai
**Repositorio**: https://github.com/DoubleN96/pokemon-game-mcp
