import type { Command } from '../types/command.js';
import { infoEmbed } from '../utils/embed.js';

export const pingCommand: Command = {
  name: 'ping',
  description: 'Cek apakah bot hidup.',
  usage: '!ping',
  async execute({ message }) {
    await message.reply({ embeds: [infoEmbed('Bot Sawit', `Pong. Latency: ${message.client.ws.ping}ms`)] });
  },
};
