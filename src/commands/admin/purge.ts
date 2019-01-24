/**
 * @module Commands
 */
/**
 * ignore
 */
import {config} from '../../utils';
import * as Commando from 'discord.js-commando';
import { Permissions } from 'discord.js';
import {client} from '../../index';


export class PurgeCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'purge',
			group: 'admin',
			memberName: 'purge',
			description: 'Purge messages.',
			guildOnly: true,
			details: 'Purge messages.',
			examples: ['purge 5'],

			args: [
				{
					key: 'amount',
					prompt: 'How many messages to purge?',
					type: 'integer',
					validate: (val: string) => parseInt(val) >= 1 && parseInt(val) < 25
				}
			]
		});
	}
	hasPermission(message: Commando.CommandoMessage) {
		if (!message.member) {
			return false;
		}
		return message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR);
	}
	async run(message: Commando.CommandoMessage, args) {

		let limit = args.amount;
		if (!limit) {
			return;
		}
		if (limit > 25) {
			limit = 25;
		}
		message.channel.messages.fetch({limit: limit + 1})
			.then(messages => message.channel.bulkDelete(messages))
			.catch(err => {
				console.error(err);
			});
		return null;
	}
}
