import { Message } from 'discord.js';

import i18next from '../plugins/i18next';
import diceService from '../services/dice';
import { Command } from '../types';

export const roll: Command = {
  name: 'roll',

  description: 'Roll one or more dice',

  async execute(message: Message, [arg]: string[]): Promise<void> {
    await message.delete();

    const respond = (response: string) => message.channel.send(`${message.author} ${response}`);

    if (!arg.match(diceService.regex)) {
      await message.channel.send(`${i18next.t('arg_syntax_error', { example: 'd4, 3d20+4, d12-2' })}`);

      return;
    }

    const { number, type, modifier } = diceService.parseDiceArg(arg);

    if (!diceService.types.includes(type)) {
      await message.channel.send(`${i18next.t('dice_not_supported', { type })}`);

      return;
    }

    const modifierText = modifier ? (modifier > 0 ? `+${modifier}` : modifier) : '';

    if (number) {
      const { rolls, rollsTotal } = diceService.multipleRoll(type, number, modifier);
      const response: string = i18next.t('dice_roll', {
        count: number,
        modifierText,
        number,
        roll: rolls.join(', '),
        rollsTotal,
        type,
      });

      await respond(response);
    } else {
      const roll = diceService.roll(type, modifier);
      const response: string = i18next.t('dice_roll', { count: 1, modifierText, roll, type });

      await respond(response);
    }
  },
};
