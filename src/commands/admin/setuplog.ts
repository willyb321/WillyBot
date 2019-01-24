import { botLog } from './../../utils';
/**
 * @module Commands
 */
/**
 * ignore
 */
import * as Commando from 'discord.js-commando';
import {GuildChannel, Permissions} from "discord.js";


export class SetupLogCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'setuplog',
			group: 'admin',
			memberName: 'setuplog',
			description: 'Set up a logging channel.',
			details: 'Set up a logging channel.',
			guildOnly: true,
			examples: ['setuplog #bot-log'],
			args: [
				{
					label: 'channel',
					key: 'channel',
					type: 'channel',
					prompt: 'Channel to log to?'
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
		const botLogID = args.channel.id;
		await message.guild.settings.set('botLogChannelID', botLogID);
		return botLog(`Now logging in this channel`, message.guild);
	}
}
