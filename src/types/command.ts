import type { Message } from 'discord.js';

export interface CommandContext {
  message: Message;
  userId: string;
  username: string;
  args: string[];
}

export interface Command {
  name: string;
  aliases?: string[];
  description: string;
  usage: string;
  cooldownMs?: number;
  execute: (ctx: CommandContext) => Promise<void>;
}
