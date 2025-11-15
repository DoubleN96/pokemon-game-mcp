# 🏛️ Criaturas de Madrid - Ejemplo Completo

Este ejemplo demuestra cómo usar **pokemon-game-mcp** para generar un conjunto completo de criaturas temáticas inspiradas en Madrid.

## 🎯 Contenido

El generador crea **20 criaturas** distribuidas en 3 tiers:

### Tier 1 - Criaturas Básicas (10)
Inspiradas en elementos cotidianos de Madrid:
- 🐻 **Osín** - El osito de la Puerta del Sol
- 🥖 **Churrito** - Inspirado en los churros madrileños
- 🎭 **Chulapín** - Basado en los chulapos
- 🌳 **Retirito** - Criatura del Parque del Retiro
- Y más...

### Tier 2 - Criaturas Evolucionadas (6)
Versiones mejoradas con más poder:
- 🏰 **Alcalón** - Evolución inspirada en la Puerta de Alcalá
- 🍲 **Cocidón** - Versión poderosa del Cocido Madrileño
- 🦁 **Cibeleón** - Evolución de la Fuente de Cibeles
- Y más...

### Tier 3 - Criaturas Legendarias (4)
Las más poderosas, inspiradas en monumentos emblemáticos:
- 👑 **Palareal** - El Palacio Real transformado
- ⚡ **Granvión** - Poder de la Gran Vía
- 🌊 **Manzanares** - Espíritu del río
- 🎨 **Pradolux** - Energía del Museo del Prado

## 📋 Prerequisitos

1. **Node.js** >= 20.0.0
2. **RPG Maker MZ** con un proyecto creado
3. **API Key de Google Gemini**
   - Obtén tu key en: https://makersuite.google.com/app/apikey
   - Configúrala: `export GEMINI_API_KEY=tu_api_key_aqui`

## 🚀 Uso

### Opción 1: Usar el script de ejemplo

```bash
# 1. Clona el repositorio
git clone https://github.com/DoubleN96/pokemon-game-mcp.git
cd pokemon-game-mcp

# 2. Instala dependencias y compila
npm install
npm run build

# 3. Configura tu API key
export GEMINI_API_KEY=AIzaSyCRsoC263QtM0nHWl1747JF6MDm3YDg6dI

# 4. Ejecuta el generador
cd examples/madrid-creatures
node generate.mjs /ruta/a/tu/proyecto/rpgmaker
```

### Opción 2: Usar como MCP Server

Si tienes Claude Desktop configurado con el MCP Server:

```
Usuario: "Genera 20 criaturas de Madrid en mi proyecto"

Claude usará automáticamente la herramienta generate_creature_set
con el tema de Madrid.
```

## 📂 Estructura Generada

Después de ejecutar el script, tu proyecto de RPG Maker tendrá:

```
tu-proyecto-rpgmaker/
├── data/
│   ├── Enemies.json          # ← Criaturas añadidas aquí
│   └── pokemon/
│       ├── creatures.json    # ← Datos extendidos de criaturas
│       └── catch_config.json # ← Configuración del sistema de captura
└── img/
    └── enemies/              # ← Añade aquí los sprites (opcional)
```

## 🎨 Añadir Sprites

Los sprites no se generan automáticamente. Tienes varias opciones:

### Opción 1: Pixel Art Manual
Crea sprites de 64x64 o 128x128 en tu editor favorito:
- Aseprite
- Piskel
- GraphicsGale

### Opción 2: IA Generativa
Usa herramientas como:
- **Midjourney**: `/imagine pokemon-style creature, pixel art, Madrid bear`
- **DALL-E**: "Pixel art Pokemon-style creature based on Madrid's bear statue"
- **Stable Diffusion**: Con el modelo apropiado para pixel art

### Opción 3: Assets de la Comunidad
Busca en:
- OpenGameArt.org
- Itch.io
- RPG Maker forums

**Naming**: Los sprites deben coincidir con los nombres de las criaturas:
```
img/enemies/Osín.png
img/enemies/Churrito.png
img/enemies/Alcalón.png
```

## 🎮 Testing en RPG Maker MZ

1. **Abre tu proyecto** en RPG Maker MZ
2. **Ve a Database > Enemies**
3. **Verifica** que las criaturas están importadas
4. **Crea un encuentro** de prueba:
   - Database > Troops
   - New
   - Añade tus criaturas
5. **Prueba en el juego**:
   - Crea un evento de batalla
   - Testea el combate
   - Prueba el sistema de captura (si lo implementaste)

## 🔧 Personalización

### Cambiar la distribución de tiers

```javascript
tier_distribution: {
  tier1: 0.6,  // 60% básicas
  tier2: 0.3,  // 30% evolucionadas
  tier3: 0.1,  // 10% legendarias
}
```

### Cambiar el tema

```javascript
theme: "Barcelona landmarks and culture"
theme: "Japanese yokai and mythology"
theme: "Underwater ocean creatures"
```

### Ajustar cantidad

```javascript
count: 50  // Genera 50 criaturas en lugar de 20
```

## 📊 Estadísticas de las Criaturas

Todas las criaturas generadas siguen las fórmulas de **Pokémon Essentials**:

### Tier 1 (Básicas)
- **Base Stat Total**: ~300-350
- **Catch Rate**: 190 (fácil)
- **EXP Yield**: 64
- **Movimientos**: 4-6

### Tier 2 (Evolucionadas)
- **Base Stat Total**: ~400-450
- **Catch Rate**: 90 (medio)
- **EXP Yield**: 142
- **Movimientos**: 6-8

### Tier 3 (Legendarias)
- **Base Stat Total**: ~500-600
- **Catch Rate**: 45 (difícil)
- **EXP Yield**: 220
- **Movimientos**: 8-10

## 🤝 Contribuir

¿Tienes ideas para mejorar las criaturas de Madrid?

1. Fork el repositorio
2. Crea una branch: `git checkout -b feature/mejor-madrid`
3. Commit tus cambios: `git commit -m 'feat: añadir criaturas del Rastro'`
4. Push: `git push origin feature/mejor-madrid`
5. Abre un Pull Request

## 📝 Licencia

MIT - Siéntete libre de usar este ejemplo en tus proyectos.

## 🙏 Agradecimientos

- **RPG Maker MZ** por la plataforma
- **Pokémon Essentials** por las fórmulas
- **Google Gemini** por la generación de IA
- **Madrid** por la inspiración ❤️

---

**Creado por**: Stratomai
**Repositorio**: https://github.com/DoubleN96/pokemon-game-mcp
**MCP Server**: pokemon-game-mcp
