/**
 * @module Commands
 */
/**
 * ignore
 */
import * as Commando from 'discord.js-commando';
import {GuildChannel, Permissions, Role} from "discord.js";
import { botLog } from '../../utils';
const timestring = require('timestring')


export class MuteCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'mute',
			group: 'misc',
			memberName: 'mute',
			description: 'Mute someone.',
			details: 'Mute someone.',
			guildOnly: true,
			examples: ['mute @willyb321#2816 10'],
			args: [
				{
					label: 'user',
					key: 'user',
					type: 'member',
					prompt: 'Member to mute? (@ mention them)'
				},
				{
					label: 'time',
					key: 'time',
					type: 'string',
					prompt: 'Time to mute for? (eg 1x'
				}
			]
		});
	}

	hasPermission(message: Commando.CommandoMessage) {
		return message.client.isOwner(message.author);
	}

	async run(message: Commando.CommandoMessage, args: any) {
		let mutedRole: Role;
		let mutedRoleId = message.guild.settings.get('muteRole', '');
		try {
			mutedRole = message.guild.roles.get(mutedRoleId);
		} catch(err) {
			console.error(err);
		}
		if (args.user.roles.get(mutedRoleId)) {
			return;
		}
		if (!mutedRole) {
			return;
		}
		const time = timestring(args.time, 'ms');
		return args.user.roles.add(mutedRole, `Manual mute requested by ${message.author.tag}`)
			.then(() => {
				botLog(`Muting ${args.user.toString()} for ${timestring(args.time, 'm')}mins`, message.guild);
				setTimeout(() => {
					args.user.roles.remove(mutedRole, `Manual mute requested by ${message.author.tag} finished after ${timestring(args.time, 'm')}mins`)
						.then(() => {
							console.log(`Unmuted ${args.user.id}`);
							botLog(`Unmuting ${args.user.toString()}`, message.guild);
						})
						.catch(err => {
							console.error(err);
						});
				}, time);
				return message.channel.send(`Muting ${args.user.toString()} for ${timestring(args.time, 'm')}mins`)
			})
			.catch(err => {
				console.error(err);
				return botLog(`Muting ${args.user.toString()} failed`, message.guild);
			});
		}
}
