/**
 * @module Commands
 */
/**
 * ignore
 */
import {genEmbed, getEdsmApiResult} from '../../utils';
import * as Commando from 'discord.js-commando';
import * as moment from 'moment';
import * as mathjs from 'mathjs';

export class DistCommand extends Commando.Command {
	constructor(client: Commando.Client) {
		super(client, {
			name: 'dist',
			group: 'elite',
			memberName: 'dist',
			description: 'Get Distance between 2 systems.',
			details: 'Get Distance between 2 systems.',
			examples: ['dist Sol Colonia'],
			guildOnly: true,
			args: [
				{
					label: 'System 1',
					key: 'sys1',
					prompt: 'System 1?',
					type: 'string'
				},
				{
					label: 'System 2',
					key: 'sys2',
					prompt: 'System 2?',
					type: 'string'

				}
			]

		});
	}

	hasPermission(msg: Commando.CommandoMessage) {
		return true;
	}

	async run(msg: Commando.CommandoMessage, args: any) {
		const embed = genEmbed('Distance Between', `${args.sys1} & ${args.sys2}`);
		let seconds;
		const system1 = args.sys1;
		const system2 = args.sys2;
		let system1coords;
		let system2coords;
		try {
			const [system1info, system2info] = await Promise.all([
				getEdsmApiResult(`system?showCoordinates=1&systemName=${encodeURIComponent(system1)}`),
				getEdsmApiResult(`system?showCoordinates=1&systemName=${encodeURIComponent(system2)}`)
			]);
			console.log(system1info);
			console.log(system2info);
			if (!system2info || !system1info) {
				embed.setDescription(':x: Could not locate one of the systems!');
				return msg.channel.send({embed});
			}
			// writeLog(`Info for ${system1} looks OK`, 'EDSM SysDist');
			// writeLog(`Info for ${system2} looks OK, calculating distance`, 'EDSM SysDist');
			system1coords = [system1info.coords.x, system1info.coords.y, system1info.coords.z];
			system2coords = [system2info.coords.x, system2info.coords.y, system2info.coords.z];
			const distance = mathjs.distance(system1coords, system2coords).toFixed(2);
			seconds = distance * 9.75 + 300;
			const duration = moment.duration(seconds, 'seconds');
			embed.setTitle(`Distance between \`${system1}\` and \`${system2}\``);
			embed.setDescription(`**\`\`\`${distance} Ly\`\`\`**\n**Ship transfer time: \`${duration.humanize()}\`**`);

			// writeLog(`Distance between ${system1} and ${system2}: ${distance} Ly`, 'EDSM SysDist');
			return msg.channel.send({embed});

		} catch (err) {
			console.error(err);
		}

	}
}
