/**
 * @module Utils
 */
/**
 * ignore
 */
const confToUse = '../config.json';

export const config: IConfig = require(confToUse);

export interface IConfig {
	token: string;
	ownerID: string[];
}
