import { EmbedBuilder } from 'discord.js';

const THEME = 0x3f6f44;
const WARNING = 0xb7791f;
const ERROR = 0x9b2c2c;

export function successEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder().setColor(THEME).setTitle(title).setDescription(description);
}

export function infoEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder().setColor(THEME).setTitle(title).setDescription(description);
}

export function warningEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder().setColor(WARNING).setTitle(title).setDescription(description);
}

export function errorEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder().setColor(ERROR).setTitle(title).setDescription(description);
}
