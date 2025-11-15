# 🔌 Compatibilidad con Plugins de RPG Maker MZ

Este documento explica cómo el **pokemon-game-mcp** genera datos compatibles con los plugins de Pokémon para RPG Maker MZ, eliminando la necesidad de programar sistemas desde cero.

## 🎯 Filosofía de Diseño

El MCP server **NO inventa sistemas nuevos**. En su lugar, genera datos en formatos que funcionan directamente con plugins populares y probados de la comunidad de RPG Maker MZ.

## 📦 Plugins Soportados

### Monster Capture System (Synrec)

**Repositorio:** https://github.com/Synrec/RPG-Maker-MZ-Monster-Capture

**6 Plugins incluidos:**
1. `Synrec_MC_Core` - Sistema de captura
2. `Synrec_MC_BattleCore` - Integración de batalla
3. `Synrec_MC_Evolution` - Sistema de evolución
4. `Synrec_MC_Beastiary` - Pokédex/Bestiario
5. `Synrec_MC_GenderTraits` - Sistema de género
6. `Synrec_MC_PlayerSetup` - Configuración inicial

### Pokemon Mechanics (SumRndmDde)

**Website:** https://sumrndm.site/category/plugins/pokemon-plugins/

**4 Plugins incluidos:**
1. `SRD_PokemonTypeSystem` - 18 tipos con efectividad
2. `SRD_PokemonTypeDisplay` - UI de tipos
3. `SRD_Natures` - 25 naturalezas
4. `SRD_Pokemon4MovesOnly` - Límite de 4 movimientos

## 🔧 Formato de Datos Generados

### Estructura de Pokémon en `data/Enemies.json`

```json
{
  "id": 1,
  "name": "Chulapón",
  "battlerName": "001_Chulapon",
  "battlerHue": 0,
  "params": [45, 49, 49, 45, 65, 49, 45, 45],
  "exp": 64,
  "gold": 50,
  "traits": [
    { "code": 11, "dataId": 1, "value": 0 },  // Element: Physical (Normal)
    { "code": 11, "dataId": 2, "value": 0 }   // Element: Fighting
  ],
  "actions": [
    {
      "skillId": 1,
      "conditionType": 0,
      "conditionParam1": 0,
      "conditionParam2": 0,
      "rating": 5
    }
  ],
  "note": "<catchRate:45>\n<evolution:2,16>"
}
```

### Campos Críticos para Plugins

#### `note` - Tags de Plugin

Las notas (`note`) contienen tags que los plugins de Synrec leen:

```javascript
<catchRate:45>        // Para Synrec_MC_Core
<evolution:2,16>      // Para Synrec_MC_Evolution (evoluciona a ID 2 en nivel 16)
<gender:0.5>          // Para Synrec_MC_GenderTraits (50% macho/hembra)
```

**Catch Rates por Rareza:**

| Rareza | Catch Rate | Descripción |
|--------|------------|-------------|
| Común | 255 | Pokémon básicos de ruta (ej. Ratamad, Pichoneta) |
| Raro | 45 | Pokémon evolucionados, iniciales (ej. Chulapón) |
| Muy Raro | 25 | Pokémon finales, pseudo-legendarios |
| Legendario | 3 | Legendarios principales (ej. Metrión, Ursabón) |
| Sub-Legendario | 45 | Legendarios menores |

#### `traits` - Sistema de Tipos

Los traits mapean tipos de Pokémon a Elements de RPG Maker MZ:

```javascript
// Código de trait 11 = Element Rate
// dataId = ID del elemento
// value = 0 (neutral, no afecta resistencias)

{ "code": 11, "dataId": 2, "value": 0 }  // Tipo Fuego
{ "code": 11, "dataId": 5, "value": 0 }  // Tipo Agua
```

**Mapeo Completo de Tipos:**

```javascript
const TYPE_TO_ELEMENT = {
  "normal": 1,      // Physical
  "fire": 2,        // Fire
  "ice": 3,         // Ice
  "electric": 4,    // Thunder
  "water": 5,       // Water
  "ground": 6,      // Earth
  "flying": 7,      // Wind
  "psychic": 8,     // Light
  "dark": 9,        // Dark
  "fighting": 1,    // Physical (también usa Physical)
  "poison": 6,      // Earth (comparte con Ground)
  "bug": 7,         // Wind (comparte con Flying)
  "rock": 6,        // Earth (comparte con Ground)
  "ghost": 9,       // Dark (comparte con Dark)
  "steel": 1,       // Physical (comparte)
  "grass": 5,       // Water (comparte)
  "dragon": 2,      // Fire (comparte)
  "fairy": 8        // Light (comparte)
};
```

#### `params` - Estadísticas Base

Array de 8 valores: `[HP, ATK, DEF, MATK, MDEF, AGI, LUK, EXP]`

```javascript
// Ejemplo: Chulapón (Tier 1 - Inicial)
"params": [45, 49, 49, 45, 65, 49, 45, 45]

// Ejemplo: Castizón (Tier 2 - Evolucionado Final)
"params": [95, 115, 95, 80, 100, 95, 70, 170]
```

**Base Stat Total (BST) por Tier:**

| Tier | BST Aproximado | Ejemplo |
|------|---------------|---------|
| 1 - Básico | 250-350 | Ratamad, Pichoneta |
| 2 - Evolucionado | 380-420 | Chulapón, Azulejín |
| 3 - Final | 480-540 | Castizón, Mayólicon |
| Legendario | 580-680 | Metrión, Ursabón |

### Estructura Extendida en `data/pokemon/creatures.json`

Datos adicionales que el MCP mantiene pero RPG Maker MZ no usa directamente:

```json
{
  "id": 1,
  "name": "Chulapón",
  "species": "Pokemon Chulapo",
  "types": ["normal", "fighting"],
  "base_stats": {
    "hp": 45,
    "attack": 49,
    "defense": 49,
    "sp_attack": 45,
    "sp_defense": 65,
    "speed": 49
  },
  "catch_rate": 45,
  "base_exp": 64,
  "growth_rate": "medium_slow",
  "egg_groups": ["field", "human-like"],
  "gender_ratio": 0.5,
  "hatch_time": 5120,
  "height": 0.8,
  "weight": 25.0,
  "color": "brown",
  "shape": "upright",
  "habitat": "urban",
  "description": "Criatura castiza de Madrid. Representa el espíritu chulapo...",
  "evolution": {
    "method": "level",
    "level": 16,
    "into": "Chulapón-Plus",
    "into_id": 2
  },
  "abilities": [
    "Intimidación",
    "Cabezonería"
  ],
  "moves": [
    {
      "level": 1,
      "move_name": "Placaje",
      "power": 40,
      "accuracy": 100,
      "pp": 35,
      "type": "normal",
      "category": "physical"
    }
  ]
}
```

## 🎮 Flujo de Trabajo MCP → Plugins

### 1. Generación con MCP

```javascript
// Usuario pide a Claude
"Genera 20 Pokémon de Madrid con temas de cultura madrileña"

// MCP ejecuta
await generateCreatureSet({
  project_path: "/root/pokemon-madrid-game",
  theme: "Madrid culture",
  count: 20
});
```

### 2. MCP Crea Archivos

```bash
data/
├── Enemies.json          # RPG Maker MZ lee esto
└── pokemon/
    └── creatures.json    # Datos extendidos (referencia)
```

### 3. Plugins Leen Datos

```javascript
// Synrec_MC_Core lee
const enemy = $dataEnemies[1];
const catchRate = enemy.meta.catchRate;  // "45"

// SRD_PokemonTypeSystem lee
const types = enemy.traits
  .filter(t => t.code === 11)
  .map(t => ELEMENTS[t.dataId]);  // ["normal", "fighting"]

// Synrec_MC_Evolution lee
const evolution = enemy.meta.evolution;  // "2,16"
```

### 4. Juego Funciona

- ✅ Captura con fórmula Pokémon Gen 1-5
- ✅ Evolución automática al nivel indicado
- ✅ Tipos con efectividad correcta
- ✅ Pokédex registra capturas
- ✅ Límite de 4 movimientos
- ✅ Naturalezas afectan stats

## 📊 Ejemplo Completo: Chulapón

### Datos Generados por MCP

**Input al MCP:**
```javascript
{
  id: 1,
  name: "Chulapón",
  types: ["normal", "fighting"],
  base_stats: { hp: 45, attack: 49, defense: 49, sp_attack: 45, sp_defense: 65, speed: 49 },
  catch_rate: 45,
  exp_yield: 64,
  evolution: { method: "level", level: 16, into_name: "Chulapón-Plus" }
}
```

**Output en `data/Enemies.json`:**
```json
{
  "id": 1,
  "name": "Chulapón",
  "battlerName": "001_Chulapon",
  "params": [45, 49, 49, 45, 65, 49, 45, 64],
  "traits": [
    { "code": 11, "dataId": 1, "value": 0 },
    { "code": 11, "dataId": 1, "value": 0 }
  ],
  "note": "<catchRate:45>\n<evolution:2,16>"
}
```

### Comportamiento en el Juego

1. **Encuentro Salvaje**
   - Aparece Chulapón nivel 5
   - SRD_PokemonTypeDisplay muestra: "Normal/Lucha"

2. **Intento de Captura**
   - Jugador usa Poké Ball
   - Synrec_MC_Core calcula: `((3*45 - 2*30) * 45 * 1.0) / (3*45) = 38.3%`
   - Captura exitosa

3. **Evolución**
   - Chulapón sube a nivel 16
   - Synrec_MC_Evolution detecta `<evolution:2,16>`
   - Animación de evolución
   - Se convierte en Chulapón-Plus (ID: 2)

4. **Pokédex**
   - Synrec_MC_Beastiary registra:
     - ✅ Chulapón visto
     - ✅ Chulapón capturado
     - Pokédex: 1/80

## 🛠️ Extensiones Futuras

Plugins que podrían añadirse sin modificar datos del MCP:

- ✅ **VisuStella Battle Core** - Mejores animaciones de batalla
- ✅ **Breeding System** - Sistema de cría (usa `egg_groups` de creatures.json)
- ✅ **IVs/EVs System** - Stats individuales
- ✅ **Ability System** - Habilidades (usa `abilities` de creatures.json)
- ✅ **Hold Items** - Objetos equipados
- ✅ **Shiny System** - Pokémon brillantes

## 📚 Referencias

- [Monster Capture GitHub](https://github.com/Synrec/RPG-Maker-MZ-Monster-Capture)
- [SumRndmDde Plugins](https://sumrndm.site/category/plugins/pokemon-plugins/)
- [Pokémon Madrid - Guía de Plugins](https://github.com/DoubleN96/pokemon-madrid-game/blob/main/docs/PLUGINS_GUIDE.md)
- [RPG Maker MZ Database Format](https://www.rpgmakerweb.com/support/products/plugins/mz)

---

**Última actualización:** 2025-11-15
