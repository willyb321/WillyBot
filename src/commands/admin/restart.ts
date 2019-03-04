/**
 * @module Commands
 */
/**
 * ignore
 */
import {config} from '../../utils';
import {client} from '../../index';

import * as Commando from 'discord.js-commando';

export class RestartCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'restart',
			group: 'misc',
			memberName: 'restart',
			description: 'restart.',
			details: 'restart.',
			examples: ['restart']
		});
	}
	hasPermission(message: Commando.CommandMessage) {
		return message.client.isOwner(message.author);
	}
	async run(message: Commando.CommandMessage) {
		console.log('Restarting');
		await message.channel.send(':wave:');
		client.destroy();
		return process.exit(0);
	}
}
