import {join} from 'path';

export {config} from './config';
import {config} from './config';
import * as Discord from 'discord.js';
import * as rp from 'request-promise-native';
import * as Database from 'better-sqlite3';
import {CommandoGuild} from 'discord.js-commando';

export const db = new Database(join(__dirname, '..', 'settings.sqlite3'));

export const genEmbed = (title: string, desc: string): Discord.MessageEmbed =>
	new Discord.MessageEmbed()
		.setTitle(title)
		.setAuthor(
			'Another Bot',
			'https://willb.info/images/2018/06/05/3d6d829d1cb595eccf43eca5638f2883.png'
		)
		.setDescription(desc)
		.setFooter(
			'By Willyb321',
			'https://willb.info/images/2018/06/05/3d6d829d1cb595eccf43eca5638f2883.png'
		)
		.setTimestamp();

export const botLog = async (message: string, guild: CommandoGuild) => {
	const logChannelID = guild.settings.get('botLogChannelID', '');
	const logChannel = guild.channels.get(logChannelID) as Discord.TextChannel;
	if (!logChannelID || !logChannel) {
		return;
	}
	return await logChannel.send(message);
};

export function writeLog(message: string, prefix?: string) {
	if (!prefix) {
		prefix = '[Debug]'; // By default put [Debug] in front of the message
	}
	console.info(`${prefix}: `, message);
}

export async function getEdsmApiResult(page, log?) {
	// Query EDSM's api for something
	writeLog(
		`Retrieving EDSM APIv1 results: https://www.edsm.net/api-v1/${page}`,
		'HTTP'
	);
	let body;
	try {
		body = await rp({
			url: !log
				? 'https://www.edsm.net/api-v1/' + page
				: 'https://www.edsm.net/api-logs-v1/' + page,
			headers: {
				'user-agent': config.botName
			},
			json: true,
			timeout: 30000
		});
	} catch (error) {
		console.error(error);
	}
	if (body === undefined) {
		writeLog('Error retrieving EDSM APIv1 result!', 'HTTP');
		console.error('Error retrieving EDSM APIv1 results!');
		return null;
	}
	return body;
}

export async function getInformationAboutSystem(input) {
	// Query EDSM for the details about a system
	const returnedEmbedObject = genEmbed('Error!', ':x: No systems found.');
	const systeminfo = await getEdsmApiResult(
		`system?showId=1&showCoordinates=1&showPermit=1&showInformation=1&systemName=${encodeURIComponent(
			input
		)}`
	);
	writeLog(`Got EDSM Info for ${input.toString()}`, 'EDSM SysInfo');
	if (systeminfo && systeminfo.name) {
		writeLog(`Info for ${input.toString()} looks OK.`, 'EDSM SysInfo');

		returnedEmbedObject.setTitle(
			`System Information for __${systeminfo.name}__`
		);

		returnedEmbedObject.setDescription(
			`EDSM:  *<https://www.edsm.net/en/system/id/${
				systeminfo.id
			}/name/${encodeURIComponent(systeminfo.name)}>*`
		);
		if (systeminfo.information.eddbId) {
			returnedEmbedObject.addField(
				'EDDB',
				`*<https://eddb.io/system/${systeminfo.information.eddbId}>*`
			);
		}
		if (systeminfo.information.faction !== undefined) {
			returnedEmbedObject.addField(
				'__Controlled by__',
				`${systeminfo.information.faction}, a ${systeminfo.information
					.allegiance || 'unknown'}-aligned  ${systeminfo.information
					.government || ''} faction.`
			);
		}

		if (systeminfo.information.factionState) {
			returnedEmbedObject.addField(
				'__State__',
				systeminfo.information.factionState
			);
		}
		if (systeminfo.information.population) {
			returnedEmbedObject.addField(
				'__Population__',
				systeminfo.information.population
			);
		}
		if (systeminfo.information.security) {
			returnedEmbedObject.addField(
				'__Security__',
				systeminfo.information.security
			);
		}
		if (systeminfo.information.economy) {
			returnedEmbedObject.addField(
				'__Economy__',
				systeminfo.information.economy
			);
		}
		return returnedEmbedObject;
		/*return getEdsmApiResult(`get-comment?systemId=${encodeURIComponent(systeminfo.id)}&apiKey=${config.edsmKey}&commanderName=ctmbot`).then(comment => {
				if (comment && comment.comment) {
					consola.info(comment);
					returnedEmbedObject.addField('__CTM Comment__', comment.comment);
				}
			});*/
	}
}
