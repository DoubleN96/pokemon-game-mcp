# 📋 Creature Templates

Esta carpeta contiene templates JSON para crear criaturas manualmente.

## 🎯 Uso

Usa estos templates como punto de partida para crear tus propias criaturas:

```javascript
// En tu código o usando el MCP tool
const creatureData = require('./templates/basic-creature.json');

// Personaliza los datos
creatureData.name = "MyAwesomeCreature";
creatureData.types = ["fire", "fighting"];

// Usa el tool create_creature
await createCreatureTool.execute({
  project_path: "/path/to/rpgmaker",
  creature_data: creatureData
});
```

## 📁 Templates Disponibles

### `basic-creature.json` - Tier 1
**Base Stat Total**: ~318
- Perfecto para criaturas iniciales
- Catch rate alto (190)
- Puede evolucionar

**Usos**:
- Starters del juego
- Criaturas comunes en rutas tempranas
- Primera etapa de cadenas evolutivas

### `evolved-creature.json` - Tier 2
**Base Stat Total**: ~405
- Forma evolucionada
- Dual typing
- Stats balanceados

**Usos**:
- Segunda etapa evolutiva
- Criaturas de nivel medio
- Boss battles de dificultad media

### `legendary-creature.json` - Tier 3
**Base Stat Total**: ~680
- Criatura legendaria única
- Stats excepcionales
- Catch rate bajo (45)

**Usos**:
- Legendarios de la historia
- Boss finales
- Criaturas post-game

## 🎨 Personalizando Templates

### Cambiar Tipos

18 tipos disponibles:
```json
"types": ["fire", "fighting"]
```

Tipos: `normal`, `fire`, `water`, `grass`, `electric`, `ice`, `fighting`, `poison`, `ground`, `flying`, `psychic`, `bug`, `rock`, `ghost`, `dragon`, `dark`, `steel`, `fairy`

### Ajustar Stats

Las stats base siguen este patrón:
```json
"base_stats": {
  "hp": 45,        // Puntos de vida
  "attack": 49,    // Ataque físico
  "defense": 49,   // Defensa física
  "sp_attack": 65, // Ataque especial
  "sp_defense": 65,// Defensa especial
  "speed": 45      // Velocidad
}
```

**Rangos recomendados**:
- Tier 1: 30-65 por stat (Total: 300-350)
- Tier 2: 50-85 por stat (Total: 400-450)
- Tier 3: 90-154 por stat (Total: 500-600)

### Definir Evolución

```json
"evolution": {
  "method": "level",      // level | item | trade | happiness
  "level": 16,            // Si method = "level"
  "into_name": "Charizard" // Nombre de la evolución
}
```

Métodos de evolución:
- `level`: Evoluciona al alcanzar nivel X
- `item`: Requiere usar un ítem (implementación futura)
- `trade`: Evoluciona al intercambiar (implementación futura)
- `happiness`: Evoluciona con felicidad alta (implementación futura)

### Añadir Movimientos

```json
"moves": [
  { "level": 1, "move_name": "Tackle" },
  { "level": 5, "move_name": "Ember" },
  { "level": 10, "move_name": "Fire Spin" }
]
```

**Tips**:
- Nivel 1: Movimientos básicos (Tackle, Growl, etc.)
- Niveles 5-15: Movimientos tempranos del tipo
- Niveles 20+: Movimientos poderosos
- Tier 3: Incluye movimientos legendarios (Hyper Beam, Outrage)

## 🔧 Crear Variaciones

### Variación: Tanque Defensivo
```json
{
  "base_stats": {
    "hp": 95,
    "attack": 50,
    "defense": 110,
    "sp_attack": 50,
    "sp_defense": 110,
    "speed": 30
  }
}
```

### Variación: Sweeper Rápido
```json
{
  "base_stats": {
    "hp": 55,
    "attack": 110,
    "defense": 60,
    "sp_attack": 90,
    "sp_defense": 60,
    "speed": 130
  }
}
```

### Variación: Atacante Especial
```json
{
  "base_stats": {
    "hp": 70,
    "attack": 40,
    "defense": 70,
    "sp_attack": 130,
    "sp_defense": 80,
    "speed": 105
  }
}
```

## 📚 Referencias

- **Pokémon Essentials**: Fórmulas de daño y captura
- **Smogon**: Análisis de stats y arquetipos
- **Bulbapedia**: Referencia de tipos y movimientos

## 🤝 Contribuir

¿Creaste un template interesante? ¡Compártelo!

1. Añade tu template a esta carpeta
2. Documenta su propósito
3. Haz un Pull Request

---

**Proyecto**: pokemon-game-mcp
**Repositorio**: https://github.com/DoubleN96/pokemon-game-mcp
