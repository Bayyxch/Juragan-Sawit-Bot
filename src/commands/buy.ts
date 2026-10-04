import type { Command } from '../types/command.js';
import { buyItem } from '../services/economy.service.js';
import { config } from '../config/env.js';
import { formatNumber } from '../utils/format.js';
import { parseQuantity } from '../utils/command-args.js';
import { successEmbed, errorEmbed } from '../utils/embed.js';
import { friendlyError } from '../utils/errors.js';

export const buyCommand: Command = {
  name: 'buy',
  aliases: ['beli'],
  description: 'Beli item dari shop.',
  usage: '!buy <item> <jumlah>',
  cooldownMs: 1500,
  async execute({ message, userId, args }) {
    const parsed = parseQuantity(args, 'seed_basic');
    if (!parsed) {
      await message.reply({ embeds: [errorEmbed('Format salah', 'Contoh: `!buy seed_basic 4`')] });
      return;
    }
    try {
      const result = buyItem(userId, parsed.item, parsed.quantity);
      await message.reply({ embeds: [successEmbed(`${config.emoji.success} Pembelian berhasil`, `${result.item.name} x${formatNumber(parsed.quantity)}\nTotal: ${formatNumber(result.total)} SawitCoin\nSaldo: ${formatNumber(result.balance)}`)] });
    } catch (error) {
      await message.reply({ embeds: [errorEmbed('Pembelian gagal', friendlyError(error))] });
    }
  },
};
