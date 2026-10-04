import type { Command } from '../types/command.js';
import { PermissionsBitField } from 'discord.js';
import { db } from '../db/database.js';
import { config } from '../config/env.js';
import { formatNumber } from '../utils/format.js';
import { errorEmbed, infoEmbed } from '../utils/embed.js';

interface EconomySnapshot {
  totalCurrency: number;
  faucet24h: number;
  sink24h: number;
  transactions24h: number;
  users: number;
}

function snapshot(): EconomySnapshot {
  const since = Date.now() - 24 * 60 * 60 * 1000;
  const totalCurrency = Number((db.prepare('SELECT COALESCE(SUM(balance), 0) AS total FROM wallets').get() as { total: number }).total);
  const faucet24h = Number((db.prepare('SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE created_at >= ? AND amount > 0').get(since) as { total: number }).total);
  const sink24h = Math.abs(Number((db.prepare('SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE created_at >= ? AND amount < 0').get(since) as { total: number }).total));
  const transactions24h = Number((db.prepare('SELECT COUNT(*) AS count FROM transactions WHERE created_at >= ?').get(since) as { count: number }).count);
  const users = Number((db.prepare('SELECT COUNT(*) AS count FROM users').get() as { count: number }).count);
  return { totalCurrency, faucet24h, sink24h, transactions24h, users };
}

export const economyCommand: Command = {
  name: 'economy',
  aliases: ['econ'],
  description: 'Lihat kesehatan economy. Khusus moderator.',
  usage: '!economy',
  cooldownMs: 5000,
  async execute({ message }) {
    if (!message.guild || !message.member?.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      await message.reply({ embeds: [errorEmbed('Akses ditolak', 'Command ini butuh permission **Manage Server**.')] });
      return;
    }

    const data = snapshot();
    const net = data.faucet24h - data.sink24h;
    const lines = [
      `${config.emoji.coin} Total currency: **${formatNumber(data.totalCurrency)}**`,
      `Faucet 24 jam: **+${formatNumber(data.faucet24h)}**`,
      `Sink 24 jam: **-${formatNumber(data.sink24h)}**`,
      `Net 24 jam: **${net >= 0 ? '+' : ''}${formatNumber(net)}**`,
      `Transaksi 24 jam: **${formatNumber(data.transactions24h)}**`,
      `Total akun: **${formatNumber(data.users)}**`,
    ];
    await message.reply({ embeds: [infoEmbed('Economy Health', lines.join('\n'))] });
  },
};
