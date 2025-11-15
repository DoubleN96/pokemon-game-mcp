# Pokémon Game MCP Server

MCP (Model Context Protocol) Server para crear juegos estilo Pokémon en RPG Maker MZ usando IA para generar criaturas, mecánicas y contenido.

## 🎮 Características

- **Generación de Criaturas con IA**: Crea conjuntos completos de criaturas temáticas con sprites generados automáticamente
- **Sistema de Captura**: Implementa mecánicas de captura estilo Pokémon con fórmulas auténticas
- **Sistema de Combate**: Tipos, ventajas/desventajas, movimientos y estrategia
- **Evoluciones**: Sistema completo de evolución de criaturas
- **Integración con RPG Maker MZ**: Exporta directamente a proyectos de RPG Maker MZ
- **Compatibilidad con Plugins**: Genera datos compatibles con Monster Capture System (Synrec) y Pokemon Mechanics (SumRndmDde)
- **Adaptador de Pokémon Essentials**: Importa datos y mecánicas de Pokémon Essentials

## 🚀 Instalación

### Requisitos

- Node.js >= 20.0.0
- NPM >= 9.0.0
- RPG Maker MZ (para usar los juegos generados)

### Instalar desde npm

```bash
npm install -g pokemon-game-mcp
```

### Instalar desde el repositorio

```bash
git clone https://github.com/stratomai/pokemon-game-mcp.git
cd pokemon-game-mcp
npm install
npm run build
```

## 📖 Uso

### Configurar en Claude Desktop

Agrega el servidor MCP a tu configuración de Claude Desktop (`claude_desktop_config.json`):

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

### Uso desde Claude

Una vez configurado, puedes interactuar con el servidor desde Claude:

```
# Crear un conjunto de criaturas temáticas
Genera 20 criaturas basadas en la cultura de Madrid

# Implementar sistema de captura
Implementa el sistema de captura con 3 tipos de bolas

# Crear un juego completo
Crea un juego completo de criaturas de Madrid con 3 iniciales y 100 criaturas totales
```

## 🛠️ Herramientas Disponibles

### Core Tools

#### `create_creature`
Crea una nueva criatura con estadísticas, tipos, movimientos y evoluciones.

**Parámetros:**
- `project_path`: Ruta al proyecto de RPG Maker MZ
- `creature_data`: Datos de la criatura (stats, tipos, movimientos)
- `generate_sprite`: (Opcional) Generar sprite con IA

**Ejemplo:**
```json
{
  "project_path": "/path/to/game",
  "creature_data": {
    "id": 1,
    "name": "Chulapo",
    "types": ["normal", "fighting"],
    "base_stats": {
      "hp": 45,
      "attack": 49,
      "defense": 49,
      "spAttack": 45,
      "spDefense": 65,
      "speed": 45
    }
  },
  "generate_sprite": true
}
```

#### `implement_catch_system`
Implementa el sistema de captura de criaturas.

**Parámetros:**
- `project_path`: Ruta al proyecto de RPG Maker MZ
- `catch_items`: Array de items de captura con sus tasas

**Ejemplo:**
```json
{
  "project_path": "/path/to/game",
  "catch_items": [
    { "name": "Criaball", "catch_rate": 1.0, "price": 200 },
    { "name": "Super Criaball", "catch_rate": 1.5, "price": 600 }
  ]
}
```

#### `generate_creature_set`
Genera un conjunto completo de criaturas temáticas con IA usando Google Gemini.

**Parámetros:**
- `project_path`: Ruta al proyecto de RPG Maker MZ
- `theme`: Tema o concepto para las criaturas (ej: "Madrid culture", "Ocean creatures")
- `count`: Número de criaturas a generar (default: 20)
- `tier_distribution`: Distribución por tier (default: 50% tier1, 30% tier2, 20% tier3)
- `starting_id`: ID inicial para las criaturas (default: auto-detect)
- `generate_sprites`: Generar sprites con IA (experimental, default: false)

**Ejemplo:**
```json
{
  "project_path": "/path/to/game",
  "theme": "Madrid landmarks and culture: Puerta del Sol, Retiro Park, churros, chulapos",
  "count": 20,
  "tier_distribution": {
    "tier1": 0.5,
    "tier2": 0.3,
    "tier3": 0.2
  },
  "generate_sprites": false
}
```

**Resultado:**
```json
{
  "success": true,
  "theme": "Madrid landmarks and culture...",
  "creatures_created": 20,
  "creatures_failed": 0,
  "creatures": [
    { "id": 1, "name": "Osín", "types": ["normal"], "tier": 1 },
    { "id": 2, "name": "Churrito", "types": ["fire"], "tier": 1 },
    ...
  ],
  "next_steps": [
    "Review generated creatures in data/pokemon/creatures.json",
    "Test creatures in RPG Maker MZ",
    "Add sprite images to img/enemies/"
  ]
}
```

## 🔌 Integración con Plugins de RPG Maker MZ

Este MCP server genera datos **100% compatibles** con los plugins más populares de Pokémon para RPG Maker MZ:

### Monster Capture System (Synrec)
Los Pokémon generados incluyen:
- ✅ **catch_rate** compatible con `Synrec_MC_Core` (fórmula Gen 1-5)
- ✅ **evolution** configurado para `Synrec_MC_Evolution`
- ✅ **gender_traits** para `Synrec_MC_GenderTraits`
- ✅ Registro automático en `Synrec_MC_Beastiary` (Pokédex)

### Pokemon Mechanics (SumRndmDde)
- ✅ **Tipos** mapeados a Elements de RPG Maker MZ para `SRD_PokemonTypeSystem`
- ✅ **Movimientos** limitados a 4 máximo (`SRD_Pokemon4MovesOnly`)
- ✅ **Naturalezas** compatibles con `SRD_Natures`
- ✅ **Dual-type** soportado por `SRD_PokemonTypeDisplay`

### Fórmula de Captura Implementada

```javascript
((3 * HP_MAX - 2 * HP_ACTUAL) * CATCH_RATE * BALL_BONUS) / (3 * HP_MAX)
```

**Catch Rates generados por el MCP:**
- Pokémon comunes: `255` (muy fácil de capturar)
- Pokémon raros/evolucionados: `45` (difícil)
- Legendarios: `3` (extremadamente difícil)

### Mapeo de Tipos → Elements

| Tipo Pokémon | RPG Maker Element | ID |
|--------------|-------------------|-----|
| Normal | Physical | 1 |
| Fuego | Fire | 2 |
| Hielo | Ice | 3 |
| Eléctrico | Thunder | 4 |
| Agua | Water | 5 |
| Tierra | Earth | 6 |
| Volador | Wind | 7 |
| Psíquico | Light | 8 |
| Siniestro | Dark | 9 |

**Ver documentación completa de plugins en:** [pokemon-madrid-game/docs/PLUGINS_GUIDE.md](https://github.com/DoubleN96/pokemon-madrid-game/blob/main/docs/PLUGINS_GUIDE.md)

## 🏗️ Arquitectura

```
pokemon-game-mcp/
├── src/
│   ├── index.ts              # MCP Server principal
│   ├── tools/
│   │   ├── rpgmaker/         # Herramientas de RPG Maker
│   │   └── pokemon/          # Herramientas específicas de Pokémon
│   ├── bridges/              # Adaptadores (Essentials, etc.)
│   ├── generators/           # Generadores con IA
│   ├── types/                # Definiciones de tipos TypeScript
│   └── utils/                # Utilidades
├── templates/                # Plantillas de criaturas, mapas, etc.
└── examples/                 # Ejemplos de uso
```

## 🎨 Ejemplo: Criaturas de Madrid

Un ejemplo completo que genera 20 criaturas inspiradas en Madrid está disponible en `examples/madrid-creatures/`.

### Ejecutar el ejemplo

```bash
# 1. Asegúrate de tener tu proyecto de RPG Maker MZ listo
# 2. Configura tu API key de Gemini
export GEMINI_API_KEY=tu_api_key_aqui

# 3. Ejecuta el generador
cd examples/madrid-creatures
node generate.mjs /path/to/rpgmaker/project
```

### Criaturas generadas

El ejemplo genera criaturas basadas en:

**Tier 1 - Básicas (10 criaturas)**
- 🐻 Osín - El osito de la Puerta del Sol
- 🥖 Churrito - Inspirado en churros madrileños
- 🎭 Chulapín - Basado en los chulapos
- 🌳 Retirito - Criatura del Parque del Retiro
- Y más...

**Tier 2 - Evolucionadas (6 criaturas)**
- 🏰 Alcalón - Evolución inspirada en la Puerta de Alcalá
- 🍲 Cocidón - Versión poderosa del Cocido Madrileño
- 🦁 Cibeleón - Evolución de la Fuente de Cibeles

**Tier 3 - Legendarias (4 criaturas)**
- 👑 Palareal - El Palacio Real transformado
- ⚡ Granvión - Poder de la Gran Vía
- 🌊 Manzanares - Espíritu del río
- 🎨 Pradolux - Energía del Museo del Prado

Ver documentación completa en [`examples/madrid-creatures/README.md`](examples/madrid-creatures/README.md)

## 📋 Templates

El proyecto incluye templates JSON para crear criaturas manualmente sin usar IA:

- **`templates/basic-creature.json`** - Tier 1 (Base Stat Total ~318)
- **`templates/evolved-creature.json`** - Tier 2 (Base Stat Total ~405)
- **`templates/legendary-creature.json`** - Tier 3 (Base Stat Total ~680)

### Uso de templates

```javascript
import basicCreature from './templates/basic-creature.json' assert { type: 'json' };

// Personaliza
basicCreature.name = "MiCriatura";
basicCreature.types = ["fire", "flying"];

// Crea la criatura
await createCreatureTool.execute({
  project_path: "/path/to/project",
  creature_data: basicCreature
});
```

Ver documentación completa en [`templates/README.md`](templates/README.md)

## 🔧 Desarrollo

### Compilar

```bash
npm run build
```

### Modo desarrollo (watch)

```bash
npm run dev
```

### Tests

```bash
npm run test
npm run test:watch
npm run test:coverage
```

### Linting y formato

```bash
npm run lint
npm run format
```

## 📝 API Key de Gemini

Para generar sprites y contenido con IA, necesitas una API key de Google Gemini:

1. Obtén tu API key en: https://makersuite.google.com/app/apikey
2. Configúrala en el archivo de configuración de Claude Desktop
3. O como variable de entorno: `export GEMINI_API_KEY=tu-api-key`

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el repositorio
2. Crea una branch para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva característica'`)
4. Push a la branch (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles

## 🙏 Créditos

- Basado en [rpgmaker-mz-mcp](https://github.com/ShunsukeHayashi/rpgmaker-mz-mcp)
- Mecánicas inspiradas en [Pokémon Essentials](https://github.com/Maruno17/pokemon-essentials)
- Plugins compatibles:
  - [Monster Capture System](https://github.com/Synrec/RPG-Maker-MZ-Monster-Capture) por Synrec
  - [Pokemon Mechanics](https://sumrndm.site/category/plugins/pokemon-plugins/) por SumRndmDde
- Desarrollado con [Model Context Protocol](https://modelcontextprotocol.io)

## 🔗 Enlaces

- [Documentación de RPG Maker MZ](https://www.rpgmakerweb.com/support/products/rpg-maker-mz)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Claude Desktop](https://claude.ai/download)

---

**Hecho con ❤️ por Stratomai**
