const request = require('request'),
	generateEmbed = require('./generateTrackerEmbed.js'),
	path = require('path'),
	fs = require('fs'),
	_ = require('lodash'),
	utils = require('../utils.js');

const monitor = client => {
	const configPath = path.join(__dirname, '../../config.json'),
		cachePath = path.join(__dirname, '../../cache.json'),
		config = require(configPath),
		previousCache = require(cachePath);

	request({ url: 'https://trackerstatus.info/api/list/', json: true }, (err, res, json) => {
		if(err) return;

		if(!json) return;

		Object.keys(json).forEach(tracker => {
			const trackerInfo = json[tracker],
				cachedTrackerInfo = previousCache[tracker];

			const difference = _.difference(trackerInfo.Details, cachedTrackerInfo.Details);

			if(difference.length) {
				const embedInfo = _.clone(trackerInfo);
				embedInfo.hasChanged = true;
				embedInfo.trackerName = tracker;

				if(config.botBroadcastChannelID) {
					const channel = client.channels.get(config.botBroadcastChannelID),
						embed = generateEmbed(client, embedInfo);

					channel.send(embed);
				}
			}
		});

		fs.writeFileSync(cachePath, JSON.stringify(json), { encoding: 'utf8' });
	});
};

module.exports = client => {
	const interval = 2000;
	setInterval(() => monitor(client), interval);
};
