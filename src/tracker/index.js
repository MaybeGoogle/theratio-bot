const request = require('request'),
	generateEmbed = require('./generateTrackerEmbed.js'),
	utils = require('../utils.js'),
	path = require('path'),
	fs = require('fs'),
	_ = require('lodash'),
	configPath = path.join(__dirname, '../../config.json'),
	cachePath = path.join(__dirname, '../../cache.json');

const monitor = client => {
	request({ url: 'https://trackerstatus.info/api/list/', json: true }, (err, res, json) => {
		const config = utils.requireUncached(require, configPath),
			previousCache = utils.requireUncached(require, cachePath),
			channel = client.channels.get(config.botNotificationBroadcastChannelID);

		if(err) return;

		if(!json) return;

		Object.keys(json).forEach(tracker => {
			const trackerInfo = json[tracker],
				cachedTrackerInfo = previousCache[tracker];

			if(!tracker || !cachedTrackerInfo) return;

			if(!_.isEqual(trackerInfo.Details, cachedTrackerInfo.Details)) {
				const embedInfo = _.clone(trackerInfo);

				if(channel) {
					const guild = client.guilds.get(config.botNotificationGuildID),
						role = guild.roles.find(role => role.name == tracker + '-notify'),
						embed = generateEmbed(client, tracker, true, embedInfo);

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
