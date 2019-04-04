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
		return msg.client.isOwner(msg.author);
	}

	async run(msg: Commando.CommandoMessage, args: any) {
		const roleName = `game-${args.name.replace('game-', '')}`;
		const channelName = `${args.name.replace('game-', '')}`;
		let role: any = msg.guild.roles.find(e => e.name.toLowerCase() === roleName.toLowerCase());
		let channel: any = msg.guild.channels.find(e => e.name.toLowerCase() === channelName.toLowerCase());
		if (role && channel) {
			return msg.reply('Game tag and channel already exists. Manually delete if needed.');
		}
		if (!role) {
			const roleData = {
				data: {
					name: roleName,
					permissions: 0,
					mentionable: false
				},
				reason: `Game requested by ${msg.author.tag} [${msg.author.id}]`
			};
			try {
				role = await msg.guild.roles.create(roleData);
			} catch (e) {
				console.error(e);
				return msg.reply('Failed! Check permissions');
			}
		}
		if (!channel) {
			const channelData: any = {
				type: 'text',
				name: channelName,
				parent: '563095678088380416',
				permissionOverwrites: [
					{
						id: role.id,
						allow: ['SEND_MESSAGES', 'READ_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ADD_REACTIONS', 'VIEW_CHANNEL']
					},
					{
						id: msg.guild.roles.first().id,
						deny: ['SEND_MESSAGES', 'READ_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ADD_REACTIONS', 'VIEW_CHANNEL']
					}
				],
				reason: `Game requested by ${msg.author.tag} [${msg.author.id}]`
			};
			try {
				channel = await msg.guild.channels.create(channelName, channelData);
			} catch (e) {
				console.error(e);
				return msg.reply('Failed! Check permissions');
			}
		}
		return msg.reply(`Game ${args.name} created ${channel.toString()}`);
	}
}
