import type { Command } from '../types/command.js';
import { config } from '../config/env.js';
import { getInventory } from '../services/economy.service.js';
import { formatNumber } from '../utils/format.js';
import { infoEmbed } from '../utils/embed.js';

export const inventoryCommand: Command = {
  name: 'inventory',
  aliases: ['inv'],
  description: 'Lihat isi inventory.',
  usage: '!inventory',
  async execute({ message, userId }) {
    const items = getInventory(userId);
    const lines = items.length
      ? items.map((item) => `**${item.name}** — ${formatNumber(item.quantity)}`)
      : ['Inventory masih kosong.'];
    await message.reply({ embeds: [infoEmbed(`${config.emoji.seed} Inventory`, lines.join('\n'))] });
  },
};
