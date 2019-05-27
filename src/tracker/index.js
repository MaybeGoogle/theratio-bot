const request = require('request-promise-native'),
	generateEmbed = require('./generateTrackerEmbed.js'),
	utils = require('../utils'),
	path = require('path'),
	fs = require('fs'),
	_ = require('lodash'),
	configPath = path.join(__dirname, '../../config.json'),
	cachePath = path.join(__dirname, '../../cache.json'),
	abCachePath = path.join(__dirname, '../../ab.cache.json');

const trackerInfoHasChanged = (info1, info2) => {
	if(info1.Website !== info2.Website) {
		return true;
	}
	if(info1.Tracker !== info2.Tracker) {
		return true;
	}
	return false;
};

const monitor = async client => {
	await request({ url: 'https://status.animebytes.tv/json', json: true }, (err, res, json) => {
		const config = utils.requireUncached(require, configPath),
			previousCache = utils.requireUncached(require,abCachePath),
			channel = client.channels.get(config.botNotificationBroadcastChannelID);

		if(err) return;

		if(!json) return;

		fs.writeFileSync(abCachePath, JSON.stringify(json), { encoding: 'utf8' });
	});

	await request({ url: 'https://trackerstatus.info/api/list/', json: true }, (err, res, json) => {
		const config = utils.requireUncached(require, configPath),
			previousCache = utils.requireUncached(require, cachePath),
			channel = client.channels.get(config.botNotificationBroadcastChannelID);

		if(err) return;

		if(!json) return;

		Object.keys(json).forEach(tracker => {
			const trackerInfo = json[tracker],
				cachedTrackerInfo = previousCache[tracker];

			if(!tracker || !cachedTrackerInfo) return;

			if(trackerInfoHasChanged(trackerInfo.Details, cachedTrackerInfo.Details)) {
				const embedInfo = _.clone(trackerInfo);

				if(channel) {
					const guild = client.guilds.get(config.botNotificationGuildID),
						role = guild.roles.find(role => role.name == tracker + '-notify'),
						embed = generateEmbed(tracker, true, embedInfo);

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
	const interval = 600000;
	setInterval(() => monitor(client), 10000);
};
