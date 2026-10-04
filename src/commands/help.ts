import type { Command } from '../types/command.js';
import { config } from '../config/env.js';
import { infoEmbed } from '../utils/embed.js';

export function createHelpCommand(commands: Command[]): Command {
  return {
    name: 'help',
    aliases: ['h'],
    description: 'Lihat command yang tersedia.',
    usage: '!help',
    async execute({ message }) {
      const unique = commands.filter((command) => command.name !== 'help');
      const lines = unique.map((command) => `\`${config.prefix}${command.name}\` — ${command.description}`);
      const description = [
        'Core loop: tanam → panen → jual → luas.',
        '',
        ...lines,
        '',
        `Contoh: \`${config.prefix}buy seed_basic 4\``,
      ].join('\n');
      await message.reply({ embeds: [infoEmbed(`${config.emoji.palm} Bot Sawit`, description)] });
    },
  };
}
