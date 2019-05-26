const Discord = require('discord.js'),
	generateEmbed = require('../tracker/generateTrackerEmbed.js'),
	utils = require('../utils.js'),
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

	const cache = utils.requireUncached(require, cachePath),
		config = utils.requireUncached(require, configPath);

	if(config.botBroadcastChannelID) {
		if(channel.id !== config.botBroadcastChannelID) {
			return;
		}
	}

	if(!cache){
		console.log('No cache file found.');
		channel.send(NOTFOUND_MSG);
		return;
	}

	if(tracker == "ipt") {
		channel.send("Please donate for access to IPT status information.");
		return;
	}

	if(tracker == "ab") {

	}

	if(tracker == "schwanz") {
		const embed = generateEmbed(client, tracker, false, {
			Description: "All six services online.",
			Details: {
				Website: "1",
				API: "1",
				TrackerHTTP: "1",
				TrackerHTTPS: "1",
				IRCServer: "1",
				IRCTorrentAnnouncer: "1",
			}
		});
		channel.send(embed);
		return;
	}

	const trackerInfo = cache[tracker];

	if(!trackerInfo || !trackerInfo['Details']) {
		channel.send(NOTFOUND_MSG);
		return;
	}

	const embed = generateEmbed(client, tracker, false, trackerInfo);
	channel.send(embed);
};
