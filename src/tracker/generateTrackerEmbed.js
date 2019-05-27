const Discord = require('discord.js'),
	_ = require('lodash');

module.exports = (trackerName, hasChanged, trackerStatusInfo) => {
	const { Description, Details, URL } = trackerStatusInfo,
		title = hasChanged ? `Service status for ${trackerName} has changed:` : `Service status for ${trackerName}`,
		embed = {
			title,
			description: _.capitalize(Description),
			url: URL,
			color: 3447003,
			fields: []
		};

	for(let name in Details) {
		let value;
		const statusCode = Details[name];

		if(statusCode == "0") {
			value = "Offline";
		} else if (statusCode == "1") {
			value = "Online";
		} else if (statusCode == "2") {
			value = "Unstable";
		} else{
			value = "Undetermined";
		}

		embed.fields.push({ name, value, inline: true });
	}

	return embed;
};
