#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { logger } from './utils/logger.js';

// TODO: Importar herramientas cuando las implementemos
// import { tools as pokemonTools } from './tools/pokemon/index.js';
// import { tools as rpgmakerTools } from './tools/rpgmaker/index.js';

/**
 * Pokémon Game MCP Server
 *
 * Servidor MCP para crear juegos estilo Pokémon en RPG Maker MZ
 * utilizando IA para generar criaturas, mecánicas y contenido.
 */
class PokemonGameMCPServer {
  private server: Server;
  private tools: Map<string, Tool>;

  constructor() {
    this.server = new Server(
      {
        name: 'pokemon-game-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.tools = new Map();
    this.setupHandlers();
    this.registerTools();
  }

  private setupHandlers() {
    // Handler para listar herramientas disponibles
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      logger.debug('Listing available tools');
      return {
        tools: Array.from(this.tools.values()).map((tool) => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        })),
      };
    });

    // Handler para ejecutar herramientas
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      logger.info(`Executing tool: ${name}`);

      const tool = this.tools.get(name);
      if (!tool) {
        throw new Error(`Tool not found: ${name}`);
      }

      try {
        const result = await tool.execute(args ?? {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        logger.error(`Error executing tool ${name}:`, error);
        throw error;
      }
    });

    // Manejo de errores
    this.server.onerror = (error) => {
      logger.error('Server error:', error);
    };

    // Manejo de cierre
    process.on('SIGINT', async () => {
      logger.info('Shutting down server...');
      await this.server.close();
      process.exit(0);
    });
  }

  private registerTools() {
    // TODO: Registrar herramientas aquí cuando las implementemos
    // Por ahora, registramos una herramienta de prueba
    this.registerTool({
      name: 'test',
      description: 'Test tool to verify MCP server is working',
      inputSchema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Test message',
          },
        },
        required: ['message'],
      },
      execute: async (args: Record<string, unknown>) => {
        const message = args.message as string;
        return {
          success: true,
          message: `Echo: ${message}`,
          server: 'pokemon-game-mcp v1.0.0',
        };
      },
    });

    logger.info(`Registered ${this.tools.size} tools`);
  }

  private registerTool(tool: Tool) {
    this.tools.set(tool.name, tool);
    logger.debug(`Registered tool: ${tool.name}`);
  }

  async start() {
    logger.info('Starting Pokémon Game MCP Server...');
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info('Server started successfully');
  }
}

/**
 * Interfaz para definir una herramienta del MCP
 */
interface Tool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
  execute: (args: Record<string, unknown>) => Promise<unknown>;
}

// Iniciar el servidor
const server = new PokemonGameMCPServer();
server.start().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
