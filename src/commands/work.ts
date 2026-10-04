import type { Command } from '../types/command.js';
import { work } from '../services/economy.service.js';
import { config } from '../config/env.js';
import { formatNumber } from '../utils/format.js';
import { errorEmbed, successEmbed } from '../utils/embed.js';
import { friendlyError } from '../utils/errors.js';

export const workCommand: Command = {
  name: 'work',
  description: 'Kerja sebentar untuk uang tambahan.',
  usage: '!work',
  cooldownMs: 2000,
  async execute({ message, userId }) {
    try {
      const result = work(userId);
      await message.reply({ embeds: [successEmbed(`${config.emoji.tool} Kerja selesai`, `Upah: +${formatNumber(result.reward)} SawitCoin\nSaldo: ${formatNumber(result.balance)}`)] });
    } catch (error) {
      await message.reply({ embeds: [errorEmbed('Belum bisa kerja', friendlyError(error))] });
    }
  },
};
