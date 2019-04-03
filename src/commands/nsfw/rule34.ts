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
			aliases: ['r34'],
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
		if (message && message.channel && message.channel) {

		}
		return true;
	}

	async run(message: Commando.CommandoMessage, args: any) {
		const tag = args.tag;
		const url = `https://e621.net/post/index.json`;
		const params = {
			limit: 1,
			tags: `${tag} order:random`
		};
		const esc = encodeURIComponent;
		const body = Object.keys(params)
			.map(k => esc(k) + '=' + esc(params[k]))
			.join('&');

		const res = await rp({
			url: url + '?' + body,
			method: 'GET',
			headers: {
				'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36'
			}
		});
		const json = JSON.parse(res);
		if (!json[0]) {
			return message.channel.send('No results found.');
		}
		const embed = genEmbed(`${message.author.tag} r34 request:`, `Tag: ${tag}`)
			.setImage(json[0].file_url)
			.setURL(`https://e621.net/post/show/${json[0].id}`);
		return message.channel.send({embed});
	}
}
