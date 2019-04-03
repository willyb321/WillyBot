/**
 * @module Commands
 */
/**
 * ignore
 */
import * as Commando from 'discord.js-commando';
import {GuildChannel, Permissions} from "discord.js";


export class SetupMuteCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'setmute',
			group: 'admin',
			memberName: 'setmute',
			description: 'Set up a mute role and permissions.',
			details: 'Set up a mute role and permissions.',
			guildOnly: true,
			examples: ['mute @willyb321#2816 10']
		});
	}

	hasPermission(message: Commando.CommandoMessage) {
		if (!message.member) {
			return false;
		}
		if (message.client.isOwner(message.author)) {
			return true;
		}
		return message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR);
	}

	async run(message: Commando.CommandoMessage) {
		const muteRoleId = await message.guild.settings.get('muteRole', '');
		console.log(muteRoleId)
		const perms = new Permissions();
		let muteRole = message.guild.roles.get(muteRoleId);
		const botPosition = message.guild.roles.highest.position;
		if (!muteRole) {
			try {
				muteRole = await message.guild.roles.create({
					data: {
						name: 'Muted',
						color: 'DARKER_GREY',
						permissions: perms,
						position: botPosition - 1,
						hoist: true,
						mentionable: false
					}
				});
				await message.guild.settings.set('muteRole', muteRole.id);
			} catch (err) {
				console.error(err);
				return message.channel.send('Failed to setup mute role.');
			}
		}

		for (let chan of message.guild.channels.array()) {
			chan = chan as GuildChannel;
			if (chan) {
				if (chan.permissionOverwrites && chan.permissionOverwrites.get(muteRole.id)) {
					await chan.permissionOverwrites.get(muteRole.id).delete(`Mute role setup requested by ${message.author.tag}`);
				}
				try {
					await chan.updateOverwrite(muteRole, {
						SEND_MESSAGES: false,
						CREATE_INSTANT_INVITE: false,
						KICK_MEMBERS: false,
						BAN_MEMBERS: false,
						SEND_TTS_MESSAGES: false,
						CHANGE_NICKNAME: false,
						ADD_REACTIONS: false,
						EMBED_LINKS: false,
						CONNECT: false,
						USE_EXTERNAL_EMOJIS: false,
						ATTACH_FILES: false,
						READ_MESSAGE_HISTORY: true
					}, `Mute role setup requested by ${message.author.tag}`);
				} catch (err) {
					console.error(err);
				}
			}
		}
		return message.channel.send(`Added mute role: ${muteRole.toString()}`);
	}
}
