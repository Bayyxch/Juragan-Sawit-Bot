import type { Command } from '../types/command.js';
import { config } from '../config/env.js';
import { getFarmPlots, getInventoryItem } from '../services/economy.service.js';
import { formatNumber } from '../utils/format.js';
import { infoEmbed } from '../utils/embed.js';

export const statusCommand: Command = {
  name: 'status',
  description: 'Alias singkat untuk ringkasan akun.',
  usage: '!status',
  async execute({ message, userId }) {
    const plots = getFarmPlots(userId);
    const planted = plots.filter((plot) => plot.crop_id !== null).length;
    const tbs = getInventoryItem(userId, 'tbs');
    const seeds = getInventoryItem(userId, 'seed_basic');
    await message.reply({ embeds: [infoEmbed(`${config.emoji.palm} Status`, `Lahan terisi: ${planted}/${plots.length}\n${config.emoji.seed} Bibit Basic: ${formatNumber(seeds)}\n${config.emoji.tbs} TBS: ${formatNumber(tbs)}`)] });
  },
};
