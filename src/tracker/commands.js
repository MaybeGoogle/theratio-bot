const Discord = require('discord.js'),
	generateEmbed = require('./generateTrackerEmbed.js'),
	request = require('request'),
	path = require('path'),
	fs = require('fs');

const configPath = path.join(__dirname, '../../config.json'),
	cachePath = path.join(__dirname, '../../cache.json'),
	trackers = ['ar','btn','ggn','mtv','nwcd','ptp','red','32p','ops'],
	NOTFOUND_MSG = "Could not find information for that tracker. Please try again.";

const trackerFunc = tracker => (client, message, args) => {
	const { channel } = message;
	const { user: { username, avatarURL } } = client;

	const cache = require(cachePath),
		config = require(configPath);

	if(config.botBroadcastChannelID) {
		if(!channel.id === config.botBroadcastChannelID) {
			return;
		}
	}

	if(!cache){
		channel.send(NOTFOUND_MSG);
		return;
	}

	const trackerStatus = cache[tracker];

	if(!trackerStatus || !trackerStatus['Details']) {
		channel.send(NOTFOUND_MSG);
		return;
	}

	trackerStatus.trackerName = tracker;

	const embed = generateEmbed(trackerStatusInfo);

	channel.send(embed);
};

module.exports = client => {
	trackers.forEach(tracker => {
		client.commands[tracker + '-status'] = trackerFunc(tracker);
	});
};
