import type { Command } from '../types/command.js';
import { config } from '../config/env.js';
import { getFarmPlots, getBalance } from '../services/economy.service.js';
import { formatDuration, formatNumber } from '../utils/format.js';
import { infoEmbed } from '../utils/embed.js';
import { db } from '../db/database.js';

export const kebunCommand: Command = {
  name: 'kebun',
  aliases: ['farm'],
  description: 'Lihat kondisi kebun lo.',
  usage: '!kebun',
  async execute({ message, userId }) {
    const plots = getFarmPlots(userId);
    const planted = plots.filter((plot) => plot.crop_id !== null).length;
    const ready = plots.filter((plot) => {
      if (plot.crop_id === null || plot.planted_at === null) return false;
      const crop = db.prepare('SELECT grow_seconds FROM crops WHERE id = ?').get(plot.crop_id) as { grow_seconds: number } | undefined;
      return crop ? Date.now() - plot.planted_at >= crop.grow_seconds * 1000 : false;
    }).length;
    const nextGrow = plots
      .filter((plot) => plot.crop_id !== null && plot.planted_at !== null)
      .map((plot) => {
        const crop = db.prepare('SELECT grow_seconds FROM crops WHERE id = ?').get(plot.crop_id) as { grow_seconds: number } | undefined;
        return crop && plot.planted_at !== null ? plot.planted_at + crop.grow_seconds * 1000 - Date.now() : Number.POSITIVE_INFINITY;
      })
      .filter((remaining) => remaining > 0)
      .sort((a, b) => a - b)[0];

    const lines = plots.map((plot) => {
      if (!plot.crop_id || plot.planted_at === null) return `#${plot.plot_index} — kosong`;
      const crop = db.prepare('SELECT name, grow_seconds FROM crops WHERE id = ?').get(plot.crop_id) as { name: string; grow_seconds: number } | undefined;
      if (!crop) return `#${plot.plot_index} — data tanaman rusak`;
      const remaining = plot.planted_at + crop.grow_seconds * 1000 - Date.now();
      return `#${plot.plot_index} — ${crop.name} — ${remaining <= 0 ? 'SIAP PANEN' : formatDuration(remaining)}`;
    });

    const inventoryTbs = db.prepare("SELECT quantity FROM inventory WHERE user_id = ? AND item_id = 'tbs'").get(userId) as { quantity: number } | undefined;
    const seeds = db.prepare("SELECT quantity FROM inventory WHERE user_id = ? AND item_id = 'seed_basic'").get(userId) as { quantity: number } | undefined;

    const summary = [
      `${config.emoji.coin} Saldo: **${formatNumber(getBalance(userId))}**`,
      `${config.emoji.land} Lahan: **${planted}/${plots.length}** terisi`,
      `${config.emoji.palm} Siap panen: **${ready}** plot`,
      `${config.emoji.seed} Bibit Basic: **${formatNumber(seeds?.quantity ?? 0)}**`,
      `${config.emoji.tbs} TBS: **${formatNumber(inventoryTbs?.quantity ?? 0)}**`,
      nextGrow ? `Panen terdekat: **${formatDuration(nextGrow)}**` : 'Panen terdekat: **belum ada tanaman aktif**',
      '',
      lines.join('\n'),
    ].join('\n');

    await message.reply({ embeds: [infoEmbed(`${config.emoji.palm} Kebun ${message.author.username}`, summary)] });
  },
};
