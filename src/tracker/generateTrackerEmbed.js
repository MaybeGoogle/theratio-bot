const Discord = require('discord.js'),
	_ = require('lodash');

module.exports = (client, trackerStatusInfo) => {
	const { hasChanged, trackerName, Description, Details, URL } = trackerStatusInfo;
	const title = hasChanged ? `Service status for ${trackerName.toUpperCase()} has changed:` : `Service status for ${trackerName.toUpperCase()}`;

	const guild = client.guilds.first(),
		role = guild.roles.get('name', trackerName + '-notify');

	const embed = new Discord.RichEmbed()
		.setColor(3447003)
		.setTitle(title)
		.setDescription(_.capitalize(Description))
		.setURL(URL);

	if(hasChanged && role) {
		embed
			.addBlankField(true)
			.addField(" ", "Paging " + role.toString())
			.addBlankField(true);
	}

	for(let service in Details) {
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
	}

	return embed;
};
