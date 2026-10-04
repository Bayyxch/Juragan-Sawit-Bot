import type { Command } from '../types/command.js';
import { claimDaily } from '../services/economy.service.js';
import { config } from '../config/env.js';
import { formatNumber } from '../utils/format.js';
import { errorEmbed, successEmbed } from '../utils/embed.js';
import { friendlyError } from '../utils/errors.js';

export const dailyCommand: Command = {
  name: 'daily',
  description: 'Ambil reward harian.',
  usage: '!daily',
  cooldownMs: 2000,
  async execute({ message, userId }) {
    try {
      const result = claimDaily(userId);
      await message.reply({ embeds: [successEmbed(`${config.emoji.coin} Daily`, `Reward: +${formatNumber(result.reward)} SawitCoin\nSaldo: ${formatNumber(result.balance)}`)] });
    } catch (error) {
      await message.reply({ embeds: [errorEmbed('Daily belum tersedia', friendlyError(error))] });
    }
  },
};
