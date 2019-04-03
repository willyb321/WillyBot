/**
 * @module Commands
 */
/**
 * ignore
 */
import {genEmbed} from '../../utils';
import * as Commando from 'discord.js-commando';

export class CreateGameCommand extends Commando.Command {
	constructor(client: Commando.Client) {
		super(client, {
			name: 'creategame',
			group: 'selfmod',
			memberName: 'creategame',
			description: 'Create a game channel and role.',
			details: 'Create a game channel and role.',
			examples: ['creategame Division 2'],
			guildOnly: true,
			args: [
				{
					label: 'Game Name',
					key: 'name',
					prompt: 'Game name?',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg: Commando.CommandoMessage) {
		return message.client.isOwner(message.author);
	}

	async run(msg: Commando.CommandoMessage, args: any) {
		const name = `game-${args.name.replace('game-', '')}`;
		let role = msg.guild.roles.find(e => e.name.toLowerCase() === name.toLowerCase());
		if (role) {
			return msg.reply('Game already exists');
		}

	}
}
