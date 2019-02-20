/**
 * @module Commands
 */
/**
 * ignore
 */
import {genEmbed} from '../../utils';
import * as Commando from 'discord.js-commando';
import * as rp from 'request-promise-native';

export class Rule34Command extends Commando.Command {
	constructor(client: Commando.Client) {
		super(client, {
			name: 'rule34',
			group: 'nsfw',
			memberName: 'rule34',
			description: 'Get an image from a rule34 tag.',
			details: 'Get an image from a rule34 tag.',
			examples: ['rule34 <query>'],
			guildOnly: true,
			args: [
				{
					label: 'tag',
					key: 'tag',
					type: 'string',
					prompt: 'Tag to search?'
				}
			]
		});
	}

	hasPermission(message: Commando.CommandoMessage) {
		return true;
	}

	async run(message: Commando.CommandoMessage, args: any) {
		const tag = args.tag;
		const url = `https://e621.net/post/index.json`;
		const res = await rp({
			url,
			method: 'GET',
			body: {
				limit: 1,
				tags: `${tag} order:random`
			}
		});

		return message.channel.send('Coming Soon!');
	}
}
