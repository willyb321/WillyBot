/**
 * @module Commands
 */
/**
 * ignore
 */
import {genEmbed} from '../../utils';
import * as Commando from 'discord.js-commando';

export class OverclockCommand extends Commando.Command {
	constructor(client: Commando.Client) {
		super(client, {
			name: 'overclock',
			group: 'misc',
			memberName: 'overclock',
			description: 'Flip a theoretical coin.',
			aliases: ['oc'],
			details: 'Flip a theoretical coin.',
			examples: ['overclock'],
			guildOnly: true,
			args: [
				{
					label: 'multiplier',
					key: 'multiplier',
					type: 'integer',
					prompt: 'Multiplier? (8-70)',
					validate: val => val >= 8 && val <= 70
				},
				{
					label: 'vcore',
					key: 'vcore',
					type: 'float',
					prompt: 'VCore? (0.8-1.7)',
					validate: val => val >= 0.8 && val <= 1.7
				},
				{
					label: 'baseclock',
					key: 'baseclock',
					type: 'float',
					prompt: 'Base Clock? (95 - 105)',
					validate: val => val >= 95 && val <= 105
				}
			]
		});
	}

	hasPermission(msg: Commando.CommandoMessage) {
		return true;
	}

	async run(msg: Commando.CommandoMessage) {
		const blueScreenChance = 50;
		const blueScreen = Math.floor(Math.random() * 100) < blueScreenChance;
		if (blueScreen) {
			return msg.channel.send(`Bluescreen!`)
		} else {
			return msg.channel.send('Keep going!')
		}
	}
}
