import { Client as DiscordClient, Collection, GatewayIntentBits } from 'discord.js';

import { Command } from './types/index.js';
import * as commands from './commands/index.js';

export default class Client extends DiscordClient {
  public commands: Collection<string, Command>;

  constructor() {
    super({
      intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
    });

    this.commands = new Collection();

    for (const command of Object.values(commands)) {
      this.commands.set(command.name, command);
    }
  }
}
