/**
 * @module Commands
 */
/**
 * ignore
 */
import {genEmbed} from '../../utils';
import * as Commando from 'discord.js-commando';
import * as rp from 'request-promise-native';

export class PimgCommand extends Commando.Command {
	constructor(client: Commando.Client) {
		super(client, {
			name: 'pimg',
			group: 'nsfw',
			memberName: 'pimg',
			description: 'Get an image from a pr0n tag.',
			details: 'Get an image from a pr0n tag.',
			examples: ['pimg <query>'],
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
		if (message && message.channel && message.channel) {

		}
		return true;
	}

	async run(message: Commando.CommandoMessage, args: any) {
		const tag = args.tag;
		// const searcher = new Pornsearch(tag);
		// const res = await searhcher.gifs();
		// console.log(res);
		// const json = res
		// if (!json[0]) {
		// 	return message.channel.send('No results found.');
		// }
		// const embed = genEmbed(`${message.author.tag} r34 request:`, `Tag: ${tag}`)
		// 	.setImage(json[0].file_url)
		// 	.setURL(`https://e621.net/post/show/${json[0].id}`);
		return message.channel.send('');
	}
}
