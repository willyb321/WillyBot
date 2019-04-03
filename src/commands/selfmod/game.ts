/**
 * @module Commands
 */
/**
 * ignore
 */
import {genEmbed} from '../../utils';
import * as Commando from 'discord.js-commando';
import {Role, Permissions} from 'discord.js';

export class GameCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'game',
			group: 'selfmod',
			memberName: 'game',
			description: 'Toggle a game tag.',
			details: 'Toggle a game tag.',
			examples: ['game borderlands', 'game'],
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10
			},

			args: [
				{
					key: 'tag',
					prompt: 'What game tag to add / remove?',
					default: '',
					type: 'string'
				}
			]
		});
	}

	async run(message: Commando.CommandoMessage, args: any) {
		if (!message || !message.member || !message.guild) {
			return
		}
		if (!args.tag) {
			let gameList = 'Current Game Tags:\n';
			message.guild.roles.forEach((elem: Role) => {
				if (elem.name.startsWith('game-') && elem.permissions.bitfield === 0) {
					gameList += elem.name.replace('game-', '') + '\n';
				}
			});
			return message.channel.send(gameList);
		}
		const currentRoles = message.member.roles;
		let newRoles = currentRoles;
		const validRoles = [];
		message.guild.roles.forEach((elem: Role) => {
			if (elem.name.startsWith('game-') && elem.permissions.bitfield === 0) {
				validRoles.push(elem);
			}
		});
		const role = validRoles.find(elem => elem.name.toLowerCase().replace('game-', '') === args.tag.toLowerCase());
		if (!role) {
			let gameList = [];
			validRoles.forEach((elem) => {
				if (elem.name.startsWith('game-') && elem.permissions.bitfield === 0) {
					gameList.push(elem.name.replace('game-', ''));
				}
			});
			return message.reply(`Can't find role ${args.tag}\nValid Choices:\n${gameList.join(', ')}`);
		}
		if (currentRoles.find(elem => elem.id === role.id)) {
			try {
				await newRoles.remove(role)
			} catch (e) {
				return await message.reply(`Error! Check permissions.`);
			}
			console.log(`Removing ${role.name} from ${message.author.tag}`);
			console.log('Done.');
			return message.reply(`${role.name} removed from ${message.author.tag}`);
		}
		try {
			await newRoles.add(role)
		} catch (e) {
			return await message.reply(`Error! Check permissions.`);
		}
		console.log(`Giving ${role.name} to ${message.author.tag}`);
		console.log('Done.');
		return await message.reply(`${role.name} added to ${message.author.tag}`);
	}
}
