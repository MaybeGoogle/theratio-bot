const generateEmbed = require('./generateTrackerEmbed.js');

module.exports = (hasChanged, info) => {
	return generateEmbed('AnimeBytes', hasChanged, {
		URL: "https://status.animebytes.tv",
		Details: {
			Website: info['site_status'],
			Tracker: info['tracker_status'],
			IRCServer: info['irc_status']
		}
	});
};
