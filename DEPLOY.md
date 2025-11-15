# 🚀 Deployment Instructions

## Subir el código a GitHub

El repositorio ya está creado en: **https://github.com/DoubleN96/pokemon-game-mcp**

### Opción 1: Usando SSH (Recomendado)

```bash
# Configurar SSH key en GitHub (si no lo has hecho)
ssh-keygen -t ed25519 -C "tu-email@example.com"
cat ~/.ssh/id_ed25519.pub  # Copiar y añadir en GitHub Settings > SSH Keys

# Cambiar remote a SSH
cd /root/pokemon-game-mcp
git remote set-url origin git@github.com:DoubleN96/pokemon-game-mcp.git

# Push
git push -u origin main
```

### Opción 2: Usando GitHub CLI

```bash
# Instalar gh si no está instalado
sudo apt install gh

# Autenticar
gh auth login

# Push
cd /root/pokemon-game-mcp
git push -u origin main
```

### Opción 3: Usando Personal Access Token

```bash
# Crear token en: https://github.com/settings/tokens
# Con permisos: repo (todos)

# Push con token
cd /root/pokemon-game-mcp
git remote set-url origin https://DoubleN96:YOUR_TOKEN@github.com/DoubleN96/pokemon-game-mcp.git
git push -u origin main
```

## Estado Actual

✅ Repositorio creado en GitHub
✅ Código completo y compilado localmente
✅ 2 commits listos para push:
- `feat: initialize pokemon-game-mcp server`
- `feat(tools): implement core Pokemon game creation tools`

⏳ **Pendiente**: Subir código a GitHub (requiere autenticación)

## Archivos listos para subir

### Configuración
- `package.json` - Configuración npm
- `tsconfig.json` - Configuración TypeScript
- `.gitignore` - Archivos ignorados
- `.prettierrc` - Formato de código
- `.eslintrc.json` - Linting
- `README.md` - Documentación completa

### Código fuente (src/)
- `index.ts` - Servidor MCP principal
- `types/` - Definiciones de tipos
  - `creature.ts` - Tipos de criaturas
  - `rpgmaker.ts` - Tipos de RPG Maker MZ
  - `index.ts` - Exports
- `utils/` - Utilidades
  - `logger.ts` - Sistema de logging
  - `file-system.ts` - Manejo de archivos
  - `rpgmaker.ts` - Utilidades de RPG Maker
- `bridges/` - Adaptadores
  - `essentials-adapter.ts` - Fórmulas de Pokémon Essentials
- `tools/pokemon/` - Herramientas MCP
  - `create-creature.ts` - Crear criaturas
  - `catch-system.ts` - Sistema de captura
  - `index.ts` - Exports

## Herramientas Implementadas

### 1. create_creature
Crea una nueva criatura con:
- Stats base (HP, Attack, Defense, Sp.Attack, Sp.Defense, Speed)
- Tipos (1 o 2)
- Catch rate
- EXP yield
- Movimientos aprendibles
- Evoluciones
- Integración con RPG Maker MZ (Enemies.json)

### 2. implement_catch_system
Implementa sistema de captura con:
- Items de captura (Criaball, Super Criaball, etc.)
- Fórmula auténtica de Pokémon (Gen 3+)
- Plugin de RPG Maker MZ (Pokemon_CatchSystem.js)
- Configuración JSON

### 3. Adaptador de Pokémon Essentials
Fórmulas implementadas:
- Cálculo de daño
- Efectividad de tipos (18 tipos)
- Tasa de captura
- Cálculo de stats (con IVs y EVs)
- Generación de stats balanceados por tier

## Próximos pasos

1. **Subir código a GitHub** usando una de las opciones arriba
2. **Publicar en npm** (opcional):
   ```bash
   npm publish
   ```
3. **Implementar herramientas adicionales**:
   - generate_creature_set (con Gemini API)
   - create_map tool
   - add_trainer tool
   - battle_system tool

4. **Testing**:
   - Crear proyecto de prueba en RPG Maker MZ
   - Testear creación de criaturas
   - Testear sistema de captura
   - Validar funcionamiento del plugin

5. **Desplegar juego de prueba en Coolify** desde GitHub

## API Keys necesarias

Para usar todas las funcionalidades:

```bash
# Gemini (para generación de sprites)
export GEMINI_API_KEY=AIzaSyCRsoC263QtM0nHWl1747JF6MDm3YDg6dI

# Configurar en Claude Desktop
{
  "mcpServers": {
    "pokemon-game-mcp": {
      "command": "node",
      "args": ["/root/pokemon-game-mcp/dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "AIzaSyCRsoC263QtM0nHWl1747JF6MDm3YDg6dI"
      }
    }
  }
}
```

## Testing local

```bash
cd /root/pokemon-game-mcp
npm run build
node dist/index.js
```

---

**Creado por**: Stratomai
**Repositorio**: https://github.com/DoubleN96/pokemon-game-mcp
**Licencia**: MIT
