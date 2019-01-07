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
	.registerDefaults()
	.registerCommandsIn(join(__dirname, 'commands'))
	.registerCommandsIn(join(__dirname, 'commands', 'admin'))
	.registerCommandsIn(join(__dirname, 'commands', 'misc'));

// Log our bot in
client.login(config.token).catch((err: Error) => {
	console.error(err);
	process.exit(1);
});
