import { Client, GatewayIntentBits } from 'discord.js';
import { config } from './config/env.js';
import { runMigrations, db } from './db/database.js';
import type { Command } from './types/command.js';
import { ensureUser } from './services/economy.service.js';
import { errorEmbed } from './utils/embed.js';
import { friendlyError } from './utils/errors.js';
import { logger } from './utils/logger.js';
import { balanceCommand } from './commands/balance.js';
import { inventoryCommand } from './commands/inventory.js';
import { shopCommand } from './commands/shop.js';
import { buyCommand } from './commands/buy.js';
import { sellCommand } from './commands/sell.js';
import { tanamCommand } from './commands/tanam.js';
import { panenCommand } from './commands/panen.js';
import { luasCommand } from './commands/luasin.js';
import { kebunCommand } from './commands/kebun.js';
import { dailyCommand } from './commands/daily.js';
import { workCommand } from './commands/work.js';
import { leaderboardCommand } from './commands/leaderboard.js';
import { statusCommand } from './commands/status.js';
import { economyCommand } from './commands/economy.js';
import { pingCommand } from './commands/ping.js';
import { createHelpCommand } from './commands/help.js';

runMigrations();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const baseCommands: Command[] = [
  pingCommand,
  balanceCommand,
  kebunCommand,
  statusCommand,
  economyCommand,
  inventoryCommand,
  shopCommand,
  buyCommand,
  sellCommand,
  tanamCommand,
  panenCommand,
  luasCommand,
  dailyCommand,
  workCommand,
  leaderboardCommand,
];

const commands: Command[] = [createHelpCommand(baseCommands), ...baseCommands];
const commandMap = new Map<string, Command>();
for (const command of commands) {
  commandMap.set(command.name, command);
  for (const alias of command.aliases ?? []) commandMap.set(alias, command);
}

const cooldowns = new Map<string, number>();

const cooldownCleanup = setInterval(() => {
  const timestamp = Date.now();
  for (const [key, availableAt] of cooldowns) {
    if (availableAt <= timestamp) cooldowns.delete(key);
  }
}, 10 * 60 * 1000);

client.once('ready', () => {
  logger.info(`Logged in as ${client.user?.tag ?? 'unknown'} in ${client.guilds.cache.size} guild(s).`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const content = message.content.trim();
  if (!content.startsWith(config.prefix)) return;

  const body = content.slice(config.prefix.length).trim();
  if (!body) return;

  const parts = body.split(/\s+/);
  const commandName = parts.shift()?.toLowerCase();
  if (!commandName) return;

  const command = commandMap.get(commandName);
  if (!command) return;

  const key = `${message.author.id}:${command.name}`;
  const lastUsed = cooldowns.get(key) ?? 0;
  const cooldownMs = command.cooldownMs ?? 0;
  const availableAt = lastUsed + cooldownMs;
  if (cooldownMs > 0 && availableAt > Date.now()) {
    const remaining = Math.ceil((availableAt - Date.now()) / 1000);
    await message.reply({ embeds: [errorEmbed('Tunggu dulu', `Command ini bisa dipakai lagi dalam ${remaining} detik.`)] });
    return;
  }

  cooldowns.set(key, Date.now());

  try {
    ensureUser(message.author.id, message.author.username);
    await command.execute({
      message,
      userId: message.author.id,
      username: message.author.username,
      args: parts,
    });
  } catch (error) {
    logger.error(`Command ${command.name} failed for ${message.author.id}`, error);
    await message.reply({ embeds: [errorEmbed('Terjadi error', friendlyError(error))] }).catch(() => undefined);
  }
});

process.on('SIGINT', () => {
  logger.info('Shutting down...');
  client.destroy();
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Shutting down...');
  client.destroy();
  db.close();
  process.exit(0);
});

client.login(config.token).catch((error) => {
  logger.error('Discord login failed. Check DISCORD_TOKEN and bot configuration.', error);
  db.close();
  process.exitCode = 1;
});
