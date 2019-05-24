const Discord = require('discord.js'),
	generateTrackerEmbed = require('../tracker/generateTrackerEmbed.js'),
	request = require('request'),
	path = require('path'),
	fs = require('fs');

const configPath = path.join(__dirname, '../../config.json'),
	cachePath = path.join(__dirname, '../../cache.json'),
	NOTFOUND_MSG = "Could not find information for that tracker. Please try again.";

module.exports = (client, message, args) => {
	const { channel } = message,
		tracker = args[0];

	const { user: { username, avatarURL } } = client;

	const cache = require(cachePath),
		config = require(configPath);

	if(config.botBroadcastChannelID) {
		if(channel.id !== config.botBroadcastChannelID) {
			return;
		}
	}

	if(!cache){
		channel.send(NOTFOUND_MSG);
		return;
	}

	if(tracker == "ipt") {
		channel.send("Please donate to get access to IPT status.");
		return;
	}

	const trackerStatus = cache[tracker];

	if(!trackerStatus || !trackerStatus['Details']) {
		channel.send(NOTFOUND_MSG);
		return;
	}

	trackerStatus.trackerName = tracker;

	const embed = generateTrackerEmbed(client, trackerStatus);

	channel.send(embed);
};
