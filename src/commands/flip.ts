/**
 * @module Commands
 */
/**
 * ignore
 */
import {genEmbed} from '../utils';
import * as Commando from 'discord.js-commando';

/**
 * Coin flip
 */
const flip = (): string =>
	Math.floor(Math.random() * 2) == 0 ? 'heads' : 'tails';

export class FlipCommand extends Commando.Command {
	constructor(client: Commando.Client) {
		super(client, {
			name: 'flip',
			group: 'misc',
			memberName: 'flip',
			description: 'Flip a theoretical coin.',
			details: 'Flip a theoretical coin.',
			examples: ['flip'],
			guildOnly: true
		});
	}

	hasPermission(msg: Commando.CommandoMessage) {
		return true;
	}

	async run(msg: Commando.CommandoMessage) {
		const flipped = flip();
		console.log(`Coin flipped by ${msg.author.tag}: ${flipped}`);
		const embed = genEmbed('Coin Flipped', `Result: ${flipped}`);
		embed.addField('By:', msg.author.toString());
		return msg.channel.send({embed});
	}
}
