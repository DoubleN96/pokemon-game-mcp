# Pokémon Game MCP Server

MCP (Model Context Protocol) Server para crear juegos estilo Pokémon en RPG Maker MZ usando IA para generar criaturas, mecánicas y contenido.

## 🎮 Características

- **Generación de Criaturas con IA**: Crea conjuntos completos de criaturas temáticas con sprites generados automáticamente
- **Sistema de Captura**: Implementa mecánicas de captura estilo Pokémon con fórmulas auténticas
- **Sistema de Combate**: Tipos, ventajas/desventajas, movimientos y estrategia
- **Evoluciones**: Sistema completo de evolución de criaturas
- **Integración con RPG Maker MZ**: Exporta directamente a proyectos de RPG Maker MZ
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
Genera un conjunto completo de criaturas temáticas con IA.

**Parámetros:**
- `project_path`: Ruta al proyecto
- `theme`: Tema para las criaturas
- `count`: Número de criaturas a generar
- `include_evolutions`: Incluir evoluciones

**Ejemplo:**
```json
{
  "project_path": "/path/to/game",
  "theme": "Madrid culture and mythology",
  "count": 20,
  "include_evolutions": true
}
```

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

Genera un juego completo basado en la cultura madrileña:

```typescript
// Ejemplo de criaturas generadas:
- Chulapo (Normal/Fighting) - Basado en el chulapo madrileño
- Gatoloco (Dark/Psychic) - Gato de Lavapiés
- Ososol (Ground/Fire) - Oso y el Madroño
- Retirón (Grass/Fairy) - Criatura del Retiro
```

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
- Desarrollado con [Model Context Protocol](https://modelcontextprotocol.io)

## 🔗 Enlaces

- [Documentación de RPG Maker MZ](https://www.rpgmakerweb.com/support/products/rpg-maker-mz)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Claude Desktop](https://claude.ai/download)

---

**Hecho con ❤️ por Stratomai**
