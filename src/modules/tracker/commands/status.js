const Discord = require('discord.js'),
	generateEmbed = require('../utils/generateTrackerEmbed.js'),
	generateAnimeBytesEmbed = require('../utils/generateAnimeBytesEmbed.js'),
	utils = require('../../../utils'),
	path = require('path'),
	fs = require('fs');

const configPath = path.join(__dirname, '../../../../config.json'),
	cachePath = path.join(__dirname, '../../../../cache.json'),
	abCachePath = path.join(__dirname, '../../../../ab.cache.json'),
	NOTFOUND_MSG = "Could not find information for that tracker. Please try again.";

module.exports = (client, message, args) => {
	const { user: { username, avatarURL } } = client,
		{ channel } = message,
		tracker = args[0],
		cache = utils.requireUncached(require, cachePath),
		config = utils.requireUncached(require, configPath);

	if(config.botBroadcastChannelID) {
		if(channel.id !== config.botBroadcastChannelID) {
			return;
		}
	}

	if(!cache){
		console.log(utils.generateErrorEmbed('No cache file found.'));
		return;
	}

	if(tracker == "ipt") {
		channel.send(utils.generateErrorEmbed("Please donate for access to IPT status information."));
		return;
	}

	if(tracker == "ab") {
		const abCache = utils.requireUncached(require, abCachePath),
			embed = generateAnimeBytesEmbed(false, abCache);

		channel.send({ embed });
		return;
	}

	if(tracker == "schwanz") {
		const embed = generateEmbed(tracker, false, {
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
		channel.send({ embed });
		return;
	}

	const trackerInfo = cache[tracker];

	if(!trackerInfo || !trackerInfo['Details']) {
		channel.send(NOTFOUND_MSG);
		return;
	}

	const embed = generateEmbed(tracker.toUpperCase(), false, trackerInfo);
	channel.send({ embed });
};
