import {join} from 'path';

export {config} from './config';
import * as Discord from 'discord.js';
import * as Database from 'better-sqlite3';

export const db = new Database(join(__dirname, '..', 'settings.sqlite3'));

export const genEmbed = (title: string, desc: string): Discord.MessageEmbed => new Discord.MessageEmbed()
	.setTitle(title)
	.setAuthor('Another Bot', 'https://willb.info/images/2018/06/05/3d6d829d1cb595eccf43eca5638f2883.png')
	.setDescription(desc)
	.setFooter('By Willyb321', 'https://willb.info/images/2018/06/05/3d6d829d1cb595eccf43eca5638f2883.png')
	.setTimestamp();
