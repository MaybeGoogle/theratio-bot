const Discord = require('discord.js'),
	request = require('request');

const capitaliseFirst = string => string.charAt(0).toUpperCase() + string.slice(1);

const trackers = ['ar','btn','ggn','mtv','nwcd','ptp','red','32p','ops'],
	serviceTypes = ['Website','TrackerHTTP','IRCServer','IRCTorrentAnnouncer'];

const trackerFunc = tracker => (client, message, args) => {
	const { channel } = message;
	const { user: { username, avatarURL } } = client;

	const sosEmoji = client.emojis.find(emoji => emoji.name === "sos"),
		checkEmoji = client.emojis.find(emoji => emoji.name === "white_check_mark");

	request({ url: 'https://trackerstatus.info/api/list/', json: true }, (err, res, json) => {
		if(err) {
			channel.send("Could not communicate with trackerstatus.info's API. Please try again later.");
			return;
		}

		const trackerStatus = json[tracker];

		if(!trackerStatus || !trackerStatus['Details']) {
			channel.send("Could not find information for that tracker in trackerstatus.info's API. Please try again.");
			return;
		}

		const embed = new Discord.RichEmbed()
			.setColor(3447003)
			.setTitle(`Tracker service status for ${tracker.toUpperCase()}`)
			.setDescription(capitaliseFirst(trackerStatus.Description))

		serviceTypes.forEach(service => {
			let value;
			const statusCode = trackerStatus.Details[service];

			console.log(statusCode);

			if(statusCode === "0") {
				value = "Offline";
			} else if (statusCode === "1") {
				value = "Online";
			} else if (statusCode === "2") {
				value = "Unstable";
			}
			
			embed.addField(service, value, true);
		});

		channel.send(embed);
	});
};

module.exports = client => {
	
	trackers.forEach(tracker => {
		client.commands[tracker + '-status'] = trackerFunc(tracker);
	});

};
