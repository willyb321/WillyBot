/**
 * @module Index
 */
/**
 * ignore
 */
// Import modules
import 'source-map-support/register';
import * as Commando from 'discord.js-commando';
import {config, db} from './utils';
import {join} from 'path';
import {oneLine} from 'common-tags';
import { TextChannel } from 'discord.js';

process.on('uncaughtException', (err: Error) => {
	console.error(err);
});

process.on('unhandledRejection', (err: Error) => {
	console.error(err);
});

// Create an instance of a Discord client
export const client: Commando.CommandoClient = new Commando.Client({
	owner: config.ownerID,
	commandPrefix: '?',
	unknownCommandResponse: false
});

client
	.on('error', console.error)
	.on(
		'debug',
		process.env.NODE_ENV === 'development' ? console.info : () => {
		}
	)
	.on('warn', console.warn)
	.on('disconnect', () => console.warn('Disconnected!'))
	.on('reconnecting', () => console.warn('Reconnecting...'))
	.on(
		'commandError',
		(cmd: Commando.Command, err: Error | Commando.FriendlyError) => {
			if (err instanceof Commando.FriendlyError) {
				return;
			}
			console.error(
				`Error in command ${cmd.groupID}:${cmd.memberName}`,
				err
			);
		}
	)
	.on('commandBlocked', (msg: Commando.CommandoMessage, reason: string) => {
		console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
	})
	.on(
		'commandPrefixChange',
		(guild: Commando.CommandoGuild, prefix: string) => {
			console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
		}
	)
	.on(
		'commandStatusChange',
		(
			guild: Commando.CommandoGuild,
			command: Commando.Command,
			enabled: boolean
		) => {
			console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
		}
	)
	.on(
		'groupStatusChange',
		(
			guild: Commando.CommandoGuild,
			group: Commando.CommandGroup,
			enabled: boolean
		) => {
			console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
		}
	);


client
	.setProvider(
		new Commando.SyncSQLiteProvider(db))
	.catch((err: Error) => {
		console.error(err);
	});

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
	console.log(
		`Client ready; logged in as ${client.user.username}#${
			client.user.discriminator
			} (${client.user.id})`
	);
	client.user
		.setActivity('Some sort of bot-like activity')
		.catch((err: Error) => {
			console.error(err);
		});
});

client.registry
	.registerGroup('misc', 'Misc')
	.registerGroup('admin', 'Admin')
	.registerGroup('elite', 'Elite')
	.registerDefaults()
	.registerCommandsIn(join(__dirname, 'commands'))
	.registerCommandsIn(join(__dirname, 'commands', 'admin'))
	.registerCommandsIn(join(__dirname, 'commands', 'elite'))
	.registerCommandsIn(join(__dirname, 'commands', 'misc'));

// Log our bot in
client.login(config.token).catch((err: Error) => {
	console.error(err);
	process.exit(1);
});


client.on('guildMemberAdd',member => {
	console.log(`Welcome to ${member.guild.name}, ${member.user.tag}`);
	if (!client.provider.get(member.guild, 'botSpamJoin', false)) {
		return;
	}
	let msg = client.provider.get(member.guild, 'botSpamJoinMsg', '$USER joined $SERVER');
	msg = msg.replace('$USER', member.toString());
	msg = msg.replace('$SERVER', member.guild.name);
	const channel = client.provider.get(member.guild, 'botSpam');
	const lookup = client.provider.get(member.guild, 'botSpamInara', false);
	if (channel) {
		const chan = member.guild.channels.get(channel) as TextChannel;
		if (chan) {
			chan.send(msg, {disableEveryone: true});
			if (!lookup) {
				return;
			}
			// return getCmdrInfoFromInara(member.displayName).then(embeddedObject => {
			// 	if (embeddedObject instanceof Commando.FriendlyError) {
			// 		return chan.send(embeddedObject.message);
			// 	}
			// 	return chan.send({embed: embeddedObject});
			// });
		}
	}
});

client.on('guildMemberRemove',member => {
	console.log(`\`${member.user.tag}\` left ${member.guild.name}`);
	if (!client.provider.get(member.guild, 'botSpamLeave', false)) {
		return;
	}
	let msg = client.provider.get(member.guild, 'botSpamLeaveMsg', '$USER left $SERVER');
	msg = msg.replace('$USER', member.user.tag);
	msg = msg.replace('$SERVER', member.guild.name);
	const channel = client.provider.get(member.guild, 'botSpam');
	if (channel) {
		const chan = member.guild.channels.get(channel) as TextChannel;
		if (chan) {
			return chan.send(msg, {disableEveryone: true});
		}
	}
});
