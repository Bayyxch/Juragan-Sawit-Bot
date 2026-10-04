import type { Command } from '../types/command.js';
import { getShop } from '../services/economy.service.js';
import { config } from '../config/env.js';
import { formatNumber } from '../utils/format.js';
import { infoEmbed } from '../utils/embed.js';

export const shopCommand: Command = {
  name: 'shop',
  description: 'Lihat item yang bisa dibeli.',
  usage: '!shop',
  async execute({ message }) {
    const items = getShop();
    const lines = items.map((item) => `\`${item.id}\` — ${item.name}\n${formatNumber(item.buy_price)} SawitCoin — ${item.description}`);
    await message.reply({ embeds: [infoEmbed(`${config.emoji.coin} Shop`, lines.join('\n\n'))] });
  },
};
