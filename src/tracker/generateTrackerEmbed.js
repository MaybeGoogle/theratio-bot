const Discord = require('discord.js'),
	utils = require('../utils.js');

const serviceTypes = ['Website','TrackerHTTP','IRCServer','IRCTorrentAnnouncer'];

module.exports = trackerStatusInfo => {
	const { trackerName, Description, Details } = trackerStatusInfo;

	const embed = new Discord.RichEmbed()
		.setColor(3447003)
		.setTitle(`Tracker service status for ${trackerName.toUpperCase()}`)
		.setDescription(utils.capitaliseFirst(Description))

	serviceTypes.forEach(service => {
		let value;
		const statusCode = Details[service];

		if(statusCode === "0") {
			value = "Offline";
		} else if (statusCode === "1") {
			value = "Online";
		} else if (statusCode === "2") {
			value = "Unstable";
		}
		
		embed.addField(service, value, true);
	});

	return embed;
};
