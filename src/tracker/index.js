const path = require('path'),
	fs = require('fs'),
	_ = require('lodash');
	request = require('request-promise-native'),
	generateEmbed = require('./generateTrackerEmbed.js'),
	generateAnimeBytesEmbed = require('./generateAnimeBytesEmbed.js'),
	utils = require('../utils');
	
const configPath = path.join(__dirname, '../../config.json'),
	cachePath = path.join(__dirname, '../../cache.json'),
	abCachePath = path.join(__dirname, '../../ab.cache.json');

const monitor = async client => {
	const config = utils.requireUncached(require, configPath),
		channel = client.channels.get(config.botNotificationBroadcastChannelID),
		guild = client.guilds.get(config.botNotificationGuildID);

	await request({ url: 'https://status.animebytes.tv/json', json: true }, (err, res, json) => {
		const previousCache = utils.requireUncached(require,abCachePath),
			channel = client.channels.get(config.botNotificationBroadcastChannelID);

		if(err) return;

		if(!json) return;

		if(utils.abInfoHasChanged(json, previousCache)) {
			const embedInfo = _.clone(json);

			if(channel) {
				const role = guild.roles.find(role => role.name == 'ab-notify'),
					embed = generateAnimeBytesEmbed(true, embedInfo);

				if(!role) {
					console.log(`Role ab-notify not found in guild.`);
					return;
				}

				channel.send(`**Paging** ${role.toString()}`, {
					embed
				});
			}
		}

		fs.writeFileSync(abCachePath, JSON.stringify(json), { encoding: 'utf8' });
	});

	await request({ url: 'https://trackerstatus.info/api/list/', json: true }, (err, res, json) => {
		const config = utils.requireUncached(require, configPath),
			previousCache = utils.requireUncached(require, cachePath);

		if(err) return;

		if(!json) return;

		Object.keys(json).forEach(tracker => {
			const trackerInfo = json[tracker],
				cachedTrackerInfo = previousCache[tracker];

			if(!tracker || !cachedTrackerInfo) return;

			if(utils.trackerInfoHasChanged(trackerInfo.Details, cachedTrackerInfo.Details)) {
				const embedInfo = _.clone(trackerInfo);

				if(channel) {
					const role = guild.roles.find(role => role.name == tracker + '-notify'),
						embed = generateEmbed(tracker, true, embedInfo);

					if(!role) {
						console.log(`Role ${tracker}-notify not found in guild.`);
						return;
					}

					channel.send(`**Paging** ${role.toString()}`, {
						embed	
					});
				}
			}
		});

		fs.writeFileSync(cachePath, JSON.stringify(json), { encoding: 'utf8' });
	});
};

module.exports = client => {
	const interval = 120000;
	setInterval(() => monitor(client), interval);
};
