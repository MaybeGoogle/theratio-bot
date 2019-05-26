const Discord = require('discord.js'),
	_ = require('lodash');

const trackerStatusAPIResponseEmbed = (client, trackerName, hasChanged, trackerStatusInfo) => {
	let preMessage;
	const { Description, Details, URL } = trackerStatusInfo,
		title = hasChanged ? `Service status for ${trackerName.toUpperCase()} has changed:` : `Service status for ${trackerName.toUpperCase()}`;

	const embed = {
		title,
		description: _.capitalize(Description),
		url: URL,
		color: 3447003,
		fields: []
	};

	for(let name in Details) {
		let value;
		const statusCode = Details[name];

		if(statusCode === "0") {
			value = "Offline";
		} else if (statusCode === "1") {
			value = "Online";
		} else if (statusCode === "2") {
			value = "Unstable";
		}

		embed.fields.push({ name, value, inline: true });
	}

	return embed;
};

module.exports = (client, trackerName, hasChanged, trackerStatusInfo) => {
	if(trackerName === 'ab') {

	} else {
		return trackerStatusAPIResponseEmbed(client, trackerName, hasChanged, trackerStatusInfo);
	}
};
